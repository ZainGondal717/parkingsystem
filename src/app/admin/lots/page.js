"use client";
import { useState, useEffect } from "react";
import {
    Plus, Trash2, Edit, MapPin, Car, Clock,
    DollarSign, Loader2, X, Save, Map as MapIcon, Search, Navigation, CheckCircle2
} from "lucide-react";
import dynamic from "next/dynamic";

// ─── Constants ───────────────────────────────────────────────────────────────
const DEFAULT_POS = [42.3314, -83.0458];

const isValidPos = (pos) =>
    Array.isArray(pos) &&
    pos.length === 2 &&
    typeof pos[0] === "number" &&
    typeof pos[1] === "number" &&
    isFinite(pos[0]) &&
    isFinite(pos[1]);

// ─── Map Component (same approach as landlords page) ──────────────────────────
const MapContent = ({ position, setPosition, onAddressFound, onReverseGeocoding, boundingBox, onMapClick }) => {
    const { MapContainer, TileLayer, Marker, useMap, useMapEvents } = require("react-leaflet");

    const MapController = () => {
        const map = useMap();

        useEffect(() => {
            if (!position || !map) return;
            if (boundingBox) {
                try {
                    const [s, n, w, e] = boundingBox.map(Number);
                    map.flyToBounds([[s, w], [n, e]], { animate: true, duration: 1.2 });
                } catch (err) {
                    map.flyTo(position, 13);
                }
            } else {
                map.flyTo(position, 13);
            }
        }, [position, boundingBox, map]);

        useMapEvents({
            async click(e) {
                const newPos = [e.latlng.lat, e.latlng.lng];
                if (onMapClick) onMapClick();
                setPosition(newPos);
                if (onReverseGeocoding) onReverseGeocoding(true);
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
                    );
                    const data = await res.json();
                    if (data?.display_name) onAddressFound(data.display_name);
                } catch { }
                finally {
                    if (onReverseGeocoding) onReverseGeocoding(false);
                }
            },
        });

        return position ? <Marker position={position} /> : null;
    };

    return (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapController />
        </MapContainer>
    );
};

