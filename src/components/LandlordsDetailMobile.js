'use client';
import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Building2, Phone, Mail, ArrowLeft, Hash, User, Home, Calendar, Car, Coins, Images, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

/* ─── Image Lightbox ─── */
function Lightbox({ images, startIndex, onClose }) {
    const [idx, setIdx] = useState(startIndex);
    const prev = () => setIdx(i => (i === 0 ? images.length - 1 : i - 1));
    const next = () => setIdx(i => (i === images.length - 1 ? 0 : i + 1));

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col" onClick={onClose}>
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0" onClick={e => e.stopPropagation()}>
                <span className="text-white/50 text-sm font-bold font-mono">{idx + 1} / {images.length}</span>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center relative px-4" onClick={e => e.stopPropagation()}>
                <img
                    src={images[idx]}
                    alt={`Photo ${idx + 1}`}
                    className="max-h-full max-w-full object-contain rounded-xl"
                />
                {images.length > 1 && (
                    <>
                        <button onClick={prev} className="absolute left-2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button onClick={next} className="absolute right-2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbs strip */}
            {images.length > 1 && (
                <div className="shrink-0 px-5 py-4 flex gap-2 overflow-x-auto" onClick={e => e.stopPropagation()}>
                    {images.map((src, i) => (
                        <button key={i} onClick={() => setIdx(i)}
                            className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? 'border-blue-400 opacity-100 scale-105' : 'border-transparent opacity-40 hover:opacity-70'}`}>
                            <img src={src} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function LandlordsDetailMobile({ proposal }) {
    const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 });

    const sliderImages = proposal ? [proposal.thumbnail, ...(proposal.images || [])].filter(Boolean) : [];
    const [currentSlide, setCurrentSlide] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStart, setLightboxStart] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide(c => (c === sliderImages.length - 1 ? 0 : c + 1));
    }, [sliderImages.length]);

    useEffect(() => {
        if (sliderImages.length <= 1) return;
        const t = setInterval(nextSlide, 5000);
        return () => clearInterval(t);
    }, [nextSlide, sliderImages.length]);

    const openLightbox = (i) => { setLightboxStart(i); setLightboxOpen(true); };

    if (!proposal) return null;

    return (
        <>
            {lightboxOpen && <Lightbox images={sliderImages} startIndex={lightboxStart} onClose={() => setLightboxOpen(false)} />}

            <div className="md:hidden flex flex-col min-h-screen relative pb-24">

                {/* ─── HERO SLIDER (Matching Web View) ─── */}
                <div className="relative w-full h-[65vh] bg-[#03071e] overflow-hidden">
                    {sliderImages.length > 0 ? (
                        <>
                            {sliderImages.map((src, idx) => (
                                <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                                    <img src={src} alt="Lot photo" className="w-full h-full object-cover scale-[1.03]" style={{ filter: 'brightness(0.55)' }} />
                                </div>
                            ))}

                            {/* Dark vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#03071e] via-black/30 to-black/10 pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#03071e]/60 via-transparent to-transparent pointer-events-none" />

                            <button
                                onClick={() => openLightbox(currentSlide)}
                                className="absolute top-5 right-5 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 transition-colors group"
                            >
                                <Images className="w-4 h-4 text-white" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                                    {sliderImages.length > 1 ? `${currentSlide + 1} / ${sliderImages.length} Photos` : 'View Photo'}
                                </span>
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-16 h-16 text-blue-900/40" />
                        </div>
                    )}

                    {/* Hero text overlay */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-8">
                        <Link href="/landlords" className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 text-xs font-semibold uppercase tracking-[0.2em] mb-4 transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            All Proposals
                        </Link>

                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur border border-blue-400/30 rounded-full px-4 py-1.5 mb-3">
                                <Car className="w-3.5 h-3.5 text-blue-300" />
                                <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">{proposal.spots} Spots Available</span>
                            </div>
                            <h1 className="text-4xl font-black text-white uppercase leading-[0.9] tracking-tight mb-3">
                                {proposal.lotName}
                            </h1>
                            <p className="flex items-start gap-2 text-white/55 text-xs font-medium">
                                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                {proposal.address}
                            </p>

                            {/* Mobile specific quick price badge matching web format */}
                            <div className="mt-6 shrink-0 bg-emerald-500/20 backdrop-blur border border-emerald-400/30 rounded-[1.5rem] px-5 py-4 w-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                                <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1 relative z-10">Full Lot / Month</p>
                                <p className="text-3xl font-black text-white relative z-10">${fmt(proposal.masterLeasePrice)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── MAIN CONTENT (Matching Web View Grid layout but for mobile) ─── */}
                <div className="bg-white">

                    {/* ─── PRICING STRIP ─── */}
                    <div className="grid grid-cols-2 -mt-1 border-b border-gray-100">
                        {[
                            { label: 'Spots', value: proposal.spots, unit: 'Total capacity', bg: 'bg-white' },
                            { label: 'Per Spot / Mo', value: <span className="flex items-baseline gap-1">${fmt(proposal.perSpotPriceMonthly)} <span className="text-[10px] font-bold text-gray-400">/mo</span></span>, unit: 'Monthly per space', bg: 'bg-gray-50' },
                            { label: 'Full Lot / Mo', value: `$${fmt(proposal.masterLeasePrice)}`, unit: 'Master lease', bg: 'bg-emerald-600', textLight: true },
                            { label: 'Yearly Lease', value: proposal.yearlyLease ? `$${fmt(proposal.yearlyLease)}` : '$*****', unit: proposal.yearlyLease ? 'Annual total' : 'Contact for price', bg: 'bg-gray-900', textLight: true },
                        ].map((item, i) => (
                            <div key={i} className={`${item.bg} px-5 py-6 border-b border-r border-gray-100/20 border-b-0`}>
                                <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${item.textLight ? 'text-white/50' : 'text-gray-400'}`}>{item.label}</p>
                                <p className={`text-2xl font-black leading-none ${item.textLight ? 'text-white' : i === 0 ? 'text-blue-900' : 'text-gray-900'}`}>{item.value}</p>
                                <p className={`text-[10px] mt-2 font-medium ${item.textLight ? 'text-white/40' : 'text-gray-400'}`}>{item.unit}</p>
                            </div>
                        ))}
                    </div>

                    <div className="px-5 py-10 space-y-10">

                        {/* Summary Block */}
                        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="bg-gray-900 px-5 py-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Proposal Summary</p>
                                <p className="text-white font-bold text-base leading-snug">{proposal.lotName}</p>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {[
                                    { label: 'Total Spots', value: `${proposal.spots} spaces` },
                                    { label: 'Per Spot / Month', value: `$${fmt(proposal.perSpotPriceMonthly)} /mo` },
                                    { label: 'Full Lot / Month', value: `$${fmt(proposal.masterLeasePrice)}`, highlight: true, color: 'text-emerald-700' },
                                    { label: 'Yearly Lease', value: proposal.yearlyLease ? `$${fmt(proposal.yearlyLease)}` : '$*****', color: proposal.yearlyLease ? 'text-blue-900' : 'text-gray-300' },
                                ].map((row, i) => (
                                    <div key={i} className={`flex justify-between items-center px-5 py-4 ${row.highlight ? 'bg-emerald-50/40' : ''}`}>
                                        <span className="text-xs text-gray-500 font-medium">{row.label}</span>
                                        <span className={`font-black text-sm ${row.color || 'text-gray-900'}`}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Parcel Info */}
                        {(proposal.parcelAddress || proposal.parcelId) && (
                            <section>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-8 h-px bg-blue-200" />
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em]">Parcel Information</p>
                                </div>
                                <div className="rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-50">
                                    {proposal.parcelAddress && (
                                        <div className="flex items-start gap-4 p-4 hover:bg-gray-50/60 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Parcel Address</p>
                                                <p className="text-sm font-semibold text-gray-900">{proposal.parcelAddress}</p>
                                            </div>
                                        </div>
                                    )}
                                    {proposal.parcelId && (
                                        <div className="flex items-start gap-4 p-4 hover:bg-gray-50/60 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                                <Hash className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Parcel ID</p>
                                                <p className="text-sm font-semibold text-gray-900 font-mono tracking-wider">{proposal.parcelId}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Owner Info */}
                        {(proposal.ownerName || proposal.ownerMailingAddress || proposal.ownerContact) && (
                            <section>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-8 h-px bg-blue-200" />
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em]">Owner Information</p>
                                </div>
                                <div className="rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-50">
                                    {proposal.ownerName && (
                                        <div className="flex items-start gap-4 p-4 hover:bg-gray-50/60 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                                                <User className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Owner Name</p>
                                                <p className="text-sm font-semibold text-gray-900">{proposal.ownerName}</p>
                                            </div>
                                        </div>
                                    )}
                                    {proposal.ownerMailingAddress && (
                                        <div className="flex items-start gap-4 p-4 hover:bg-gray-50/60 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                                                <Home className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Owner Mailing Address</p>
                                                <p className="text-sm font-semibold text-gray-900">{proposal.ownerMailingAddress}</p>
                                            </div>
                                        </div>
                                    )}
                                    {proposal.ownerContact && (
                                        <div className="flex items-start gap-4 p-4 hover:bg-gray-50/60 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                                                <Phone className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Owner's Contact</p>
                                                <p className="text-sm font-semibold text-gray-900">{proposal.ownerContact}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Detroit Parking CTA banner */}
                        <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-[#03071e] p-7 md:p-10 relative overflow-hidden shadow-2xl shadow-blue-900/20">
                            <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />
                            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-blue-300/60 uppercase tracking-[0.25em] mb-2">Detroit Parking LLC</p>
                                <h3 className="text-2xl font-black text-white mb-6 leading-tight">
                                    We make your<br />lot <span className="text-blue-400">work for you.</span>
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <a href="tel:513-879-5163" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-5 py-4 transition-all group">
                                        <Phone className="w-5 h-5 text-blue-300 shrink-0" />
                                        <div>
                                            <p className="text-[9px] font-black text-blue-300/60 uppercase tracking-widest">Call / Text</p>
                                            <p className="font-bold text-white text-sm">513-879-5163</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 ml-auto text-blue-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                    <a href="mailto:detroitparkingllc@gmail.com" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-5 py-4 transition-all group">
                                        <Mail className="w-5 h-5 text-blue-300 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] font-black text-blue-300/60 uppercase tracking-widest">Email</p>
                                            <p className="font-bold text-white text-sm truncate">detroitparkingllc@gmail.com</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 ml-auto shrink-0 text-blue-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── FLOATING ACTION BAR ── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 px-5 py-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-40">
                <a href="tel:513-879-5163" className="w-full flex items-center justify-center gap-3 bg-blue-900 hover:bg-black active:scale-[0.98] text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] shadow-xl shadow-blue-900/20 transition-all">
                    <Phone className="w-4 h-4" /> Contact Us Now
                </a>
            </div>
        </>
    );
}
