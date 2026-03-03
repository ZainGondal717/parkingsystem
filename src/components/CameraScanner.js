"use client";
import { useState, useEffect, useRef } from "react";
import { X, AlertCircle, Check } from "lucide-react";
import Tesseract from "tesseract.js";

export default function CameraScanner({ onPlateDetected, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [detectedPlate, setDetectedPlate] = useState(null);
    const [confidence, setConfidence] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [stream, setStream] = useState(null);
    const [timeoutCounter, setTimeoutCounter] = useState(0);
    const scanningIntervalRef = useRef(null);
    const workerRef = useRef(null);

    // Initialize camera and OCR worker
    useEffect(() => {
        const initializeCamera = async () => {
            try {
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
                }

                // Initialize Tesseract worker
                const worker = await Tesseract.createWorker();
                workerRef.current = worker;

                // Start scanning after slight delay to ensure video is ready
                setTimeout(startScanning, 500);
            } catch (err) {
                console.error("Camera error:", err);
                setError("Unable to access camera. Please check permissions.");
            }
        };

        initializeCamera();

        return () => {
            // Cleanup
            if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const startScanning = () => {
        if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);

        scanningIntervalRef.current = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current || isProcessing) return;

            try {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                const video = videoRef.current;

                // Draw current video frame to canvas
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0);

                // Get image data for OCR
                const imageData = canvas.getImageData(0, 0, canvas.width, canvas.height);

                // Crop to focus on plate areas (usually lower-middle part of frame)
                const croppedCanvas = document.createElement("canvas");
                const croppedCtx = croppedCanvas.getContext("2d");

                const cropHeight = canvas.height * 0.4;
                const cropTop = canvas.height * 0.5;
                croppedCanvas.width = canvas.width;
                croppedCanvas.height = cropHeight;

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

                setIsProcessing(true);

                // Run OCR on cropped section
                const result = await workerRef.current.recognize(croppedCanvas);
                const text = result.data.text.trim().toUpperCase();

                // Extract license plate pattern (alphanumeric, typically 4-8 characters)
                const plateMatch = text.match(/[A-Z0-9\-]{3,10}/);
                const plateNumber = plateMatch ? plateMatch[0].replace(/[-\s]/g, "") : null;

                // Calculate confidence based on OCR confidence and pattern validity
                let calculatedConfidence = result.data.confidence || 0;

                // Filter out obvious non-plates
                if (plateNumber && /^[A-Z0-9]{3,10}$/.test(plateNumber)) {
                    // Boost confidence for valid patterns
                    calculatedConfidence = Math.min(95, calculatedConfidence + 10);
                } else {
                    calculatedConfidence = 0;
                }

                setDetectedPlate(plateNumber || null);
                setConfidence(Math.round(calculatedConfidence));
                setTimeoutCounter(prev => prev + 1);

                // AUTO-CAPTURE when confidence is high (>80%)
                if (calculatedConfidence > 80 && plateNumber) {
                    console.log("✅ Auto-captured plate:", plateNumber);
                    triggerCapture(plateNumber);
                }

                // Timeout after 30 attempts (~10 seconds)
                if (timeoutCounter > 30 && !plateNumber) {
                    setError("No license plate detected. Please try again or enter manually.");
                }

                setIsProcessing(false);
            } catch (err) {
                console.error("Scanning error:", err);
                setIsProcessing(false);
            }
        }, 333); // Scan every ~333ms (3 scans per second)
    };

    const triggerCapture = (plateNumber) => {
        if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        // Call parent callback with detected plate
        onPlateDetected(plateNumber);
        
        // Close modal after successful capture
        setTimeout(() => onClose(), 500);
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
            <div className="relative w-full h-full max-w-md max-h-screen flex flex-col bg-black rounded-lg overflow-hidden">
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

                {/* Video Stream */}
                <div className="relative flex-1 overflow-hidden bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    {/* Scanning Focus Box */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-72 h-40 border-2 border-blue-500 rounded-lg opacity-50 flex items-center justify-center">
                            <div className="text-blue-500 text-sm font-semibold">Position plate here</div>
                        </div>
                    </div>

                    {/* Hidden Canvas for OCR */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Detected Plate Display */}
                    {detectedPlate && (
                        <div className="absolute top-20 left-4 right-4 bg-green-900/90 backdrop-blur-sm border border-green-500 rounded-lg p-4">
                            <div className="text-green-300 text-xs font-semibold mb-1">DETECTED PLATE</div>
                            <div className="text-white text-2xl font-bold font-mono mb-2">{detectedPlate}</div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${
                                            confidence > 80
                                                ? "bg-green-500"
                                                : confidence > 60
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

                    {/* Processing Indicator */}
                    {isProcessing && (
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                            <div className="spinner w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="absolute bottom-20 left-4 right-4 bg-red-900/90 border border-red-500 rounded-lg p-3 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}
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

                {/* Status Bar */}
                <div className="absolute bottom-20 left-4 right-4 text-center">
                    <p className="text-white text-xs opacity-75">
                        {detectedPlate
                            ? confidence > 80
                                ? "✅ Ready to capture..."
                                : "📸 Aligning..."
                            : "🔍 Searching for plate..."}
                    </p>
                </div>
            </div>
        </div>
    );
}