const SimpleMap = dynamic(() => Promise.resolve(MapContent), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-50"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
});

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminLots() {
    const [lots, setLots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLot, setEditingLot] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
    const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);
    const [mapPosition, setMapPosition] = useState(DEFAULT_POS);
    const [mapBoundingBox, setMapBoundingBox] = useState(null);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [formData, setFormData] = useState({
        name: "", slots: "", address: "",
        latitude: DEFAULT_POS[0], longitude: DEFAULT_POS[1],
        halfHourRate: "", hourlyRate: "", dailyRate: "", weeklyRate: "", monthlyRate: ""
    });

    // ── Effects ──────────────────────────────────────────────────────────────
    useEffect(() => {
        let timeout;
        if (searchQuery.length > 2 && showSuggestions) {
            timeout = setTimeout(async () => {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(searchQuery)}`);
                    const data = await res.json();
                    setAddressSuggestions(data || []);
                } catch (e) {
                    console.error("Autocomplete error", e);
                }
            }, 600);
        } else {
            setAddressSuggestions([]);
        }
        return () => clearTimeout(timeout);
    }, [searchQuery, showSuggestions]);

    useEffect(() => {
        fetchLots();

        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-css"; link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }

        import("leaflet").then(L => {
            if (L.Icon?.Default) {
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                });
            }
        });
    }, []);

    // ── API Handlers ─────────────────────────────────────────────────────────
    const fetchLots = async () => {
        try {
            const res = await fetch("/api/admin/lots");
            const data = await res.json();
            setLots(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const handleSearch = async (manualQuery) => {
        const query = (manualQuery || searchQuery || formData.address).trim();
        if (!query) return;
        setIsSearching(true);
        setShowSuggestions(false);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data?.length > 0) {
                const lat = parseFloat(data[0].lat), lon = parseFloat(data[0].lon);
                if (isFinite(lat) && isFinite(lon)) {
                    setMapPosition([lat, lon]);
                    setFormData(p => ({ ...p, address: data[0].display_name }));
                    setSearchQuery(data[0].display_name);
                    if (data[0].boundingbox) {
                        setMapBoundingBox(data[0].boundingbox);
                    } else {
                        setMapBoundingBox(null);
                    }
                }
            }
        } catch (e) { console.error(e); }
        finally { setIsSearching(false); }
    };

    const handleSelectSuggestion = (suggestion) => {
        const lat = parseFloat(suggestion.lat), lon = parseFloat(suggestion.lon);
        if (isFinite(lat) && isFinite(lon)) {
            setMapPosition([lat, lon]);
            setFormData(p => ({ ...p, address: suggestion.display_name }));
            setSearchQuery(suggestion.display_name);
            setShowSuggestions(false);
            if (suggestion.boundingbox) {
                setMapBoundingBox(suggestion.boundingbox);
            } else {
                setMapBoundingBox(null);
            }
        }
    };

    const handleAddressFromMap = (address) => {
        setFormData(p => ({ ...p, address }));
        setSearchQuery(address);
        setShowSuggestions(false);
    };

    const handleOpenModal = (lot = null) => {
        if (lot) {
            setEditingLot(lot);
            setFormData({
                name: lot.name, slots: lot.capacity || lot.slots, address: lot.address,
                latitude: lot.latitude || DEFAULT_POS[0], longitude: lot.longitude || DEFAULT_POS[1],
                halfHourRate: lot.halfHourRate, hourlyRate: lot.hourlyRate,
                dailyRate: lot.dailyRate, weeklyRate: lot.weeklyRate, monthlyRate: lot.monthlyRate
            });
            const lat = parseFloat(lot.latitude), lng = parseFloat(lot.longitude);
            setMapPosition([isFinite(lat) ? lat : DEFAULT_POS[0], isFinite(lng) ? lng : DEFAULT_POS[1]]);
            setMapBoundingBox(null);
            setSearchQuery(lot.address || "");
            setShowSuggestions(false);
        } else {
            setEditingLot(null);
            setFormData({ name: "", slots: "", address: "", latitude: DEFAULT_POS[0], longitude: DEFAULT_POS[1], halfHourRate: "", hourlyRate: "", dailyRate: "", weeklyRate: "", monthlyRate: "" });
            setMapPosition(DEFAULT_POS);
            setMapBoundingBox(null);
            setSearchQuery("");
            setShowSuggestions(false);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/lots", {
                method: editingLot ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, capacity: parseInt(formData.slots), id: editingLot?.id, latitude: mapPosition[0], longitude: mapPosition[1] }),
            });
            if (res.ok) { setIsModalOpen(false); fetchLots(); }
        } catch (e) { console.error(e); }
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this parking lot?")) return;
        try {
            const res = await fetch("/api/admin/lots", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
            if (res.ok) fetchLots();
        } catch (e) { console.error(e); }
    };

    const RATES = [
        { key: "halfHourRate", label: "30 Min" },
        { key: "hourlyRate", label: "1 Hour" },
        { key: "dailyRate", label: "Daily" },
        { key: "weeklyRate", label: "Weekly" },
        { key: "monthlyRate", label: "Monthly" },
    ];

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 dark:bg-transparent">
            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-900 tracking-tight">Parking Lots</h1>
                    <p className="text-gray-500 dark:text-gray-500 mt-1 text-sm">Manage your active parking facilities and pricing.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Create New Lot
                </button>
            </div>

            {/* ── Lots Grid ── */}
            {isLoading ? (
                <div className="flex items-center justify-center p-24">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : lots.length === 0 ? (
                <div className="text-center py-24 text-gray-400">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-bold text-lg">No lots yet</p>
                    <p className="text-sm mt-1">Create your first parking lot to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lots.map((lot) => (
                        <div key={lot.id} className="bg-white border border-gray-100 rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Car className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleOpenModal(lot)} className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(lot.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{lot.name}</h3>
                                    <p className="text-gray-400 text-xs mt-1 flex items-center gap-1 line-clamp-1"><MapPin className="w-3 h-3 flex-shrink-0" />{lot.address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Spots</p>
                                        <p className="text-xl font-black text-gray-900">{lot.capacity}</p>
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-2xl text-center">
                                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Per Hour</p>
                                        <p className="text-xl font-black text-emerald-700">${lot.hourlyRate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                MODAL — Create / Edit Lot
            ════════════════════════════════════════════════════════════════ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
                    <div className="bg-white dark:bg-white w-full sm:max-w-6xl rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col md:flex-row overflow-hidden" style={{ maxHeight: "95dvh" }}>

                        {/* ── LEFT: Form Panel ────────────────────────────── */}
                        <div className="w-full md:w-[45%] flex flex-col overflow-y-auto" style={{ maxHeight: "95dvh" }}>
                            {/* Form Header */}
                            <div className="p-6 pb-0 flex items-center justify-between flex-shrink-0">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-gray-900">
                                        {editingLot ? "Edit Facility" : "New Facility"}
                                    </h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Set details, location & pricing</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-xl transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
                                {/* Facility Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Facility Name</label>
                                    <div className="relative">
                                        <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Downtown Central Parking"
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500/30 focus:bg-white dark:focus:bg-white transition-all font-semibold text-sm text-gray-800 dark:text-gray-800"
                                        />
                                    </div>
                                </div>

                                {/* Total Slots */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Parking Slots</label>
                                    <input
                                        type="number" required min="1"
                                        value={formData.slots}
                                        onChange={e => setFormData({ ...formData, slots: e.target.value })}
                                        placeholder="e.g. 120"
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500/30 focus:bg-white dark:focus:bg-white transition-all font-bold text-lg text-blue-600 dark:text-blue-600"
                                    />
                                </div>

                                {/* Address + Mobile Map Button */}
                                <div className="space-y-1.5 relative">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location Address</label>
                                    <div className="flex gap-2 relative">
                                        <div className="relative flex-1">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                required
                                                value={formData.address}
                                                onChange={e => {
                                                    setFormData({ ...formData, address: e.target.value });
                                                    setSearchQuery(e.target.value);
                                                    setShowSuggestions(true);
                                                }}
                                                onKeyDown={e => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        setShowSuggestions(false);
                                                        handleSearch();
                                                    }
                                                }}
                                                placeholder="Search or pin on map…"
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500/30 focus:bg-white dark:focus:bg-white transition-all font-semibold text-sm text-gray-800 dark:text-gray-800"
                                            />
                                            {isReverseGeocoding && (
                                                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
                                            )}
                                        </div>
                                        {/* Mobile: open full-screen map */}
                                        <button
                                            type="button"
                                            onClick={() => setIsMobileMapOpen(true)}
                                            className="md:hidden flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex-shrink-0"
                                        >
                                            <MapIcon className="w-6 h-6" />
                                        </button>

                                        {/* Suggestions Dropdown */}
                                        {showSuggestions && addressSuggestions.length > 0 && (
                                            <div className="absolute z-[100] left-0 right-16 top-[calc(100%+8px)] bg-white dark:bg-white border border-gray-100 dark:border-gray-200 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                                                {addressSuggestions.map((s, idx) => (
                                                    <button
                                                        key={idx} type="button"
                                                        onClick={() => handleSelectSuggestion(s)}
                                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-50 focus:bg-blue-50 dark:focus:bg-blue-50 transition-all border-b border-gray-50 last:border-0 flex items-start gap-3"
                                                    >
                                                        <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700 dark:text-gray-700 font-medium line-clamp-2">{s.display_name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {/* Show selected coords */}
                                    {isValidPos(mapPosition) && (
                                        <p className="text-[10px] text-gray-400 font-mono ml-1">
                                            📍 {mapPosition[0].toFixed(5)}, {mapPosition[1].toFixed(5)}
                                        </p>
                                    )}
                                </div>

                                {/* Pricing Grid */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-50 dark:to-indigo-50 rounded-[24px] p-5 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-blue-500" />
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Pricing Rates</p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {RATES.map(r => (
                                            <div key={r.key} className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-wide ml-1">{r.label}</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                                                    <input
                                                        type="number" step="0.01" min="0"
                                                        value={formData[r.key]}
                                                        onChange={e => setFormData({ ...formData, [r.key]: e.target.value })}
                                                        className="w-full pl-7 pr-3 py-3 bg-white dark:bg-white rounded-xl outline-none border-2 border-transparent focus:border-blue-400 shadow-sm transition-all text-sm font-bold text-gray-900 dark:text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit" disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] text-sm uppercase tracking-wider"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <><Save className="w-5 h-5" /><span>{editingLot ? "Save Changes" : "Create Facility"}</span></>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* ── RIGHT: Map Panel (Desktop only) ─────────────── */}
                        <div className="hidden md:flex flex-col flex-1 relative bg-slate-100">
                            {/* Search Overlay */}
                            <div className="absolute top-4 left-4 right-4 z-[1001]">
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 p-2">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            value={searchQuery}
                                            onChange={e => {
                                                setSearchQuery(e.target.value);
                                                setShowSuggestions(true);
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    setShowSuggestions(false);
                                                    handleSearch();
                                                }
                                            }}
                                            placeholder="Search an address to locate on map…"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-blue-400 transition-all text-sm font-semibold text-gray-900 dark:text-gray-900"
                                        />

                                        {showSuggestions && addressSuggestions.length > 0 && (
                                            <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-[1002] bg-white dark:bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                                                {addressSuggestions.map((s, idx) => (
                                                    <button
                                                        key={idx} type="button"
                                                        onClick={() => handleSelectSuggestion(s)}
                                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-50 focus:bg-blue-50 dark:focus:bg-blue-50 transition-all border-b border-gray-50 last:border-0 flex items-start gap-3"
                                                    >
                                                        <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700 dark:text-gray-700 font-medium line-clamp-2">{s.display_name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleSearch} disabled={isSearching}
                                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-2 transition-all active:scale-95 flex-shrink-0"
                                    >
                                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                                        {isSearching ? "Locating…" : "Find"}
                                    </button>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="absolute inset-0">
                                <SimpleMap
                                    position={isValidPos(mapPosition) ? mapPosition : DEFAULT_POS}
                                    setPosition={setMapPosition}
                                    onAddressFound={handleAddressFromMap}
                                    onReverseGeocoding={setIsReverseGeocoding}
                                    boundingBox={mapBoundingBox}
                                    onMapClick={() => setMapBoundingBox(null)}
                                />
                            </div>

                            {/* Status Bar at Bottom */}
                            <div className="absolute bottom-4 left-4 right-4 z-[1001]">
                                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 px-4 py-3 flex items-center gap-3">
                                    {isReverseGeocoding ? (
                                        <>
                                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
                                            <span className="text-xs font-bold text-gray-500">Detecting address…</span>
                                        </>
                                    ) : formData.address ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            <span className="text-xs font-semibold text-gray-700 line-clamp-1">{formData.address}</span>
                                        </>
                                    ) : (
                                        <>
                                            <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                            <span className="text-xs font-bold text-gray-400">Search above or click the map to drop a pin</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                MOBILE MAP — Full Screen Overlay
            ════════════════════════════════════════════════════════════════ */}
            {isMobileMapOpen && (
                <div
                    className="md:hidden"
                    style={{ position: "fixed", inset: 0, zIndex: 300, background: "#0f172a", display: "flex", flexDirection: "column", height: "100dvh" }}
                >
                    {/* Full-screen Map — must have explicit pixel dimensions for Leaflet */}
                    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                        <SimpleMap
                            position={isValidPos(mapPosition) ? mapPosition : DEFAULT_POS}
                            setPosition={setMapPosition}
                            onAddressFound={handleAddressFromMap}
                            onReverseGeocoding={setIsReverseGeocoding}
                            boundingBox={mapBoundingBox}
                            onMapClick={() => setMapBoundingBox(null)}
                        />
                    </div>

                    {/* ── Top Controls: Search Bar ── */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "12px", zIndex: 1002, pointerEvents: "none" }}>
                        <div style={{ pointerEvents: "auto" }}>
                            {/* Search row */}
                            <div className="bg-white dark:bg-white rounded-[20px] shadow-2xl p-2 flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        value={searchQuery}
                                        onChange={e => {
                                            setSearchQuery(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                setShowSuggestions(false);
                                                handleSearch();
                                            }
                                        }}
                                        placeholder="Search address on map…"
                                        className="w-full pl-10 pr-3 py-3.5 bg-gray-50 dark:bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-400 text-sm font-semibold text-gray-900 dark:text-gray-900"
                                    />

                                    {showSuggestions && addressSuggestions.length > 0 && (
                                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-[1003] bg-white dark:bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                                            {addressSuggestions.map((s, idx) => (
                                                <button
                                                    key={idx} type="button"
                                                    onClick={() => handleSelectSuggestion(s)}
                                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-50 transition-all border-b border-gray-50 last:border-0 flex items-start gap-3"
                                                >
                                                    <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-700 font-medium line-clamp-2">{s.display_name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleSearch} disabled={isSearching}
                                    className="px-4 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-2xl text-xs font-black uppercase flex items-center gap-1.5 flex-shrink-0 active:scale-95 transition-all"
                                >
                                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                                    <span>{isSearching ? "…" : "Go"}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom Card: Address + Controls ── */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1002, padding: "16px" }}>
                        <div className="bg-white dark:bg-white rounded-[28px] shadow-2xl overflow-hidden">
                            {/* Address display */}
                            <div className="p-5 flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    {isReverseGeocoding
                                        ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                        : <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-600" />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-blue-500 dark:text-blue-500 uppercase tracking-widest mb-1">
                                        {isReverseGeocoding ? "Detecting location…" : "Pinned Location"}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-800 line-clamp-2 leading-snug">
                                        {formData.address || "Tap anywhere on the map to drop a pin"}
                                    </p>
                                    {isValidPos(mapPosition) && !isReverseGeocoding && (
                                        <p className="text-[10px] text-gray-400 dark:text-gray-400 font-mono mt-1">
                                            {mapPosition[0].toFixed(5)}, {mapPosition[1].toFixed(5)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="px-5 pb-5 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setIsMobileMapOpen(false)}
                                    className="py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-100 dark:hover:bg-gray-200 text-gray-600 dark:text-gray-600 font-bold rounded-2xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                                <button
                                    onClick={() => setIsMobileMapOpen(false)}
                                    className="py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
