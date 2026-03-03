"use client";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function CameraScanner({ onPlateDetected, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [scanLinePosition, setScanLinePosition] = useState(0);
    
    const scanningIntervalRef = useRef(null);
    const validDetectionsRef = useRef(0);

    // Validate plate (only real plates, no random text)
    const validatePlateFormat = (text) => {
        const cleaned = text.toUpperCase().replace(/[^A-Z0-9\-]/g, '');

        const patterns = [
            /^[A-Z]{2,3}[-]?\d{4,5}$/,
            /^[A-Z0-9]{3,4}[-]?[A-Z0-9]{3,5}$/,
            /^\d{4,5}[-]?[A-Z]{2,3}$/,
            /^[A-Z]{1,3}[-]?\d{3,5}[-]?[A-Z]{0,2}$/,
        ];

        const isValidFormat = patterns.some(pattern => pattern.test(cleaned));
        const hasLetters = /[A-Z]/.test(cleaned);
        const hasNumbers = /\d/.test(cleaned);
        const lengthOk = cleaned.length >= 5 && cleaned.length <= 10;
        
        return isValidFormat && hasLetters && hasNumbers && lengthOk ? cleaned : null;
    };

    // Initialize camera
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

                // Start scanning
                startScanning();
            } catch (err) {
                console.error("Camera error:", err);
                alert("Camera access denied");
            }
        };

        initializeCamera();

        return () => {
            if (scanningIntervalRef.current) {
                clearInterval(scanningIntervalRef.current);
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Animate green scanning line
    useEffect(() => {
        const lineInterval = setInterval(() => {
            setScanLinePosition(prev => (prev + 2) % 100);
        }, 30);

        return () => clearInterval(lineInterval);
    }, []);

    const startScanning = () => {
        if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);

        scanningIntervalRef.current = setInterval(() => {
            captureFrame();
        }, 600);
    };

    const captureFrame = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const video = videoRef.current;

            if (video.videoWidth === 0 || video.videoHeight === 0) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);

            const base64Image = canvas.toDataURL("image/jpeg", 0.8);

            // Send to API
            const response = await fetch("/api/scan-plate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image }),
            });

            if (!response.ok) return;

            const data = await response.json();

            if (data.text) {
                const validPlate = validatePlateFormat(data.text);

                if (validPlate) {
                    validDetectionsRef.current++;

                    // Auto-capture on repeated detections
                    if (validDetectionsRef.current >= 2) {
                        triggerCapture(validPlate);
                    }
                } else {
                    validDetectionsRef.current = 0;
                }
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const triggerCapture = (plateNumber) => {
        if (scanningIntervalRef.current) {
            clearInterval(scanningIntervalRef.current);
        }
        onPlateDetected(plateNumber);
        setTimeout(() => onClose(), 300);
    };

    // ========== ULTRA CLEAN UI ==========

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
            {/* Main Container */}
            <div className="relative w-full h-full max-w-2xl max-h-[600px] bg-black rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 hover:bg-white/10 rounded-full transition-all"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                {/* Video Stream */}
                <div className="relative w-full h-full overflow-hidden bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />

                    {/* Scanning Frame Box */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-96 h-56 border-2 border-green-400/40 rounded-xl"></div>
                    </div>

                    {/* Green Scanning Line - Top to Bottom */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                        <div
                            className="absolute left-0 right-0 h-0.5 bg-gradient-to-b from-transparent via-green-400 to-transparent shadow-lg shadow-green-400/50"
                            style={{
                                top: `${scanLinePosition}%`,
                                transition: 'none'
                            }}
                        ></div>
                    </div>

                    {/* Hidden Canvas */}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Simple Status Text */}
                <div className="absolute bottom-6 left-0 right-0 text-center">
                    <p className="text-green-400 text-sm font-semibold animate-pulse">🔍 Scanning...</p>
                </div>
            </div>
        </div>
    );
}
