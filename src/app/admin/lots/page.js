"use client";
import { useState, useEffect, useCallback, memo } from "react";
import {
    Plus,
    Trash2,
    Edit,
    MapPin,
    Car,
    Clock,
    DollarSign,
    Loader2,
    X,
    Save,
    Map as MapIcon,
    Search
} from "lucide-react";
import dynamic from "next/dynamic";

// --- START MAP COMPONENT ---
// We wrap the entire Leaflet logic into one dynamic component to avoid all SSR/timing issues
const MapContent = ({ position, setPosition, onAddressFound }) => {
    // Only import leaflet internals inside the component which is dynamically loaded
    const { MapContainer, TileLayer, Marker, useMap, useMapEvents } = require("react-leaflet");
    const L = require("leaflet");

    // Internal controller to handle map movements
    const MapController = ({ position, setPosition, onAddressFound }) => {
        const map = useMap();

        useEffect(() => {
            if (position && map) {
                map.flyTo(position, 13);
            }
        }, [position, map]);

        const reverseGeocode = async (lat, lng) => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const data = await res.json();
                if (data && data.display_name) {
                    onAddressFound(data.display_name);
                }
            } catch (err) {
                console.error("Reverse geocoding failed:", err);
            }
        };

        useMapEvents({
            async click(e) {
                const newPos = [e.latlng.lat, e.latlng.lng];
                setPosition(newPos);
                await reverseGeocode(e.latlng.lat, e.latlng.lng);
            },
        });

        return position ? <Marker position={position} /> : null;
    };

    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapController
                position={position}
                setPosition={setPosition}
                onAddressFound={onAddressFound}
            />
        </MapContainer>
    );
};

// This is the actual component we export to the page
const SimpleMap = dynamic(() => Promise.resolve(MapContent), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    )
});
// --- END MAP COMPONENT ---

