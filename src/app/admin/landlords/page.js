"use client";
import { useState, useEffect } from "react";
import {
    Plus, Trash2, Edit, MapPin, Building2,
    Loader2, X, Save, Search, Image as ImageIcon,
    User, Phone, Hash, FileText, Map as MapIcon, Navigation, CheckCircle2
} from "lucide-react";
import dynamic from "next/dynamic";
import { CldUploadWidget } from "next-cloudinary";

const MapContent = ({ position, setPosition, onAddressFound, onReverseGeocoding }) => {
    const { MapContainer, TileLayer, Marker, useMap, useMapEvents } = require("react-leaflet");

    const MapController = () => {
        const map = useMap();
        useEffect(() => { if (position && map) map.flyTo(position, 13); }, [position, map]);
        useMapEvents({
            async click(e) {
                const newPos = [e.latlng.lat, e.latlng.lng];
                setPosition(newPos);
                if (onReverseGeocoding) onReverseGeocoding(true);
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
                    const data = await res.json();
                    if (data?.display_name) onAddressFound(data.display_name);
                } catch { }
                finally { if (onReverseGeocoding) onReverseGeocoding(false); }
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

const EMPTY_FORM = {
    lotName: "", address: "",
    spots: "", perSpotPriceMonthly: "", masterLeasePrice: "", yearlyLease: "",
    parcelAddress: "", parcelId: "", ownerName: "", ownerMailingAddress: "", ownerContact: "",
    thumbnail: null, images: []
};

export default function AdminLandlords() {
    const [proposals, setProposals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProposal, setEditingProposal] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
    const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);
    const [mapPosition, setMapPosition] = useState([39.1031, -84.5120]);

    useEffect(() => {
        fetchProposals();
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

    const fetchProposals = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/landlords");
            const data = await res.json();
            setProposals(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data?.length > 0) {
                const { lat, lon, display_name } = data[0];
                setMapPosition([parseFloat(lat), parseFloat(lon)]);
                setFormData(p => ({ ...p, address: display_name }));
                setSearchQuery(display_name);
            }
        } catch (err) { console.error(err); }
        finally { setIsSearching(false); }
    };

    const openModal = (prop = null) => {
        setEditingProposal(prop);
        if (prop) {
            setFormData({
                lotName: prop.lotName || "", address: prop.address || "",
                spots: prop.spots || "", perSpotPriceMonthly: prop.perSpotPriceMonthly || "",
                masterLeasePrice: prop.masterLeasePrice || "", yearlyLease: prop.yearlyLease || "",
                parcelAddress: prop.parcelAddress || "", parcelId: prop.parcelId || "",
                ownerName: prop.ownerName || "", ownerMailingAddress: prop.ownerMailingAddress || "",
                ownerContact: prop.ownerContact || "",
                thumbnail: prop.thumbnail || null, images: prop.images || []
            });
            setMapPosition([prop.latitude || 39.1031, prop.longitude || -84.5120]);
            setSearchQuery(prop.address || "");
        } else {
            setFormData(EMPTY_FORM);
            setMapPosition([39.1031, -84.5120]);
            setSearchQuery("");
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/landlords", {
                method: editingProposal ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, id: editingProposal?.id, latitude: mapPosition[0], longitude: mapPosition[1] }),
            });
            if (res.ok) { setIsModalOpen(false); fetchProposals(); }
        } catch (err) { console.error(err); }
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this proposal?")) return;
        await fetch("/api/admin/landlords", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        fetchProposals();
    };

    const set = (key, val) => setFormData(p => ({ ...p, [key]: val }));

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Landlord Proposals</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage leasing offers shown on the public Landlords page.</p>
                </div>
                <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" /> Add Proposal
                </button>
            </div>

            {/* Cards */}
            {isLoading ? (
                <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : proposals.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl py-24 text-center">
                    <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No proposals yet. Click "Add Proposal" to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {proposals.map((prop) => (
                        <div key={prop.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            {prop.thumbnail
                                ? <img src={prop.thumbnail} className="w-full h-40 object-cover" alt="" />
                                : <div className="w-full h-40 bg-gray-50 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-gray-200" /></div>
                            }
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 text-base truncate">{prop.lotName}</h3>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" />{prop.address}</p>
                                        {prop.ownerName && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><User className="w-3 h-3 shrink-0" />{prop.ownerName}</p>}
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => openModal(prop)} className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
                                            <Edit className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(prop.id)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Spots</p>
                                        <p className="text-sm font-black text-gray-800 mt-0.5">{prop.spots}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                                        <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">Per Spot</p>
                                        <p className="text-sm font-black text-blue-700 mt-0.5">${prop.perSpotPriceMonthly}</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
                                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Master</p>
                                        <p className="text-sm font-black text-emerald-700 mt-0.5">${prop.masterLeasePrice?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="w-full md:w-[55%] flex flex-col overflow-y-auto">
                            <div className="p-7 space-y-5 flex-1">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">{editingProposal ? "Edit Proposal" : "New Lease Proposal"}</h2>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
                                </div>

                                {/* ── Lot Basics ── */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Lot Information</p>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Lot Name</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input required value={formData.lotName} onChange={e => set('lotName', e.target.value)} placeholder="e.g. 109 E 8th St Lot" className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Location Address</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input required value={formData.address} onChange={e => { set('address', e.target.value); setSearchQuery(e.target.value); }} placeholder="Full street address..." className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium" />
                                                {isReverseGeocoding && (
                                                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setIsMobileMapOpen(true)}
                                                className="md:hidden flex items-center justify-center w-[46px] h-[46px] bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex-shrink-0"
                                            >
                                                <MapIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">No. of Spots</label>
                                            <input type="number" required value={formData.spots} onChange={e => set('spots', e.target.value)} placeholder="74" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Price / Spot / Month ($)</label>
                                            <input type="number" required value={formData.perSpotPriceMonthly} onChange={e => set('perSpotPriceMonthly', e.target.value)} placeholder="250" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-emerald-600 mb-1.5 uppercase tracking-wider">Master Lease Price ($)</label>
                                            <input type="number" step="0.01" required value={formData.masterLeasePrice} onChange={e => set('masterLeasePrice', e.target.value)} placeholder="18500" className="w-full px-4 py-2.5 bg-emerald-50 border border-emerald-200 focus:border-emerald-500 rounded-xl outline-none text-sm font-bold text-emerald-800 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Yearly Lease ($) <span className="normal-case text-gray-400 font-normal">optional</span></label>
                                            <input type="number" step="0.01" value={formData.yearlyLease} onChange={e => set('yearlyLease', e.target.value)} placeholder="Optional" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl outline-none text-sm font-medium transition-all" />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Parcel Details ── */}
                                <div className="space-y-3 pt-3 border-t border-gray-100">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Parcel Details</p>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Parcel Address</label>
                                        <input value={formData.parcelAddress} onChange={e => set('parcelAddress', e.target.value)} placeholder="e.g. Cincinnati, OH 45202" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Parcel ID</label>
                                        <input value={formData.parcelId} onChange={e => set('parcelId', e.target.value)} placeholder="e.g. 00790001000600" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium" />
                                    </div>
                                </div>

                                {/* ── Owner Details ── */}
                                <div className="space-y-3 pt-3 border-t border-gray-100">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Owner Details</p>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Owner Name</label>
                                        <input value={formData.ownerName} onChange={e => set('ownerName', e.target.value)} placeholder="e.g. Walnut Street Parking INC" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Owner Mailing Address</label>
                                        <input value={formData.ownerMailingAddress} onChange={e => set('ownerMailingAddress', e.target.value)} placeholder="e.g. 411 Oak St, Cincinnati, OH 45219" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Owner Contact (Phone)</label>
                                        <input value={formData.ownerContact} onChange={e => set('ownerContact', e.target.value)} placeholder="e.g. 513-879-5163" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium" />
                                    </div>
                                </div>

                                {/* ── Images ── */}
                                <div className="space-y-3 pt-3 border-t border-gray-100">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Images</p>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thumbnail</label>
                                            <CldUploadWidget uploadPreset="ml_default" onSuccess={res => set('thumbnail', res.info.secure_url)}>
                                                {({ open }) => <button type="button" onClick={() => open()} className="text-xs font-semibold text-blue-600 hover:text-blue-700">Upload</button>}
                                            </CldUploadWidget>
                                        </div>
                                        <div className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                                            {formData.thumbnail ? <img src={formData.thumbnail} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="w-8 h-8 text-gray-200" />}
                                        </div>
                                        {formData.thumbnail && <button type="button" onClick={() => set('thumbnail', null)} className="text-xs text-red-400 mt-1 hover:text-red-600">Remove</button>}
                                    </div>

                                    <div>
                                        <div className="mb-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gallery Images (max 3)</label>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Click an empty box to upload. Click the red X to remove.</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[0, 1, 2].map(i => (
                                                <div key={i} className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden flex items-center justify-center relative group/img">
                                                    {formData.images[i] ? (
                                                        <>
                                                            <img src={formData.images[i]} className="w-full h-full object-cover" alt="" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                                                                className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg p-1.5 shadow-lg backdrop-blur-sm transition-all hover:scale-110"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <CldUploadWidget
                                                            uploadPreset="ml_default"
                                                            onSuccess={res => setFormData(p => ({
                                                                ...p,
                                                                images: [...(p.images || []), res.info.secure_url].slice(0, 3)
                                                            }))}
                                                        >
                                                            {({ open }) => (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => open()}
                                                                    className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 transition-colors"
                                                                >
                                                                    <div className="p-2.5 rounded-full bg-white shadow-sm border border-gray-100 mb-2 group-hover/img:border-blue-200 group-hover/img:shadow-md transition-all group-hover/img:-translate-y-1">
                                                                        <ImageIcon className="w-4 h-4" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Add Photo</span>
                                                                </button>
                                                            )}
                                                        </CldUploadWidget>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 shrink-0">
                                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" />{editingProposal ? "Save Changes" : "Create Proposal"}</>}
                                </button>
                            </div>
                        </form>

                        {/* Map (Desktop only) */}
                        <div className="hidden md:flex w-[45%] flex-col bg-gray-50 border-l border-gray-100">
                            <div className="p-4 border-b border-gray-100 space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pin Location on Map</p>
                                <div className="flex gap-2">
                                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search address..." className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500 transition-all" />
                                    <button type="button" onClick={handleSearch} disabled={isSearching} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-1">
                                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400">Or click anywhere on the map to pin.</p>
                            </div>
                            <div className="flex-1 min-h-0">
                                <SimpleMap
                                    position={mapPosition}
                                    setPosition={setMapPosition}
                                    onAddressFound={addr => { setFormData(p => ({ ...p, address: addr })); setSearchQuery(addr); }}
                                    onReverseGeocoding={setIsReverseGeocoding}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Map Overlay */}
            {isMobileMapOpen && (
                <div className="fixed inset-0 z-[200] bg-slate-100 md:hidden">
                    {/* Full-screen Map Container */}
                    <div className="absolute inset-0 z-0">
                        <SimpleMap
                            position={mapPosition}
                            setPosition={setMapPosition}
                            onAddressFound={addr => { setFormData(p => ({ ...p, address: addr })); setSearchQuery(addr); }}
                            onReverseGeocoding={setIsReverseGeocoding}
                        />
                    </div>

                    {/* Top Controls: Search Bar */}
                    <div className="absolute top-0 left-0 right-0 z-10 p-4">
                        <div className="bg-white rounded-2xl shadow-xl p-2 flex items-center gap-2 border border-gray-100">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search location..."
                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 rounded-xl outline-none text-sm font-semibold"
                                />
                            </div>
                            <button
                                onClick={handleSearch} disabled={isSearching}
                                className="p-3 bg-blue-600 text-white rounded-xl shadow-lg active:scale-95 transition-all"
                            >
                                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setIsMobileMapOpen(false)}
                                className="p-3 bg-gray-100 text-gray-500 rounded-xl active:scale-95 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Bottom Controls: Address & Action Buttons */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                        <div className="bg-white rounded-[28px] shadow-2xl p-6 space-y-5 border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Pinned Location</p>
                                    <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
                                        {isReverseGeocoding ? "Detecting location..." : (formData.address || "Tap map to pin location")}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsMobileMapOpen(false)}
                                    className="py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                                <button
                                    onClick={() => setIsMobileMapOpen(false)}
                                    className="py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm shadow-xl shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
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
