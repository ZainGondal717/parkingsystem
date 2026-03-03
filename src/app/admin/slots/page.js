"use client";
import { useState, useEffect } from "react";
import {
    MapPin,
    ChevronDown,
    Loader2,
    Car,
    Clock,
    CheckCircle2,
    AlertCircle,
    LayoutGrid,
    Search
} from "lucide-react";

export default function AdminSlots() {
    const [lots, setLots] = useState([]);
    const [selectedLot, setSelectedLot] = useState(null);
    const [slotsData, setSlotsData] = useState([]);
    const [isLoadingLots, setIsLoadingLots] = useState(true);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchLots();
        const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchLots = async () => {
        setIsLoadingLots(true);
        try {
            const res = await fetch("/api/admin/lots");
            const data = await res.json();
            setLots(Array.isArray(data) ? data : []);
            if (data.length > 0) {
                setSelectedLot(data[0]);
            }
        } catch (err) {
            console.error("Failed to fetch lots:", err);
        } finally {
            setIsLoadingLots(false);
        }
    };

    const fetchSlotsStatus = async (lotId) => {
        if (!lotId) return;
        setIsLoadingSlots(true);
        try {
            const res = await fetch(`/api/slots?lotId=${lotId}`);
            const data = await res.json();
            if (data.slots) {
                setSlotsData(data.slots);
            }
        } catch (err) {
            console.error("Failed to fetch slots status:", err);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    useEffect(() => {
        if (selectedLot) {
            fetchSlotsStatus(selectedLot.id);
            const interval = setInterval(() => fetchSlotsStatus(selectedLot.id), 10000); // refresh every 10s
            return () => clearInterval(interval);
        }
    }, [selectedLot]);

    const formatTimeLeft = (expiresAt) => {
        if (!expiresAt) return null;
        const diff = expiresAt - currentTime;
        if (diff <= 0) return "Expired";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const filteredSlots = slotsData.filter(slot =>
        slot.number.toString().includes(searchQuery)
    );

    const stats = {
        total: slotsData.length,
        busy: slotsData.filter(s => s.status === 'busy').length,
        free: slotsData.filter(s => s.status === 'available').length
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                        <LayoutGrid className="w-6 h-6 text-blue-600" />
                        Slots Floor Plan
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Real-time occupancy monitoring for your parking areas.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Status</p>
                            <p className="text-xs font-bold text-gray-900">Live Sync Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <select
                        className="w-full h-12 pl-12 pr-10 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 font-bold text-sm appearance-none transition-all cursor-pointer"
                        value={selectedLot?.id || ""}
                        onChange={(e) => {
                            const lot = lots.find(l => l.id === e.target.value);
                            setSelectedLot(lot);
                        }}
                    >
                        {isLoadingLots ? (
                            <option>Loading lots...</option>
                        ) : (
                            lots.map(lot => (
                                <option key={lot.id} value={lot.id}>{lot.name} — {lot.address}</option>
                            ))
                        )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                <div className="lg:w-64 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Slot #"
                        className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 font-bold text-sm transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none italic">Total Slots</p>
                    <p className="text-2xl font-black text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm bg-emerald-50/30">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 leading-none italic">Available</p>
                    <p className="text-2xl font-black text-emerald-600">{stats.free}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm bg-red-50/30">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 leading-none italic">Occupied</p>
                    <p className="text-2xl font-black text-red-600">{stats.busy}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm bg-blue-50/30">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 leading-none italic">Utilization</p>
                    <p className="text-2xl font-black text-blue-600">
                        {stats.total > 0 ? Math.round((stats.busy / stats.total) * 100) : 0}%
                    </p>
                </div>
            </div>

            {/* Floor Plan Grid */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl relative min-h-[400px]">
                {isLoadingSlots && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Refreshing Data...</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {filteredSlots.length > 0 ? (
                        filteredSlots.map((slot) => {
                            const isBusy = slot.status === 'busy';
                            const timeLeft = formatTimeLeft(slot.expiresAt);

                            return (
                                <div
                                    key={slot.number}
                                    className={`group relative h-28 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${isBusy
                                            ? 'bg-red-50/50 border-red-200 shadow-sm'
                                            : 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1'
                                        }`}
                                >
                                    {/* Slot Number Badge */}
                                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${isBusy ? 'bg-red-200 text-red-700' : 'bg-emerald-200 text-emerald-700'
                                        }`}>
                                        Slot {slot.number}
                                    </div>

                                    {/* Icon */}
                                    {isBusy ? (
                                        <Car className="w-8 h-8 text-red-500 mb-2 drop-shadow-sm" />
                                    ) : (
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2 drop-shadow-sm" />
                                    )}

                                    {/* Status Info */}
                                    <div className="text-center">
                                        <p className={`text-[10px] font-black uppercase tracking-widest leading-none ${isBusy ? 'text-red-600' : 'text-emerald-600'
                                            }`}>
                                            {isBusy ? 'Occupied' : 'Vacant'}
                                        </p>

                                        {isBusy && (
                                            <div className="mt-1.5 flex items-center gap-1 justify-center bg-white px-2 py-0.5 rounded-full shadow-sm border border-red-100">
                                                <Clock className="w-2.5 h-2.5 text-red-400" />
                                                <span className="text-[10px] font-mono font-bold text-red-700">
                                                    {timeLeft === "Expired" ? "Releasing..." : timeLeft}
                                                </span>
                                            </div>
                                        )}

                                        {!isBusy && (
                                            <p className="text-[9px] font-bold text-emerald-400 mt-1">Ready for car</p>
                                        )}
                                    </div>

                                    {/* Hover Details (for busy slots) */}
                                    {isBusy && (
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/90 rounded-2xl flex flex-col items-center justify-center p-3 text-white z-20">
                                            <AlertCircle className="w-6 h-6 mb-1" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Time Remaining</p>
                                            <p className="text-lg font-mono font-black">{timeLeft}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center gap-4 opacity-40">
                            <LayoutGrid className="w-16 h-16 text-gray-300" />
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                {searchQuery ? "No matching slots found" : "No slots available in this lot"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-50 border-2 border-emerald-200" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-50 border-2 border-red-200" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Occupied</span>
                </div>
            </div>
        </div>
    );
}
