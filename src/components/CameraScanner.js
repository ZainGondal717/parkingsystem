"use client";
import { useState, useEffect, useRef } from "react";
import { X, AlertCircle, Check, Zap, Camera as CameraIcon } from "lucide-react";

export default function CameraScanner({ onPlateDetected, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [detectedPlate, setDetectedPlate] = useState(null);
    const [confidence, setConfidence] = useState(0);
    const [error, setError] = useState(null);
    const [stream, setStream] = useState(null);
    const [initPhase, setInitPhase] = useState("camera"); // camera, ready, scanning
    const [initProgress, setInitProgress] = useState(0);
    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [plateHistory, setPlateHistory] = useState([]);
    
    const scanningIntervalRef = useRef(null);
    const attemptCountRef = useRef(0);
    const validDetectionsRef = useRef(0);

    // ADVANCED PLATE VALIDATION
    const validatePlateFormat = (text) => {
        // Normalize text
        const cleaned = text.toUpperCase().replace(/[^A-Z0-9\-]/g, '');

        // Common plate formats to match (prevents random text detection)
        const patterns = [
            /^[A-Z]{2,3}[-]?\d{4,5}$/, // ABC-1234 or ABC1234
            /^[A-Z0-9]{3,4}[-]?[A-Z0-9]{3,5}$/, // Mixed formats
            /^\d{4,5}[-]?[A-Z]{2,3}$/, // 1234-ABC
            /^[A-Z]{1,3}[-]?\d{3,5}[-]?[A-Z]{0,2}$/, // Complex formats
        ];

        // Check if it matches any pattern
        const isValidFormat = patterns.some(pattern => pattern.test(cleaned));
        
        // Additional validation: 
        // - Must have both letters and numbers (avoids pure number/letter text)
        // - Length between 5-10 characters
        const hasLetters = /[A-Z]/.test(cleaned);
        const hasNumbers = /\d/.test(cleaned);
        const lengthOk = cleaned.length >= 5 && cleaned.length <= 10;
        
        const isValid = isValidFormat && hasLetters && hasNumbers && lengthOk;
        
        console.log(`🔍 Plate validation: "${text}" → "${cleaned}" (Valid: ${isValid})`);

        return isValid ? cleaned : null;
    };

    // Initialize camera
    useEffect(() => {
        const initializeCamera = async () => {
            try {
                console.log("🎥 Phase 1: Requesting camera access...");
                setInitPhase("camera");
                setInitProgress(0);

                // Simulate progress
                const progressInterval = setInterval(() => {
                    setInitProgress(prev => Math.min(prev + 15, 60));
                }, 300);

                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                });

                clearInterval(progressInterval);
                setInitProgress(70);

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    setStream(mediaStream);
                    console.log("✅ Camera access granted");
                }

                // Wait for video to be ready
                await new Promise(resolve => {
                    if (videoRef.current) {
                        videoRef.current.onloadedmetadata = () => {
                            console.log("✅ Video metadata loaded");
                            setInitProgress(90);
                            resolve();
                        };
                    }
                });

                // Ready to scan!
                setInitProgress(100);
                setTimeout(() => {
                    console.log("✅ Camera scanner ready!");
                    setInitPhase("ready");
                    setTimeout(() => {
                        setInitPhase("scanning");
                        startScanning();
                    }, 1500);
                }, 500);

            } catch (err) {
                console.error("❌ Camera error:", err);
                setError("Camera access denied. Please enable camera permissions.");
                setInitPhase("error");
            }
        };

        initializeCamera();

        return () => {
            if (scanningIntervalRef.current) {
                clearInterval(scanningIntervalRef.current);
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                console.log("🛑 Camera stopped");
            }
        };
    }, []);

    // Start scanning once ready
    const startScanning = () => {
        if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);

        scanningIntervalRef.current = setInterval(() => {
            captureFrame();
        }, 600); // 1.67 fps - optimal for accuracy & performance
    };

    const captureFrame = async () => {
        if (!videoRef.current || !canvasRef.current || isSendingRequest) return;

        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const video = videoRef.current;

            if (video.videoWidth === 0 || video.videoHeight === 0) return;

            // Draw current frame
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);

            // Convert to base64
            const base64Image = canvas.toDataURL("image/jpeg", 0.8);

            setIsSendingRequest(true);
            attemptCountRef.current++;

            // Send to API
            const response = await fetch("/api/scan-plate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image }),
            });

            if (!response.ok) {
                setIsSendingRequest(false);
                return;
            }

            const data = await response.json();

            if (data.text) {
                // VALIDATE PLATE FORMAT (prevents random text detection)
                const validPlate = validatePlateFormat(data.text);

                if (validPlate) {
                    validDetectionsRef.current++;
                    
                    // Build history
                    setPlateHistory(prev => {
                        const updated = [...prev, validPlate];
                        return updated.slice(-5); // Keep last 5 detections
                    });

                    // Confidence increases with repeated detections
                    const baseConfidence = 82;
                    const bonusPerDetection = 4;
                    const displayConfidence = Math.min(99, baseConfidence + (validDetectionsRef.current * bonusPerDetection));

                    console.log(`✅ VALID PLATE: ${validPlate} (Confidence: ${displayConfidence}%)`);

                    setDetectedPlate(validPlate);
                    setConfidence(displayConfidence);

                    // AUTO-CAPTURE at high confidence
                    if (displayConfidence >= 90 && validDetectionsRef.current >= 2) {
                        console.log("🎉 HIGH CONFIDENCE - AUTO-CAPTURING!");
                        triggerCapture(validPlate);
                        return;
                    }
                } else {
                    // Invalid format - reset
                    if (plateHistory.includes(data.text)) {
                        console.log(`⚠️ Random text detected (not a plate): "${data.text}"`);
                    }
                    validDetectionsRef.current = 0;
                    setPlateHistory([]);
                    setDetectedPlate(null);
                    setConfidence(0);
                }
            } else {
                validDetectionsRef.current = 0;
                setDetectedPlate(null);
                setConfidence(0);
            }

            // Extended timeout
            if (attemptCountRef.current > 180) { // 3 minutes
                console.warn("⏱️ Timeout");
                setError("Unable to detect plate. Try positioning it clearer in the box.");
                if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);
            }

        } catch (err) {
            console.error("❌ Error:", err);
        } finally {
            setIsSendingRequest(false);
        }
    };

    const triggerCapture = (plateNumber) => {
        if (scanningIntervalRef.current) {
            clearInterval(scanningIntervalRef.current);
        }
        onPlateDetected(plateNumber);
        setTimeout(() => onClose(), 300);
    };

    const handleManualCapture = () => {
        if (detectedPlate && confidence >= 85) {
            triggerCapture(detectedPlate);
        } else {
            setError("Confidence too low. Keep the plate steady.");
        }
    };

    // ========== PROFESSIONAL UI ==========

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 z-50 flex items-center justify-center p-4">
            {/* Main Container */}
            <div className="relative w-full h-full max-w-3xl max-h-[600px] flex flex-col bg-black rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Header - Professional */}
                <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <CameraIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">License Plate Scanner</h2>
                            <p className="text-blue-300 text-xs">Powered by Plate Recognizer</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-all"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* INITIALIZATION LOADER */}
                {initPhase !== "scanning" && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
                        <div className="text-center space-y-6">
                            {initPhase === "camera" && (
                                <>
                                    <div className="flex justify-center">
                                        <div className="relative w-20 h-20">
                                            {/* Outer rotating ring */}
                                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-blue-400 animate-spin"></div>
                                            {/* Middle pulsing ring */}
                                            <div className="absolute inset-2 rounded-full border-2 border-blue-500/30 animate-pulse"></div>
                                            {/* Inner icon */}
                                            <div className="absolute inset-6 flex items-center justify-center">
                                                <CameraIcon className="w-8 h-8 text-blue-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-lg">Initializing Camera</p>
                                        <p className="text-blue-300 text-sm mt-2">Please allow camera access</p>
                                    </div>
                                </>
                            )}

                            {initPhase === "ready" && (
                                <>
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center animate-pulse">
                                            <Check className="w-10 h-10 text-green-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-lg">Camera Ready!</p>
                                        <p className="text-green-300 text-sm mt-2">Starting scan...</p>
                                    </div>
                                </>
                            )}

                            {initPhase === "error" && (
                                <>
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 bg-red-500/20 border-2 border-red-400 rounded-full flex items-center justify-center">
                                            <AlertCircle className="w-10 h-10 text-red-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-lg">Camera Error</p>
                                        <p className="text-red-300 text-sm mt-2">{error}</p>
                                    </div>
                                </>
                            )}

                            {/* Progress Bar */}
                            <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300"
                                    style={{ width: `${initProgress}%` }}
                                />
                            </div>
                            <p className="text-gray-400 text-xs">{initProgress}%</p>
                        </div>
                    </div>
                )}

                {/* Video Stream */}
                <div className="relative flex-1 overflow-hidden bg-black mt-16">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />

                    {/* Professional Scanning Frame */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {/* Outer guide frame */}
                        <div className="relative w-96 h-56">
                            {/* Corner markers */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400"></div>

                            {/* Main frame */}
                            <div className="absolute inset-0 border-2 border-blue-400/30 rounded-xl"></div>

                            {/* Animated scanning line */}
                            <div className="absolute inset-0 overflow-hidden rounded-xl">
                                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse" style={{
                                    top: `${(attemptCountRef.current % 100) / 100 * 100}%`
                                }}></div>
                            </div>

                            {/* Guide text */}
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
                                <p className="text-blue-300 text-sm font-semibold">Position plate in frame</p>
                            </div>
                        </div>
                    </div>

                    {/* Hidden Canvas */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Detected Plate Card - Professional */}
                    {detectedPlate && (
                        <div className="absolute top-24 left-6 right-6 bg-gradient-to-br from-emerald-900 to-emerald-800 border border-emerald-400 rounded-xl p-5 shadow-2xl animate-in slide-in-from-top duration-300">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-emerald-300 text-xs font-bold tracking-wider uppercase">Detected Plate</p>
                                    <p className="text-white text-4xl font-black font-mono mt-2 tracking-[0.3em] drop-shadow">{detectedPlate}</p>
                                </div>
                                <Zap className="w-6 h-6 text-yellow-300" />
                            </div>

                            {/* Confidence Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-300 text-xs font-semibold">Confidence Score</span>
                                    <span className="text-white font-bold">{confidence}%</span>
                                </div>
                                <div className="w-full h-2.5 bg-emerald-950 rounded-full overflow-hidden border border-emerald-400/30">
                                    <div
                                        className={`h-full transition-all duration-200 ${
                                            confidence >= 90
                                                ? "bg-gradient-to-r from-green-400 to-green-500"
                                                : confidence >= 80
                                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                                : "bg-gradient-to-r from-orange-400 to-orange-500"
                                        }`}
                                        style={{ width: `${confidence}%` }}
                                    />
                                </div>
                            </div>

                            {/* Status indicator */}
                            <div className="mt-4 p-3 bg-emerald-800/50 rounded-lg border border-emerald-400/20">
                                <p className="text-emerald-300 text-xs">
                                    {confidence >= 90 && validDetectionsRef.current >= 2
                                        ? "✅ Auto-capturing in seconds..."
                                        : confidence >= 85
                                        ? "📸 Excellent! Ready to capture"
                                        : "⏳ Keep steady... building confidence"
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Card */}
                    {error && (
                        <div className="absolute bottom-28 left-6 right-6 bg-red-900/80 border border-red-500 rounded-xl p-4 flex gap-3 animate-in fade-in">
                            <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Processing Indicator */}
                    {isSendingRequest && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="w-16 h-16 border-4 border-blue-400/20 border-t-blue-400 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="absolute bottom-20 left-6 right-6 text-center">
                    <p className="text-blue-300 text-xs font-mono">
                        {isSendingRequest 
                            ? "📤 Processing frame..." 
                            : attemptCountRef.current === 0
                            ? "🔍 Ready to scan..."
                            : `🔍 Scanning... Frame #${attemptCountRef.current}`
                        }
                    </p>
                </div>

                {/* Footer Controls - Professional */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-gray-700/80 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 border border-gray-600"
                        disabled={isSendingRequest}
                    >
                        Close
                    </button>

                    {detectedPlate && confidence >= 80 && (
                        <button
                            onClick={handleManualCapture}
                            disabled={isSendingRequest}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                        >
                            <Check className="w-5 h-5" />
                            Confirm Plate
                        </button>
                    )}
                </div>

                {/* Info Badge */}
                <div className="absolute top-20 right-6 flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400 rounded-lg px-4 py-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-blue-200 text-xs font-semibold">Plate Recognizer</p>
                </div>

                {/* Instruction Panel - Subtle */}
                <div className="absolute bottom-20 left-6 text-xs text-blue-300/60 space-y-1 pointer-events-none">
                    <p>✓ Good lighting</p>
                    <p>✓ Clear angle</p>
                    <p>✓ Steady position</p>
                </div>
            </div>
        </div>
    );
}
