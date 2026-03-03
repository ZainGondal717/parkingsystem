"use client";
import { useState, useEffect, useRef } from "react";
import Flag from "react-world-flags";
import StripePaymentForm from "./StripePaymentForm";
import CameraScanner from "./CameraScanner";
import { X } from "lucide-react";
import {
    Search,
    Car,
    Phone,
    Clock,
    ChevronDown,
    Check,
    Loader2,
    Calendar,
    ArrowRight,
    MapPin,
    Globe,
    Camera,
    LayoutGrid
} from "lucide-react";

// Massive country code list with full names and standard ISO codes for react-world-flags
const countryCodes = [
    { code: "+1", iso: "US", name: "USA" },
    { code: "+1", iso: "CA", name: "Canada" },
    { code: "+44", iso: "GB", name: "UK" },
    { code: "+92", iso: "PK", name: "Pakistan" },
    { code: "+971", iso: "AE", name: "UAE" },
    { code: "+966", iso: "SA", name: "Saudi Arabia" },
    { code: "+91", iso: "IN", name: "India" },
    { code: "+61", iso: "AU", name: "Australia" },
    { code: "+49", iso: "DE", name: "Germany" },
    { code: "+33", iso: "FR", name: "France" },
    { code: "+39", iso: "IT", name: "Italy" },
    { code: "+34", iso: "ES", name: "Spain" },
    { code: "+31", iso: "NL", name: "Netherlands" },
    { code: "+41", iso: "CH", name: "Switzerland" },
    { code: "+46", iso: "SE", name: "Sweden" },
    { code: "+47", iso: "NO", name: "Norway" },
    { code: "+48", iso: "PL", name: "Poland" },
    { code: "+32", iso: "BE", name: "Belgium" },
    { code: "+358", iso: "FI", name: "Finland" },
    { code: "+45", iso: "DK", name: "Denmark" },
    { code: "+30", iso: "GR", name: "Greece" },
    { code: "+351", iso: "PT", name: "Portugal" },
    { code: "+353", iso: "IE", name: "Ireland" },
    { code: "+43", iso: "AT", name: "Austria" },
    { code: "+380", iso: "UA", name: "Ukraine" },
    { code: "+972", iso: "IL", name: "Israel" },
    { code: "+90", iso: "TR", name: "Turkey" },
    { code: "+20", iso: "EG", name: "Egypt" },
    { code: "+27", iso: "ZA", name: "South Africa" },
    { code: "+55", iso: "BR", name: "Brazil" },
    { code: "+52", iso: "MX", name: "Mexico" },
    { code: "+81", iso: "JP", name: "Japan" },
    { code: "+86", iso: "CN", name: "China" },
    { code: "+82", iso: "KR", name: "South Korea" },
    { code: "+65", iso: "SG", name: "Singapore" },
    { code: "+60", iso: "MY", name: "Malaysia" },
    { code: "+66", iso: "TH", name: "Thailand" },
    { code: "+84", iso: "VN", name: "Vietnam" },
    { code: "+62", iso: "ID", name: "Indonesia" },
    { code: "+63", iso: "PH", name: "Philippines" },
    { code: "+880", iso: "BD", name: "Bangladesh" },
    { code: "+94", iso: "LK", name: "Sri Lanka" },
    { code: "+977", iso: "NP", name: "Nepal" },
    { code: "+95", iso: "MM", name: "Myanmar" },
    { code: "+855", iso: "KH", name: "Cambodia" },
];

// Custom utility for client-side image compression (important for mobile)
const compressImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;
                const maxDim = 1280; // Good resolution for OCR but small enough to upload quickly

                if (width > height) {
                    if (width > maxDim) {
                        height *= maxDim / width;
                        width = maxDim;
                    }
                } else {
                    if (height > maxDim) {
                        width *= maxDim / height;
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                // Compress as JPEG to significantly reduce file size
                resolve(canvas.toDataURL("image/jpeg", 0.7));
            };
            img.onerror = () => reject(new Error("Failed to load image"));
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
    });
};

