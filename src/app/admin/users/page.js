"use client";
import { useState, useEffect } from "react";
import {
    Search,
    Calendar,
    Filter,
    Car,
    Clock,
    Loader2,
    MapPin,
    ChevronDown,
    X,
    FileText,
    DollarSign,
    Users,
    Phone
} from "lucide-react";

// Flag mapping helper
const getFlag = (code) => {
    const flags = {
        "+1": "🇺🇸",
        "+44": "🇬🇧",
        "+92": "🇵🇰",
        "+971": "🇦🇪",
        "+61": "🇦🇺",
        "+49": "🇩🇪",
        "+33": "🇫🇷",
        "+91": "🇮🇳",
        "+86": "🇨🇳",
        "+81": "🇯🇵",
        "+966": "🇸🇦",
        "+90": "🇹🇷",
    };
    return flags[code] || "🌐";
};

export default function AdminUsers() {
    const [bookings, setBookings] = useState([]);
    const [lots, setLots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [searchCar, setSearchCar] = useState("");
    const [selectedLot, setSelectedLot] = useState("all");
    const [dateRange, setDateRange] = useState({
        start: "",
        end: ""
    });

    useEffect(() => {
        fetchLots();
        fetchBookings();
    }, []);

    const fetchLots = async () => {
        try {
            const res = await fetch("/api/admin/lots");
            const data = await res.json();
            setLots(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedLot && selectedLot !== 'all') params.append('lotId', selectedLot);
            if (searchCar) params.append('carNumber', searchCar);
            if (dateRange.start) params.append('startDate', dateRange.start);
            if (dateRange.end) params.append('endDate', dateRange.end);

            const url = `/api/admin/bookings?${params.toString()}`;
            const res = await fetch(url);
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    const handleApplyFilters = (e) => {
        if (e) e.preventDefault();
        fetchBookings();
    };

    const resetFilters = () => {
        setSearchCar("");
        setSelectedLot("all");
        setDateRange({ start: "", end: "" });
        // Immediate fetch after state reset
        const url = `/api/admin/bookings?lotId=all`;
        fetch(url).then(res => res.json()).then(data => setBookings(Array.isArray(data) ? data : []));
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 max-w-full mx-auto px-4 py-4 bg-gray-50/50 min-h-screen">
            {/* Compact Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">User Reservations</h1>
                    <p className="text-xs text-gray-500 font-medium">Manage vehicle activity in your lots.</p>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Revenue</p>
                            <p className="text-sm font-bold text-gray-900">
                                ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compact Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <form onSubmit={handleApplyFilters} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            value={searchCar}
                            onChange={(e) => setSearchCar(e.target.value)}
                            placeholder="Car Plate..."
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white focus:border-blue-400 outline-none transition-all uppercase"
                        />
                    </div>

                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <select
                            value={selectedLot}
                            onChange={(e) => setSelectedLot(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white focus:border-blue-400 outline-none transition-all appearance-none"
                        >
                            <option value="all">All Lots</option>
                            {lots.map(lot => (
                                <option key={lot.id} value={lot.id}>{lot.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 group-focus:rotate-180 transition-transform" />
                    </div>

                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white outline-none"
                        />
                    </div>

                    <div className="flex gap-2 col-span-2 sm:col-span-1">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2 rounded-lg transition-all"
                        >
                            APPLY
                        </button>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-100 transition-all bg-gray-50 flex items-center justify-center"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Compact Professional Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Lot / Date</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vehicle Plate</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Stay Plan</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                            <span className="text-xs text-gray-400 font-medium tracking-widest">LOADING...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-50">
                                            <FileText className="w-8 h-8 text-gray-300" />
                                            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">No Records Found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-3">
                                            <p className="text-sm font-semibold text-gray-800">{booking.lot?.name || '---'}</p>
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(booking.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="inline-block px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs px-2 py-1 font-mono font-bold text-gray-700 uppercase tracking-wider">
                                                {booking.carNumber}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded uppercase">
                                                    {booking.durationMode}
                                                </div>
                                                <span className="text-xs text-gray-600">
                                                    {booking.durationMode === 'half' ? '30 Mins' : `${booking.durationValue} Units`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-7 text-center py-0.5 bg-gray-50 border rounded text-[10px]">{getFlag(booking.countryCode)}</span>
                                                <span className="text-xs font-medium text-gray-600">
                                                    {booking.countryCode} {booking.phoneNumber}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <span className="text-sm font-bold text-gray-900">${booking.totalPrice.toFixed(2)}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Result count footer */}
                {!isLoading && bookings.length > 0 && (
                    <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Total Entries: {bookings.length}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
