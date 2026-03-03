"use client";
import { useState, useEffect, useRef } from "react";
import { Download, Copy, Loader2, QrCode, MapPin, Check, Eye, ExternalLink, Smartphone, Printer } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function AdminQRCodes() {
    const [lots, setLots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedLotId, setCopiedLotId] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const qrRefs = useRef({});

    useEffect(() => {
        const fetchLots = async () => {
            try {
                const res = await fetch("/api/admin/lots");
                if (!res.ok) throw new Error("Failed to fetch lots");
                const data = await res.json();
                const lotsArray = Array.isArray(data) ? data : (data.lots || []);
                setLots(lotsArray);
            } catch (err) {
                console.error("Error fetching lots:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLots();
    }, []);

    const generateBookingUrl = (lotId) => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        return `${baseUrl}/book-parking?lot=${lotId}`;
    };

    const downloadQRCode = async (lotId, lotName) => {
        setDownloadingId(lotId);
        setTimeout(() => {
            const qrElement = qrRefs.current[lotId];
            if (!qrElement) return;
            const canvas = qrElement.querySelector("canvas");
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = url;
            link.download = `${lotName}-QR-Code.png`;
            link.click();
            setDownloadingId(null);
        }, 100);
    };

    const copyToClipboard = (lotId) => {
        const url = generateBookingUrl(lotId);
        navigator.clipboard.writeText(url).then(() => {
            setCopiedLotId(lotId);
            setTimeout(() => setCopiedLotId(null), 2000);
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-gray-500">Loading parking lots...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QR Code Generator</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Generate and manage QR codes for your parking lots</p>
                    </div>
                </div>
            </div>

            {/* Info Cards - Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Total Lots</p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{lots.length}</p>
                        </div>
                        <MapPin className="w-8 h-8 text-blue-300 dark:text-blue-700" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">Ready to Use</p>
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{lots.length}</p>
                        </div>
                        <QrCode className="w-8 h-8 text-purple-300 dark:text-purple-700" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Printable</p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-300">{lots.length}</p>
                        </div>
                        <Printer className="w-8 h-8 text-green-300 dark:text-green-700" />
                    </div>
                </div>
            </div>

            {lots.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-16 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                            <QrCode className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">No parking lots found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Create a parking lot first to generate QR codes</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lots.map(lot => (
                        <div key={lot.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-sm">{lot.name}</h3>
                                            <p className="text-xs text-blue-100 truncate">{lot.address}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{lot.slots || lot.capacity || 0}</p>
                                        <p className="text-xs text-blue-100">slots</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 space-y-6">
                                {/* QR Code Display */}
                                <div className="bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex items-center justify-center">
                                    <div 
                                        ref={el => { if (el) qrRefs.current[lot.id] = el; }}
                                        className="bg-white p-2 rounded"
                                    >
                                        <QRCodeCanvas
                                            value={generateBookingUrl(lot.id)}
                                            size={160}
                                            level="H"
                                            includeMargin={true}
                                            fgColor="#000000"
                                            bgColor="#ffffff"
                                        />
                                    </div>
                                </div>

                                {/* Booking URL */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Booking Link</label>
                                    <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-700 dark:text-gray-300 break-all font-mono leading-snug">{generateBookingUrl(lot.id)}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => downloadQRCode(lot.id, lot.name)}
                                        disabled={downloadingId === lot.id}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-sm group"
                                    >
                                        <Download className={`w-4 h-4 ${downloadingId === lot.id ? 'animate-bounce' : 'group-hover:scale-110'} transition-transform`} />
                                        {downloadingId === lot.id ? 'Downloading...' : 'Download QR Code'}
                                    </button>

                                    <button
                                        onClick={() => copyToClipboard(lot.id)}
                                        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200 text-sm font-medium border ${
                                            copiedLotId === lot.id
                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700'
                                                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {copiedLotId === lot.id ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Link Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                Copy Link
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Instructions Section */}
            <div className="mt-12 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    How to Use
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Step 1 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">1</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Download QR Codes</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click "Download QR Code" button for each parking lot to save the QR code as a PNG image.</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">2</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Print & Display</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Print the QR codes and place them at each of your parking lot locations where customers can easily see and scan them.</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <span className="text-green-600 dark:text-green-400 font-bold text-lg">3</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Customer Scans</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Customers use their phone camera to scan the QR code at your parking lot location.</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                    <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">4</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Auto-Book</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Booking form opens with this lot pre-selected. Customer only needs to enter car plate, phone, and duration.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-200 dark:border-blue-800 p-8">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">No Confusion</span> - Users know exactly which lot they're booking</p>
                    </div>
                    <div className="flex gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">Quick Booking</span> - Pre-selected lot speeds up the booking process</p>
                    </div>
                    <div className="flex gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">No Mistakes</span> - Users can't select wrong lot by accident</p>
                    </div>
                    <div className="flex gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">Easy Marketing</span> - Share QR codes on flyers and signage</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
