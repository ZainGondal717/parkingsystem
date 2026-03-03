"use client";
import { useState, useEffect, useRef } from "react";
import { X, AlertCircle, Check } from "lucide-react";
import Tesseract from "tesseract.js";

export default function CameraScanner({ onPlateDetected, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [detectedPlate, setDetectedPlate] = useState(null);
    const [confidence, setConfidence] = useState(0);
    const [error, setError] = useState(null);
    const [stream, setStream] = useState(null);
    const [isReady, setIsReady] = useState(false);
    
    const scanningIntervalRef = useRef(null);
    const workerRef = useRef(null);
    const isProcessingRef = useRef(false);
    const attemptCountRef = useRef(0);

    // Initialize camera and OCR worker
    useEffect(() => {
        const initializeCamera = async () => {
            try {
                console.log("🎥 Initializing camera...");
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    setStream(mediaStream);
                    console.log("✅ Camera stream started");
                }

                // Initialize Tesseract worker
                console.log("📦 Initializing Tesseract.js worker...");
                const worker = await Tesseract.createWorker({
                    logger: m => console.log("📊 Tesseract:", m)
                });
                
                // Initialize the worker with English language
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                
                workerRef.current = worker;
                console.log("✅ Tesseract worker ready");
                
                // Set ready flag and start scanning only after worker is fully initialized
                setIsReady(true);
            } catch (err) {
                console.error("❌ Initialization error:", err);
                setError(err.message || "Unable to initialize camera or OCR.");
            }
        };

        initializeCamera();

        return () => {
            // Cleanup
            if (scanningIntervalRef.current) {
                clearInterval(scanningIntervalRef.current);
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                console.log("🛑 Camera stream stopped");
            }
            if (workerRef.current) {
                workerRef.current.terminate();
                console.log("🛑 Tesseract worker terminated");
            }
        };
    }, []);

    // Start scanning once worker is ready
    useEffect(() => {
        if (!isReady || !workerRef.current) return;

        console.log("🔍 Starting plate scanning...");
        startScanning();

        return () => {
            if (scanningIntervalRef.current) {
                clearInterval(scanningIntervalRef.current);
            }
        };
    }, [isReady]);

    const startScanning = () => {
        if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);

        scanningIntervalRef.current = setInterval(async () => {
            // Skip if already processing
            if (isProcessingRef.current || !videoRef.current || !canvasRef.current) return;

            try {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                const video = videoRef.current;

                // Check if video is ready
                if (video.videoWidth === 0 || video.videoHeight === 0) {
                    console.log("⏳ Video not ready yet...");
                    return;
                }

                // Draw current video frame to canvas
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0);

                isProcessingRef.current = true;

                // Crop to focus on plate areas (usually lower-middle part of frame)
                const croppedCanvas = document.createElement("canvas");
                const croppedCtx = croppedCanvas.getContext("2d");

                const cropHeight = canvas.height * 0.4;
                const cropTop = canvas.height * 0.5;
                croppedCanvas.width = canvas.width;
                croppedCanvas.height = cropHeight;

                // Draw the cropped section
                croppedCtx.drawImage(
                    canvas,
                    0,
                    cropTop,
                    canvas.width,
                    cropHeight,
                    0,
                    0,
                    croppedCanvas.width,
                    croppedCanvas.height
                );

                console.log(`📸 Scanning attempt ${attemptCountRef.current + 1}...`);

                // Run OCR on cropped section
                const result = await workerRef.current.recognize(croppedCanvas);
                const text = result.data.text.trim().toUpperCase();
                const ocrConfidence = result.data.confidence || 0;

                console.log(`📝 OCR Result: "${text}", Confidence: ${ocrConfidence.toFixed(1)}%`);

                // Extract license plate pattern (alphanumeric, typically 3-10 characters)
                const plateMatch = text.match(/[A-Z0-9\-]{3,10}/);
                const plateNumber = plateMatch ? plateMatch[0].replace(/[-\s]/g, "") : null;

                // Calculate confidence based on OCR confidence and pattern validity
                let calculatedConfidence = ocrConfidence;

                // Validate and boost confidence for valid patterns
                if (plateNumber && /^[A-Z0-9]{3,10}$/.test(plateNumber)) {
                    // Keep the OCR confidence for valid patterns
                    calculatedConfidence = Math.min(95, calculatedConfidence);
                    console.log(`✅ Valid plate detected: ${plateNumber} (${calculatedConfidence.toFixed(1)}%)`);
                } else {
                    calculatedConfidence = 0;
                }

                setDetectedPlate(plateNumber || null);
                setConfidence(Math.round(calculatedConfidence));
                attemptCountRef.current++;

                // AUTO-CAPTURE when confidence is high (>60%)
                if (calculatedConfidence > 60 && plateNumber) {
                    console.log("🎉 AUTO-CAPTURING plate:", plateNumber);
                    triggerCapture(plateNumber);
                    return;
                }

                // Timeout after 60 attempts (~30 seconds)
                if (attemptCountRef.current > 60) {
                    console.warn("⏱️ Timeout: Could not detect plate");
                    setError("No license plate detected. Try again or enter manually.");
                    if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);
                }

            } catch (err) {
                console.error("❌ Scanning error:", err);
            } finally {
                isProcessingRef.current = false;
            }
        }, 500); // Scan every 500ms (2 scans per second)
    };

    const triggerCapture = (plateNumber) => {
        if (scanningIntervalRef.current) {
            clearInterval(scanningIntervalRef.current);
        }
        
        // Call parent callback with detected plate
        onPlateDetected(plateNumber);
        
        // Close modal after successful capture
        setTimeout(() => onClose(), 300);
    };

    const handleManualCapture = () => {
        if (detectedPlate && confidence > 50) {
            triggerCapture(detectedPlate);
        } else {
            setError("Confidence too low. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
            {/* Main Scanner Container */}
            <div className="relative w-full h-full max-w-2xl max-h-screen flex flex-col bg-black rounded-lg overflow-hidden">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex justify-between items-center">
                    <h3 className="text-white font-semibold text-lg">Scan License Plate</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Initialization Status */}
                {!isReady && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                        <div className="text-center">
                            <div className="spinner w-12 h-12 border-4 border-blue-500 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white font-semibold">Initializing scanner...</p>
                            <p className="text-gray-400 text-sm mt-2">Loading OCR engine (30-45 sec)</p>
                        </div>
                    </div>
                )}

                {/* Video Stream */}
                <div className="relative flex-1 overflow-hidden bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />

                    {/* Scanning Focus Box */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-80 h-48 border-2 border-blue-500 rounded-lg opacity-50 flex items-center justify-center">
                            <div className="text-blue-500 text-sm font-semibold">Position plate here</div>
                        </div>
                    </div>

                    {/* Hidden Canvas for OCR */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Detected Plate Display */}
                    {detectedPlate && (
                        <div className="absolute top-20 left-4 right-4 bg-green-900/90 backdrop-blur-sm border border-green-500 rounded-lg p-4">
                            <div className="text-green-300 text-xs font-semibold mb-1">DETECTED PLATE</div>
                            <div className="text-white text-3xl font-bold font-mono mb-2 tracking-widest">{detectedPlate}</div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${
                                            confidence > 60
                                                ? "bg-green-500"
                                                : confidence > 40
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                        }`}
                                        style={{ width: `${confidence}%` }}
                                    />
                                </div>
                                <span className="text-white text-xs font-semibold">{confidence}%</span>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="absolute bottom-24 left-4 right-4 bg-red-900/90 border border-red-500 rounded-lg p-3 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="absolute bottom-20 left-4 right-4 text-center">
                    <p className="text-white text-xs opacity-75">
                        {!isReady
                            ? "⏳ Loading... (first time may take 30-45 seconds)"
                            : detectedPlate
                            ? confidence > 60
                                ? "✅ Excellent! Auto-capturing..."
                                : "📸 Keep steady..."
                            : "🔍 Searching for plate..."}
                    </p>
                </div>

                {/* Footer Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex gap-3">
                    {/* Close/Cancel Button */}
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                        Close
                    </button>

                    {/* Manual Capture Button - appears when plate detected */}
                    {detectedPlate && confidence > 50 && (
                        <button
                            onClick={handleManualCapture}
                            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Confirm Plate
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
