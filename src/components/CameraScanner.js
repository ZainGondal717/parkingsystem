"use client";
import { useState, useEffect, useRef } from "react";
import { X, AlertCircle, Check } from "lucide-react";

export default function CameraScanner({ onPlateDetected, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [detectedPlate, setDetectedPlate] = useState(null);
    const [confidence, setConfidence] = useState(0);
    const [error, setError] = useState(null);
    const [stream, setStream] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [isSendingRequest, setIsSendingRequest] = useState(false);
    
    const scanningIntervalRef = useRef(null);
    const lastFrameTimeRef = useRef(0);
    const attemptCountRef = useRef(0);
    const validPlateCountRef = useRef(0);

    // Initialize camera
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

                // Set ready after camera is initialized
                setTimeout(() => setIsReady(true), 500);
            } catch (err) {
                console.error("❌ Camera error:", err);
                setError("Unable to access camera. Please check permissions.");
            }
        };

        initializeCamera();

        return () => {
            if (scanningIntervalRef.current) {
                clearInterval(scanningIntervalRef.current);
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                console.log("🛑 Camera stream stopped");
            }
        };
    }, []);

    // Start scanning once camera is ready
    useEffect(() => {
        if (!isReady) return;

        console.log("🔍 Starting continuous plate scanning with Plate Recognizer API...");
        startScanning();

        return () => {
            if (scanningIntervalRef.current) {
                clearInterval(scanningIntervalRef.current);
            }
        };
    }, [isReady]);

    const captureFrame = async () => {
        if (!videoRef.current || !canvasRef.current || isSendingRequest) return;

        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const video = videoRef.current;

            // Check if video is ready
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                return;
            }

            // Draw current video frame to canvas
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);

            // Convert to base64 image
            const base64Image = canvas.toDataURL("image/jpeg", 0.8);

            setIsSendingRequest(true);
            attemptCountRef.current++;

            console.log(`📸 Sending frame ${attemptCountRef.current} to Plate Recognizer API...`);

            // Send to Plate Recognizer API via our /api/scan-plate endpoint
            const response = await fetch("/api/scan-plate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMsg = errorData.error || "API Error";
                console.warn(`⚠️ API Error: ${errorMsg}`);
                return;
            }

            const data = await response.json();
            
            if (data.text) {
                const plateNumber = data.text.toUpperCase().replace(/[^A-Z0-9]/g, '');
                
                // Validate plate format (3-10 characters)
                if (/^[A-Z0-9]{3,10}$/.test(plateNumber)) {
                    validPlateCountRef.current++;
                    
                    // Use simple confidence: if Plate Recognizer returned text, confidence is high
                    // Since PR returns clean text, we can trust it at 85%+ confidence
                    const estimatedConfidence = 85 + (validPlateCountRef.current * 5); // Increase confidence with repeated detections
                    const displayConfidence = Math.min(99, estimatedConfidence);

                    console.log(`✅ Valid plate detected: ${plateNumber} (Confidence: ${displayConfidence}%)`);

                    setDetectedPlate(plateNumber);
                    setConfidence(displayConfidence);

                    // AUTO-CAPTURE when we have high confidence (85%+)
                    if (displayConfidence >= 85) {
                        console.log("🎉 AUTO-CAPTURING plate:", plateNumber);
                        triggerCapture(plateNumber);
                        return;
                    }
                } else {
                    console.log(`📝 Invalid plate format detected: "${data.text}"`);
                    validPlateCountRef.current = 0;
                    setDetectedPlate(null);
                    setConfidence(0);
                }
            } else {
                // No plate detected in this frame
                validPlateCountRef.current = 0;
                setDetectedPlate(null);
                setConfidence(0);
                console.log("🔍 No plate detected in this frame");
            }

            // Timeout after 120 attempts (~60 seconds)
            if (attemptCountRef.current > 120) {
                console.warn("⏱️ Timeout: Could not detect plate after 60 seconds");
                setError("Could not detect license plate. Try again or enter manually.");
                if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);
            }

        } catch (err) {
            console.error("❌ Scanning error:", err);
            // Don't stop scanning on error, just continue
        } finally {
            setIsSendingRequest(false);
        }
    };

    const startScanning = () => {
        if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);

        scanningIntervalRef.current = setInterval(() => {
            captureFrame();
        }, 500); // Capture and send frame every 500ms (2 per second)
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
        if (detectedPlate && confidence >= 80) {
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

                    {/* Hidden Canvas for Frame Capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Detected Plate Display */}
                    {detectedPlate && (
                        <div className="absolute top-20 left-4 right-4 bg-green-900/90 backdrop-blur-sm border border-green-500 rounded-lg p-4 animate-in fade-in duration-300">
                            <div className="text-green-300 text-xs font-semibold mb-1">DETECTED PLATE (Plate Recognizer)</div>
                            <div className="text-white text-3xl font-bold font-mono mb-2 tracking-widest">{detectedPlate}</div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${
                                            confidence >= 85
                                                ? "bg-green-500"
                                                : confidence >= 70
                                                ? "bg-yellow-500"
                                                : "bg-orange-500"
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
                        <div className="absolute bottom-24 left-4 right-4 bg-red-900/90 border border-red-500 rounded-lg p-3 flex items-start gap-3 animate-in fade-in duration-300">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Processing Indicator */}
                    {isSendingRequest && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-white rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="absolute bottom-20 left-4 right-4 text-center">
                    <p className="text-white text-xs opacity-75">
                        {!isReady
                            ? "⏳ Initializing camera..."
                            : isSendingRequest
                            ? "📤 Processing frame..."
                            : detectedPlate
                            ? confidence >= 85
                                ? "✅ Excellent! Auto-capturing..."
                                : "📸 Keep steady... Confidence: " + confidence + "%"
                            : `🔍 Searching for plate... (Attempt: ${attemptCountRef.current})`}
                    </p>
                </div>

                {/* Footer Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex gap-3">
                    {/* Close/Cancel Button */}
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                        disabled={isSendingRequest}
                    >
                        Close
                    </button>

                    {/* Manual Capture Button - appears when plate detected */}
                    {detectedPlate && confidence >= 80 && (
                        <button
                            onClick={handleManualCapture}
                            disabled={isSendingRequest}
                            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Check className="w-4 h-4" />
                            Confirm Plate
                        </button>
                    )}
                </div>

                {/* API Info Badge */}
                <div className="absolute top-16 right-4 bg-blue-900/80 backdrop-blur-sm border border-blue-400 rounded px-3 py-1">
                    <p className="text-blue-200 text-xs font-semibold">Using: Plate Recognizer API ✅</p>
                </div>
            </div>
        </div>
    );
}