export default function AdminLots() {
    const [lots, setLots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLot, setEditingLot] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slots: "",
        address: "",
        latitude: 42.3314,
        longitude: -83.0458,
        halfHourRate: "",
        hourlyRate: "",
        dailyRate: "",
        weeklyRate: "",
        monthlyRate: ""
    });

    const [mapPosition, setMapPosition] = useState([42.3314, -83.0458]);

    useEffect(() => {
        fetchLots();
        // Styles should always be present
        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-css";
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }

        // Global Leaflet Icon Fix
        import("leaflet").then(L => {
            if (L.Icon && L.Icon.Default) {
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                });
            }
        });
    }, []);

    const fetchLots = async () => {
        try {
            const res = await fetch("/api/admin/lots");
            const data = await res.json();
            setLots(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchLocation = async (e) => {
        if (e) e.preventDefault();
        const query = searchQuery || formData.address;
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newPos = [parseFloat(lat), parseFloat(lon)];
                setMapPosition(newPos);
                setFormData(prev => ({ ...prev, address: display_name }));
                setSearchQuery(display_name);
            } else {
                alert("Location not found. Please try a more specific search.");
            }
        } catch (err) {
            console.error(err);
            alert("Search failed. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddressFromMap = (address) => {
        setFormData(prev => ({ ...prev, address }));
        setSearchQuery(address);
    };

    const handleOpenModal = (lot = null) => {
        if (lot) {
            setEditingLot(lot);
            setFormData({
                name: lot.name,
                slots: lot.capacity || lot.slots,
                address: lot.address,
                latitude: lot.latitude || 42.3314,
                longitude: lot.longitude || -83.0458,
                halfHourRate: lot.halfHourRate,
                hourlyRate: lot.hourlyRate,
                dailyRate: lot.dailyRate,
                weeklyRate: lot.weeklyRate,
                monthlyRate: lot.monthlyRate
            });
            setMapPosition([lot.latitude || 42.3314, lot.longitude || -83.0458]);
            setSearchQuery(lot.address);
        } else {
            setEditingLot(null);
            setFormData({
                name: "",
                slots: "",
                address: "",
                latitude: 42.3314,
                longitude: -83.0458,
                halfHourRate: "",
                hourlyRate: "",
                dailyRate: "",
                weeklyRate: "",
                monthlyRate: ""
            });
            setMapPosition([42.3314, -83.0458]);
            setSearchQuery("");
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const method = editingLot ? "PUT" : "POST";
        const body = {
            ...formData,
            capacity: parseInt(formData.slots),
            id: editingLot?.id
        };

        body.latitude = mapPosition[0];
        body.longitude = mapPosition[1];

        try {
            const res = await fetch("/api/admin/lots", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchLots();
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save lot");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this parking lot?")) return;
        try {
            const res = await fetch("/api/admin/lots", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                fetchLots();
            } else {
                throw new Error("Failed to delete");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete lot");
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Parking Lots Management</h1>
                    <p className="text-gray-500 mt-1">Configure your parking facilities, rates, and locations.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Create New Lot
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lots.map((lot) => (
                        <div key={lot.id} className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                        <Car className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(lot)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                            title="Edit Lot"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lot.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            title="Delete Lot"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{lot.name}</h3>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                        <span className="line-clamp-1">{lot.address}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="bg-gray-50 p-3 rounded-2xl">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Parking Slots</p>
                                        <p className="text-lg font-black text-gray-900 text-center">{lot.capacity}</p>
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-2xl">
                                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider text-center">Hourly</p>
                                        <p className="text-lg font-black text-emerald-700 text-center">${lot.hourlyRate}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-gray-50 grid grid-cols-2 gap-x-4">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">1/2 Hr:</span>
                                        <span className="font-bold text-gray-700">${lot.halfHourRate}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Daily:</span>
                                        <span className="font-bold text-gray-700">${lot.dailyRate}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Weekly:</span>
                                        <span className="font-bold text-gray-700">${lot.weeklyRate}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Monthly:</span>
                                        <span className="font-bold text-gray-700">${lot.monthlyRate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {lots.length === 0 && (
                        <div className="col-span-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] p-20 text-center">
                            <MapIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-gray-900">No Parking Lots Found</h3>
                            <p className="text-gray-500 mt-2">Start by creating your first parking facility.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden relative my-auto">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all z-[1002] shadow-sm"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                            {/* Form Left Side */}
                            <form onSubmit={handleSubmit} className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto space-y-6">
                                <h2 className="text-2xl font-black text-gray-900">
                                    {editingLot ? "Edit Parking Lot" : "Create New Parking Lot"}
                                </h2>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Lot Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                            placeholder="e.g. Detroit Central Parking"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Parking Slots</label>
                                            <div className="relative">
                                                <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    required
                                                    value={formData.slots}
                                                    onChange={(e) => setFormData({ ...formData, slots: e.target.value })}
                                                    className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                                    placeholder="200"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Current Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    required
                                                    value={formData.address}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, address: e.target.value });
                                                        setSearchQuery(e.target.value);
                                                    }}
                                                    className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                                    placeholder="123 Street..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-blue-50/50 border border-blue-100/50 rounded-3xl space-y-4">
                                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Rate Configuration ($)</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Half Hour</label>
                                                <input
                                                    type="number" step="0.01"
                                                    value={formData.halfHourRate}
                                                    onChange={(e) => setFormData({ ...formData, halfHourRate: e.target.value })}
                                                    className="w-full px-4 py-2 bg-white border border-blue-100 rounded-xl outline-none"
                                                    placeholder="2.50"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Hourly</label>
                                                <input
                                                    type="number" step="0.01"
                                                    value={formData.hourlyRate}
                                                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                                    className="w-full px-4 py-2 bg-white border border-blue-100 rounded-xl outline-none"
                                                    placeholder="5.00"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Daily</label>
                                                <input
                                                    type="number" step="0.01"
                                                    value={formData.dailyRate}
                                                    onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                                                    className="w-full px-4 py-2 bg-white border border-blue-100 rounded-xl outline-none"
                                                    placeholder="25.00"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Weekly</label>
                                                <input
                                                    type="number" step="0.01"
                                                    value={formData.weeklyRate}
                                                    onChange={(e) => setFormData({ ...formData, weeklyRate: e.target.value })}
                                                    className="w-full px-4 py-2 bg-white border border-blue-100 rounded-xl outline-none"
                                                    placeholder="100.00"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Monthly</label>
                                                <input
                                                    type="number" step="0.01"
                                                    value={formData.monthlyRate}
                                                    onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value })}
                                                    className="w-full px-4 py-2 bg-white border border-blue-100 rounded-xl outline-none"
                                                    placeholder="350.00"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-6 rounded-3xl shadow-xl shadow-blue-200 disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-6 h-6" />
                                            {editingLot ? "Update Lot Details" : "Create Parking Lot"}
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Map Side */}
                            <div className="w-full md:w-1/2 h-80 md:h-auto bg-gray-100 relative group flex flex-col border-l border-gray-100">
                                {/* Persistent Search Bar on Map */}
                                <div className="absolute top-0 left-0 right-0 z-[1001] p-6 pointer-events-none">
                                    <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white flex items-center overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500 w-full transition-all duration-300">
                                        <div className="pl-6 text-blue-600">
                                            <Search className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation(e)}
                                            placeholder="Find any address..."
                                            className="flex-1 px-4 py-5 outline-none font-bold text-gray-900 placeholder:text-gray-400 bg-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSearchLocation}
                                            disabled={isSearching}
                                            className="mr-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-blue-200"
                                        >
                                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pin Now"}
                                        </button>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="px-4 py-2 bg-black/70 backdrop-blur rounded-2xl border border-white/10 text-[10px] font-black text-white uppercase tracking-tighter shadow-xl">
                                            📍 PIN SYNC ACTIVE
                                        </div>
                                        <div className="px-4 py-2 bg-blue-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-tighter shadow-xl">
                                            👆 CLICK MAP TO AUTO-POPULATE
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-full min-h-[500px]">
                                    <SimpleMap
                                        position={mapPosition}
                                        setPosition={setMapPosition}
                                        onAddressFound={handleAddressFromMap}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
