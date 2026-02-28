"use client";
import { useState, useEffect, useRef } from "react";
import Flag from "react-world-flags";
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
    Camera
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

    const lotDropdownRef = useRef(null);
    const countryDropdownRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (lotDropdownRef.current && !lotDropdownRef.current.contains(event.target)) {
                setIsLotDropdownOpen(false);
            }
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
                setIsCountryDropdownOpen(false);
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

    const handleCapture = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsScanning(true);
        try {
            // Compress the image before sending to prevent timeouts and payload size issues on mobile
            const compressedBase64 = await compressImage(file);

            const response = await fetch("/api/scan-plate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: compressedBase64 }),
            });

            if (!response.ok) {
                // Handle non-200 responses (like "Payload Too Large" or "Server Error")
                let errorMessage = "Failed to scan image. Please try again.";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // Response might not be JSON (e.g. standard server error page)
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            if (data.text) {
                // Plate Recognizer already gives us a clean plate string.
                // We'll trust its result but do a quick sanity cleanup.
                const plateValue = data.text.toUpperCase().replace(/[^A-Z0-9]/g, '');

                if (plateValue) {
                    setFormData(prev => ({ ...prev, carNumber: plateValue.substring(0, 10) }));
                } else {
                    throw new Error("Could not detect license plate clearly. Please try again.");
                }
            } else {
                throw new Error("Could not detect any text. Try to get closer to the plate.");
            }
        } catch (error) {
            console.error("Scan Error:", error);
            alert(error.message || "Error scanning image.");
        } finally {
            // ALWAYS reset scanning state to stop the loading spinner
            setIsScanning(false);
            // Clear the file input so the same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLot) { alert("Please select a parking lot."); return; }
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/admin/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lotId: selectedLot.id,
                    carNumber: formData.carNumber,
                    countryCode: selectedCountry.code, // now we use correct code
                    phoneNumber: formData.phoneNumber,
                    durationMode: formData.durationMode,
                    durationValue: formData.durationValue,
                    totalPrice: totalPrice,
                }),
            });
            if (response.ok) {
                alert("Booking successful!");
                setFormData({ carNumber: "", phoneNumber: "", durationMode: "hourly", durationValue: 1 });
                setSelectedLot(null);
            } else { alert("Failed to save booking."); }
        } catch (err) { alert("Error connecting to server."); }
        finally { setIsSubmitting(false); }
    };

    return (
        <section className="flex flex-col items-center justify-center py-10 px-4 bg-gray-100 min-h-[500px]">
            <div className="w-full max-w-[400px]">
                <div className="text-center mb-6">
                    <h1 className="text-[#1877f2] font-black text-4xl mb-1 tracking-tight">Book Parking</h1>
                    <p className="text-gray-500 font-medium text-sm">Fast, secure and reliable reservation.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Parking Lot Dropdown */}
                        <div className="relative" ref={lotDropdownRef}>
                            <div
                                onClick={() => setIsLotDropdownOpen(!isLotDropdownOpen)}
                                className="w-full h-14 px-4 border border-gray-300 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all focus:border-[#1877f2]"
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
                                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1877f2]"
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
                                placeholder="Car Plate Number"
                                value={formData.carNumber}
                                onChange={(e) => setFormData({ ...formData, carNumber: e.target.value.toUpperCase() })}
                                className="w-full h-14 pl-12 pr-12 border border-gray-300 rounded-lg outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] text-sm font-bold tracking-widest uppercase placeholder:normal-case placeholder:font-normal"
                            />

                            {/* Hidden file input for camera scan */}
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleCapture}
                            />

                            {/* Scan Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isScanning}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-200"
                                title="Scan License Plate"
                            >
                                {isScanning ? (
                                    <Loader2 className="w-4 h-4 text-[#1877f2] animate-spin" />
                                ) : (
                                    <Camera className="w-4 h-4 text-gray-600 hover:text-[#1877f2]" />
                                )}
                            </button>
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
                                    className="w-full h-14 pl-12 pr-4 border border-gray-300 rounded-lg outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] text-sm font-bold"
                                />
                            </div>
                        </div>

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
                                    <span>CONFIRM BOOKING</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