export default function BookingForm({ lots = [] }) {
    const [selectedLot, setSelectedLot] = useState(null);
    const [isLotDropdownOpen, setIsLotDropdownOpen] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [lotSearchQuery, setLotSearchQuery] = useState("");

    // Default country
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

    const [formData, setFormData] = useState({
        carNumber: "",
        phoneNumber: "",
        durationMode: "hourly",
        durationValue: 1,
    });

    const [totalPrice, setTotalPrice] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Payment State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [pendingBookingData, setPendingBookingData] = useState(null);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    const lotDropdownRef = useRef(null);
    const countryDropdownRef = useRef(null);
    const slotDropdownRef = useRef(null);
    const fileInputRef = useRef(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isSlotDropdownOpen, setIsSlotDropdownOpen] = useState(false);
    const [slotSearchQuery, setSlotSearchQuery] = useState("");
    const [extensionData, setExtensionData] = useState(null);
    const [timeLeftInSession, setTimeLeftInSession] = useState(null);
    const [showCameraScanner, setShowCameraScanner] = useState(false);

    // CRITICAL: Ensure 'lots' is treated as an array and search is accurate
    const filteredLots = Array.isArray(lots) ? lots.filter(lot =>
        lot.name?.toLowerCase().includes(lotSearchQuery.toLowerCase()) ||
        lot.address?.toLowerCase().includes(lotSearchQuery.toLowerCase())
    ) : [];

    useEffect(() => {
        if (!selectedLot) { setTotalPrice(0); return; }
        let price = 0;
        const val = parseFloat(formData.durationValue) || 0;
        switch (formData.durationMode) {
            case "half": price = selectedLot.halfHourRate; break;
            case "hourly": price = selectedLot.hourlyRate * val; break;
            case "daily": price = selectedLot.dailyRate * val; break;
            case "weekly": price = selectedLot.weeklyRate * val; break;
            case "monthly": price = selectedLot.monthlyRate * val; break;
        }
        setTotalPrice(price.toFixed(2));
    }, [selectedLot, formData.durationMode, formData.durationValue]);

    // Handle Extension logic
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const bookingId = params.get('extend');

        if (bookingId) {
            const fetchExtensionBooking = async () => {
                try {
                    const res = await fetch(`/api/bookings/${bookingId}`);
                    if (!res.ok) return;
                    const booking = await res.json();

                    if (booking) {
                        setExtensionData(booking);
                        setSelectedLot(booking.lot);
                        setFormData(prev => ({
                            ...prev,
                            carNumber: booking.carNumber,
                            phoneNumber: booking.phoneNumber
                        }));
                        const country = countryCodes.find(c => c.code === booking.countryCode);
                        if (country) setSelectedCountry(country);
                        setSelectedSlot(booking.slotNumber);
                    }
                } catch (err) { console.error("Extension fetch error:", err); }
            };
            fetchExtensionBooking();
        }
    }, [lots]);

    // Timer for time left in session
    useEffect(() => {
        if (!extensionData) return;

        const timer = setInterval(() => {
            const start = new Date(extensionData.createdAt);
            let endMs = start.getTime();
            const value = extensionData.durationValue || 0;
            switch (extensionData.durationMode) {
                case 'half': endMs += (30 * 60 * 1000); break;
                case 'hourly': endMs += (value * 60 * 60 * 1000); break;
                case 'daily': endMs += (value * 24 * 60 * 60 * 1000); break;
                case 'weekly': endMs += (value * 7 * 24 * 60 * 60 * 1000); break;
                case 'monthly':
                    const endObj = new Date(start);
                    endObj.setMonth(start.getMonth() + Math.floor(value));
                    endMs = endObj.getTime();
                    break;
            }

            const diff = endMs - Date.now();
            if (diff <= 0) {
                setTimeLeftInSession("Expired");
                clearInterval(timer);
            } else {
                const h = Math.floor(diff / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeftInSession(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [extensionData]);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedLot) {
                setAvailableSlots([]);
                setSelectedSlot(null);
                return;
            }

            setIsLoadingSlots(true);
            try {
                const res = await fetch(`/api/slots?lotId=${selectedLot.id}`);
                const data = await res.json();
                if (data.slots) {
                    setAvailableSlots(data.slots);
                } else {
                    setAvailableSlots([]);
                }
            } catch (err) {
                console.error("Failed to fetch slots:", err);
                setAvailableSlots([]);
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchAvailableSlots();
        // Re-fetch every 1 minute to keep it updated
        const interval = setInterval(fetchAvailableSlots, 60000);
        return () => clearInterval(interval);
    }, [selectedLot]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (lotDropdownRef.current && !lotDropdownRef.current.contains(event.target)) {
                setIsLotDropdownOpen(false);
            }
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
                setIsCountryDropdownOpen(false);
            }
            if (slotDropdownRef.current && !slotDropdownRef.current.contains(event.target)) {
                setIsSlotDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDurationModeChange = (mode) => {
        let value = 1;
        if (mode === "half") value = 0.5;
        setFormData({ ...formData, durationMode: mode, durationValue: value });
    };

    const handlePlateDetected = (plateNumber) => {
        // Directly set the detected plate number
        const plateValue = plateNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (plateValue) {
            setFormData(prev => ({ ...prev, carNumber: plateValue.substring(0, 10) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLot) { alert("Please select a parking lot."); return; }
        if (!selectedSlot) { alert("Please select a parking slot."); return; }
        
        const numTotalPrice = parseFloat(totalPrice) || 0;
        if (numTotalPrice <= 0) { alert("Invalid price calculated."); return; }
        
        // Store booking data (DON'T create booking yet - wait for payment)
        setPendingBookingData({
            carNumber: formData.carNumber,
            phoneNumber: formData.phoneNumber,
            durationMode: formData.durationMode,
            durationValue: formData.durationValue,
            countryCode: selectedCountry.code,
            lotName: selectedLot.name,
            lotId: selectedLot.id,
            slotNumber: selectedSlot,
            duration: `${formData.durationValue} ${formData.durationMode}${formData.durationValue > 1 ? 's' : ''}`,
            totalPrice: numTotalPrice,
            bookingId: extensionData?.id, // For extension case
        });
        
        // Show payment modal (booking will be created after payment success)
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (paymentIntent) => {
        try {
            // Payment successful - NOW create the booking
            const bookingResponse = await fetch("/api/admin/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    carNumber: pendingBookingData.carNumber,
                    phoneNumber: pendingBookingData.phoneNumber,
                    durationMode: pendingBookingData.durationMode,
                    durationValue: pendingBookingData.durationValue,
                    countryCode: pendingBookingData.countryCode,
                    lotId: pendingBookingData.lotId,
                    slotNumber: pendingBookingData.slotNumber,
                    totalPrice: pendingBookingData.totalPrice,
                    bookingId: pendingBookingData.bookingId, // For extension
                    paymentIntentId: paymentIntent.id,
                    paymentStatus: "completed",
                }),
            });

            if (bookingResponse.ok) {
                const booking = await bookingResponse.json();
                alert(`🎉 Booking Complete!\n\n📍 Location: ${pendingBookingData.lotName}\n🚙 Plate: ${pendingBookingData.carNumber}\n🔢 Slot: ${pendingBookingData.slotNumber}\n💰 Paid: $${pendingBookingData.totalPrice.toFixed(2)}`);
                
                // Clear form
                setFormData({ carNumber: "", phoneNumber: "", durationMode: "hourly", durationValue: 1 });
                setSelectedSlot(null);
                setShowPaymentModal(false);
                setPendingBookingData(null);

                // Refresh slots
                try {
                    setIsLoadingSlots(true);
                    const res = await fetch(`/api/slots?lotId=${pendingBookingData.lotId}`);
                    const data = await res.json();
                    if (data.slots) setAvailableSlots(data.slots);
                } catch (err) {
                    console.error("Refresh failed", err);
                } finally {
                    setIsLoadingSlots(false);
                }
            } else {
                throw new Error("Failed to create booking after payment");
            }
        } catch (err) {
            console.error("Booking creation after payment failed:", err);
            alert(`Booking creation failed: ${err.message}. Please contact support.`);
        }
    };

    const handlePaymentError = (errorMessage) => {
        alert(`Payment failed: ${errorMessage}\n\nYour booking has been created but not paid. You can retry payment.`);
    };

    return (
        <section className="flex flex-col items-center justify-center py-10 px-4 bg-gray-100 min-h-[500px]">
            <div className="w-full max-w-[400px]">
                <div className="text-center mb-6">
                    <h1 className="text-[#1877f2] font-black text-4xl mb-1 tracking-tight">Book Parking</h1>
                    <p className="text-gray-500 font-medium text-sm">Fast, secure and reliable reservation.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200">
                    {extensionData && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in slide-in-from-top duration-500">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <h3 className="text-sm font-black text-blue-900 uppercase tracking-tight">Extending Session</h3>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-bold text-blue-700">Previous Time Left:</p>
                                <span className={`text-sm font-mono font-black ${timeLeftInSession === 'Expired' ? 'text-red-500' : 'text-blue-600'}`}>
                                    {timeLeftInSession || "Calculating..."}
                                </span>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Parking Lot Dropdown */}
                        <div className="relative" ref={lotDropdownRef}>
                            <div
                                onClick={() => !extensionData && setIsLotDropdownOpen(!isLotDropdownOpen)}
                                className={`w-full h-14 px-4 border border-gray-300 rounded-lg flex items-center justify-between transition-all ${extensionData ? 'bg-gray-50 cursor-not-allowed opacity-80' : 'cursor-pointer hover:bg-gray-50 focus:border-[#1877f2]'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span className={selectedLot ? "text-gray-900 font-bold" : "text-gray-400"}>
                                        {selectedLot ? selectedLot.name : "Choose Location"}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isLotDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {isLotDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 overflow-hidden">
                                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                autoFocus
                                                placeholder="Search by lot or address..."
                                                value={lotSearchQuery}
                                                onChange={(e) => setLotSearchQuery(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1877f2] text-gray-900"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredLots.map(lot => (
                                            <div
                                                key={lot.id}
                                                onClick={() => { setSelectedLot(lot); setIsLotDropdownOpen(false); }}
                                                className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex flex-col border-b border-gray-50 last:border-0"
                                            >
                                                <span className="font-bold text-gray-800 text-sm">{lot.name}</span>
                                                <span className="text-[10px] text-gray-400 truncate">{lot.address}</span>
                                            </div>
                                        ))}
                                        {filteredLots.length === 0 && <div className="p-8 text-center text-xs text-gray-400">No parking lots found</div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Car Number */}
                        <div className="relative group">
                            <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1877f2]" />
                            <input
                                required
                                readOnly={!!extensionData}
                                placeholder="Car Plate Number"
                                value={formData.carNumber}
                                onChange={(e) => setFormData({ ...formData, carNumber: e.target.value.toUpperCase() })}
                                className={`w-full h-14 pl-12 pr-12 border border-gray-300 rounded-lg outline-none text-sm font-bold tracking-widest uppercase placeholder:normal-case placeholder:font-normal text-gray-900 ${extensionData ? 'bg-gray-50 cursor-not-allowed text-gray-400' : 'focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2]'}`}
                            />

                            {/* Scan Button - Opens Camera Scanner Modal */}
                            {!extensionData && (
                                <button
                                    type="button"
                                    onClick={() => setShowCameraScanner(true)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-200"
                                    title="Scan License Plate"
                                >
                                    <Camera className="w-4 h-4 text-gray-600 hover:text-[#1877f2]" />
                                </button>
                            )}
                        </div>

                        {/* CUSTOM COUNTRY CODE DROPDOWN + PHONE */}
                        <div className="flex gap-2">
                            <div className="relative w-[82px]" ref={countryDropdownRef}>
                                <div
                                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                    className="w-full h-14 px-1.5 border border-gray-300 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all font-bold text-[11px]"
                                >
                                    <span className="flex items-center gap-0.5">
                                        <div className="w-5 h-3 overflow-hidden rounded-[1px] flex items-center justify-center flex-shrink-0">
                                            <Flag code={selectedCountry.iso} fallback={<span>🌐</span>} className="w-full object-cover" />
                                        </div>
                                        <span className="text-gray-900">{selectedCountry.code}</span>
                                    </span>
                                    <ChevronDown className={`w-2.5 h-2.5 text-gray-400 flex-shrink-0 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {isCountryDropdownOpen && (
                                    <div className="absolute top-full left-0 w-32 mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl z-[60] overflow-hidden">
                                        <div className="max-h-56 overflow-y-auto">
                                            {countryCodes.map((c, i) => (
                                                <div
                                                    key={`${c.iso}-${c.code}-${i}`}
                                                    onClick={() => { setSelectedCountry(c); setIsCountryDropdownOpen(false); }}
                                                    className="px-3 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b border-gray-50 text-xs font-bold"
                                                >
                                                    <div className="w-5 h-3 overflow-hidden rounded-[1px] flex items-center justify-center flex-shrink-0">
                                                        <Flag code={c.iso} fallback={<span>🌐</span>} className="w-full object-cover" />
                                                    </div>
                                                    <span className="text-blue-600">{c.code}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative flex-1 group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1877f2]" />
                                <input
                                    required
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full h-14 pl-12 pr-4 border border-gray-300 rounded-lg outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] text-sm font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Slot Selection - Professional Searchable Dropdown */}
                        {selectedLot && (
                            <div className="relative pt-2" ref={slotDropdownRef}>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1 italic">
                                    {isLoadingSlots ? "Syncing slots..." : `Choose Parking Slot`}
                                </p>

                                <div
                                    onClick={() => !isLoadingSlots && !extensionData && setIsSlotDropdownOpen(!isSlotDropdownOpen)}
                                    className={`w-full h-14 px-4 border rounded-lg flex items-center justify-between transition-all ${isSlotDropdownOpen ? 'border-[#1877f2] ring-2 ring-blue-50' : 'border-gray-300 hover:border-gray-400'
                                        } ${isLoadingSlots || extensionData ? 'bg-gray-50 cursor-not-allowed opacity-80' : 'bg-white cursor-pointer'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedSlot ? 'bg-blue-50' : 'bg-gray-50'}`}>
                                            <LayoutGrid className={`w-4 h-4 ${selectedSlot ? 'text-[#1877f2]' : 'text-gray-400'}`} />
                                        </div>
                                        <span className={selectedSlot ? "text-gray-900 font-black text-sm" : "text-gray-400 text-sm font-bold"}>
                                            {selectedSlot ? `SPACE #${selectedSlot}` : "Select a free slot"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!selectedSlot && !isLoadingSlots && (
                                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                                                {availableSlots.filter(s => s.status === 'available').length} Free
                                            </span>
                                        )}
                                        {isLoadingSlots ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-[#1877f2]" />
                                        ) : (
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isSlotDropdownOpen ? 'rotate-180' : ''}`} />
                                        )}
                                    </div>
                                </div>

                                {isSlotDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[70] overflow-hidden animate-in zoom-in-95 duration-200">
                                        <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    placeholder="Find slot number..."
                                                    value={slotSearchQuery}
                                                    onChange={(e) => setSlotSearchQuery(e.target.value)}
                                                    className="w-full h-10 pl-9 pr-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1877f2] font-bold text-gray-900"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>

                                        <div className="max-h-56 overflow-y-auto grid grid-cols-4 gap-1 p-2 bg-white scrollbar-thin scrollbar-thumb-gray-200">
                                            {availableSlots
                                                .filter(s => s.number.toString().includes(slotSearchQuery))
                                                .map((slot) => {
                                                    const isBusy = slot.status === 'busy' || slot.status === 'occupied';
                                                    return (
                                                        <div
                                                            key={slot.number}
                                                            onClick={() => {
                                                                if (!isBusy) {
                                                                    setSelectedSlot(slot.number);
                                                                    setIsSlotDropdownOpen(false);
                                                                    setSlotSearchQuery("");
                                                                }
                                                            }}
                                                            className={`h-11 flex flex-col items-center justify-center rounded-lg border text-[10px] font-black transition-all ${isBusy
                                                                ? 'bg-red-50 border-red-50 text-red-300 cursor-not-allowed'
                                                                : selectedSlot === slot.number
                                                                    ? 'bg-[#1877f2] text-white border-[#1877f2] shadow-sm'
                                                                    : 'bg-white text-gray-700 border-gray-100 hover:bg-blue-50 hover:border-blue-200 cursor-pointer'
                                                                }`}
                                                        >
                                                            <span>#{slot.number}</span>
                                                            {!isBusy && <span className={`text-[7px] ${selectedSlot === slot.number ? 'text-blue-100' : 'text-emerald-500'} uppercase mt-px`}>Free</span>}
                                                            {isBusy && <span className="text-[7px] text-red-300 uppercase mt-px tracking-tighter">Taken</span>}
                                                        </div>
                                                    );
                                                })}
                                            {availableSlots.length > 0 && availableSlots.filter(s => s.number.toString().includes(slotSearchQuery)).length === 0 && (
                                                <div className="col-span-4 py-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    Slot not found
                                                </div>
                                            )}
                                        </div>
                                        {availableSlots.length === 0 && !isLoadingSlots && (
                                            <div className="p-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                No slots configured.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Plan Tabs */}
                        <div className="pt-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1 italic">Select Plan Type</p>
                            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                                {['half', 'hourly', 'daily', 'weekly', 'monthly'].map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => handleDurationModeChange(mode)}
                                        className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-md transition-all ${formData.durationMode === mode ? 'bg-[#1877f2] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {mode === 'half' ? '1/2' : mode.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration Counter */}
                        <div className="flex items-center justify-between border border-gray-300 rounded-lg h-12 overflow-hidden bg-gray-50/50 hover:border-gray-400 transition-colors">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, durationValue: Math.max(1, formData.durationValue - 1) })}
                                className="w-14 h-full flex items-center justify-center border-r border-gray-300 text-2xl font-light hover:bg-gray-100 transition-colors"
                            >
                                −
                            </button>
                            <div className="text-sm font-black text-gray-800">
                                {formData.durationMode === 'half' ? '30 Mins Access' : `${formData.durationValue} ${formData.durationMode}${formData.durationValue > 1 ? 's' : ''}`}
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, durationValue: formData.durationValue + 1 })}
                                className="w-14 h-full flex items-center justify-center border-l border-gray-300 text-2xl font-light hover:bg-gray-100 transition-colors"
                            >
                                +
                            </button>
                        </div>

                        {/* Price Info */}
                        <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                            <div>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Total Charges</p>
                                <p className="text-3xl font-black text-emerald-700 tracking-tighter">${totalPrice}</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-emerald-100">
                                <Check className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-[#1877f2] hover:bg-[#166fe5] text-white font-black text-lg rounded-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 group"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    <span>PROCEED TO PAYMENT</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && pendingBookingData && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Complete Payment</h2>
                                <p className="text-blue-100 text-sm mt-1">Secure payment via Stripe</p>
                            </div>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <StripePaymentForm
                                amount={pendingBookingData.totalPrice}
                                bookingDetails={pendingBookingData}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                                isProcessing={isPaymentProcessing}
                            />
                        </div>

                        {/* Modal Footer Info */}
                        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                            <p className="text-xs text-gray-500 text-center">
                                This is a secure transaction. Your payment information is encrypted and protected.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Camera Scanner Modal */}
            {showCameraScanner && (
                <CameraScanner 
                    onPlateDetected={(plateNumber) => {
                        handlePlateDetected(plateNumber);
                        setShowCameraScanner(false);
                    }}
                    onClose={() => setShowCameraScanner(false)}
                />
            )}
        </section>
    );
}
