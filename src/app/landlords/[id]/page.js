'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LandlordsDetailMobile from '@/components/LandlordsDetailMobile';
import {
    MapPin, Building2, Phone, Mail, ArrowLeft,
    ChevronLeft, ChevronRight, Hash, User, Home,
    Loader2, Calendar, ArrowRight, Car, TrendingUp, Images, X
} from 'lucide-react';

/* ─── Shared Lightbox ─── */
function Lightbox({ images, startIndex, onClose }) {
    const [idx, setIdx] = useState(startIndex);
    const prev = () => setIdx(i => (i === 0 ? images.length - 1 : i - 1));
    const next = () => setIdx(i => (i === images.length - 1 ? 0 : i + 1));

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col" onClick={onClose}>
            <div className="flex items-center justify-between px-6 py-4 shrink-0" onClick={e => e.stopPropagation()}>
                <span className="text-white/50 text-sm font-bold font-mono">{idx + 1} / {images.length}</span>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>
            <div className="flex-1 flex items-center justify-center relative px-8" onClick={e => e.stopPropagation()}>
                <img src={images[idx]} alt={`Photo ${idx + 1}`} className="max-h-full max-w-full object-contain rounded-2xl" />
                {images.length > 1 && (
                    <>
                        <button onClick={prev} className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button onClick={next} className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="shrink-0 px-6 py-4 flex gap-3 overflow-x-auto justify-center" onClick={e => e.stopPropagation()}>
                    {images.map((src, i) => (
                        <button key={i} onClick={() => setIdx(i)}
                            className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === idx ? 'border-blue-400 opacity-100 scale-105' : 'border-transparent opacity-40 hover:opacity-70'
                                }`}>
                            <img src={src} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function LandlordDetail() {
    const params = useParams();
    const router = useRouter();
    const [proposal, setProposal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStart, setLightboxStart] = useState(0);

    const openLightbox = (i) => { setLightboxStart(i); setLightboxOpen(true); };

    useEffect(() => {
        if (params.id) fetchProposal();
    }, [params.id]);

    const fetchProposal = async () => {
        try {
            const res = await fetch(`/api/admin/landlords/${params.id}`);
            if (!res.ok) { router.push('/landlords'); return; }
            const data = await res.json();
            setProposal(data);
        } catch (err) {
            router.push('/landlords');
        } finally {
            setIsLoading(false);
        }
    };

    const sliderImages = proposal
        ? [proposal.thumbnail, ...(proposal.images || [])].filter(Boolean)
        : [];

    const prevSlide = useCallback(() =>
        setCurrentSlide(c => (c === 0 ? sliderImages.length - 1 : c - 1)),
        [sliderImages.length]);

    const nextSlide = useCallback(() =>
        setCurrentSlide(c => (c === sliderImages.length - 1 ? 0 : c + 1)),
        [sliderImages.length]);

    useEffect(() => {
        if (sliderImages.length <= 1) return;
        const t = setInterval(nextSlide, 5000);
        return () => clearInterval(t);
    }, [nextSlide, sliderImages.length]);

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#03071e] gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
            <p className="text-blue-300/60 text-sm font-medium uppercase tracking-widest">Loading Proposal</p>
        </div>
    );
    if (!proposal) return null;

    const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 });

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {lightboxOpen && <Lightbox images={sliderImages} startIndex={lightboxStart} onClose={() => setLightboxOpen(false)} />}
            <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="flex-grow bg-[#03071e] md:bg-white">
                <LandlordsDetailMobile proposal={proposal} />

                <div className="hidden md:block">
                    {/* ─── HERO SLIDER ─── */}
                    <div className="relative w-full h-[65vh] md:h-[80vh] bg-[#03071e] overflow-hidden">
                        {sliderImages.length > 0 ? (
                            <>
                                {sliderImages.map((src, idx) => (
                                    <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                                        <img src={src} alt="" className="w-full h-full object-cover scale-[1.03]" style={{ filter: 'brightness(0.55)' }} />
                                    </div>
                                ))}

                                {/* Dark vignette */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#03071e] via-black/30 to-black/10 pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#03071e]/60 via-transparent to-transparent pointer-events-none" />

                                {/* Gallery icon button — top right */}
                                <button
                                    onClick={() => openLightbox(currentSlide)}
                                    className="absolute top-5 right-5 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 transition-colors group"
                                >
                                    <Images className="w-4 h-4 text-white" />
                                    <span className="text-[11px] font-bold text-white uppercase tracking-widest">
                                        {sliderImages.length > 1 ? `${currentSlide + 1} / ${sliderImages.length} Photos` : 'View Photo'}
                                    </span>
                                </button>

                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-24 h-24 text-blue-900/40" />
                            </div>
                        )}

                        {/* Hero text overlay */}
                        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-12 lg:px-16 pb-10 md:pb-14">
                            <Link href="/landlords" className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 text-xs font-semibold uppercase tracking-[0.2em] mb-5 transition-colors group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                All Proposals
                            </Link>
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur border border-blue-400/30 rounded-full px-4 py-1.5 mb-4">
                                        <Car className="w-3.5 h-3.5 text-blue-300" />
                                        <span className="text-xs font-black text-blue-200 uppercase tracking-widest">{proposal.spots} Spots Available</span>
                                    </div>
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase leading-[0.9] tracking-tight">
                                        {proposal.lotName}
                                    </h1>
                                    <p className="flex items-center gap-2 text-white/55 text-sm mt-4 font-medium">
                                        <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                                        {proposal.address}
                                    </p>
                                </div>
                                {/* Quick price badge */}
                                <div className="hidden md:block shrink-0 bg-emerald-500/20 backdrop-blur border border-emerald-400/30 rounded-3xl px-6 py-4 text-right">
                                    <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">Full Lot / Month</p>
                                    <p className="text-3xl font-black text-white">${fmt(proposal.masterLeasePrice)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── MAIN CONTENT ─── */}
                    <div className="bg-white">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                            {/* ─── PRICING STRIP ─── */}
                            <div className="grid grid-cols-2 md:grid-cols-4 -mt-1 border-b border-gray-100">
                                {[
                                    { label: 'Spots', value: proposal.spots, unit: 'Total capacity', bg: 'bg-white' },
                                    { label: 'Per Spot / Mo', value: <span className="flex items-baseline gap-1">${fmt(proposal.perSpotPriceMonthly)} <span className="text-sm font-bold text-gray-400">/mo</span></span>, unit: 'Monthly per space', bg: 'bg-gray-50' },
                                    { label: 'Full Lot / Mo', value: `$${fmt(proposal.masterLeasePrice)}`, unit: 'Master lease', bg: 'bg-emerald-600', textLight: true },
                                    { label: 'Yearly Lease', value: proposal.yearlyLease ? `$${fmt(proposal.yearlyLease)}` : '$*****', unit: proposal.yearlyLease ? 'Annual total' : 'Contact for price', bg: 'bg-gray-900', textLight: true },
                                ].map((item, i) => (
                                    <div key={i} className={`${item.bg} px-6 py-7 md:px-8 md:py-8 border-r border-gray-100/20 last:border-0`}>
                                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${item.textLight ? 'text-white/50' : 'text-gray-400'}`}>{item.label}</p>
                                        <p className={`text-2xl md:text-3xl font-black leading-none ${item.textLight ? 'text-white' : i === 0 ? 'text-blue-900' : 'text-gray-900'}`}>{item.value}</p>
                                        <p className={`text-xs mt-2 font-medium ${item.textLight ? 'text-white/40' : 'text-gray-400'}`}>{item.unit}</p>
                                    </div>
                                ))}
                            </div>

                            {/* ─── BODY GRID ─── */}
                            <div className="grid md:grid-cols-3 gap-12 py-16">

                                {/* Left: Details */}
                                <div className="md:col-span-2 space-y-12">

                                    {/* Parcel Info */}
                                    {(proposal.parcelAddress || proposal.parcelId) && (
                                        <section>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-px bg-blue-200" />
                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em]">Parcel Information</p>
                                            </div>
                                            <div className="rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-50">
                                                {proposal.parcelAddress && (
                                                    <div className="flex items-start gap-5 p-5 hover:bg-gray-50/60 transition-colors">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                                            <MapPin className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Parcel Address</p>
                                                            <p className="font-semibold text-gray-900">{proposal.parcelAddress}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {proposal.parcelId && (
                                                    <div className="flex items-start gap-5 p-5 hover:bg-gray-50/60 transition-colors">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Hash className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Parcel ID</p>
                                                            <p className="font-semibold text-gray-900 font-mono tracking-wider">{proposal.parcelId}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    )}

                                    {/* Owner Info */}
                                    {(proposal.ownerName || proposal.ownerMailingAddress || proposal.ownerContact) && (
                                        <section>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-px bg-blue-200" />
                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em]">Owner Information</p>
                                            </div>
                                            <div className="rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-50">
                                                {proposal.ownerName && (
                                                    <div className="flex items-start gap-5 p-5 hover:bg-gray-50/60 transition-colors">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                                                            <User className="w-4 h-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Owner Name</p>
                                                            <p className="font-semibold text-gray-900">{proposal.ownerName}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {proposal.ownerMailingAddress && (
                                                    <div className="flex items-start gap-5 p-5 hover:bg-gray-50/60 transition-colors">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Home className="w-4 h-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Owner Mailing Address</p>
                                                            <p className="font-semibold text-gray-900">{proposal.ownerMailingAddress}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {proposal.ownerContact && (
                                                    <div className="flex items-start gap-5 p-5 hover:bg-gray-50/60 transition-colors">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Phone className="w-4 h-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Owner's Contact</p>
                                                            <p className="font-semibold text-gray-900">{proposal.ownerContact}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    )}

                                    {/* Detroit Parking CTA banner */}
                                    <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-[#03071e] p-8 md:p-10 relative overflow-hidden">
                                        <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />
                                        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl" />
                                        <div className="relative z-10">
                                            <p className="text-[10px] font-black text-blue-300/60 uppercase tracking-[0.25em] mb-2">Detroit Parking LLC</p>
                                            <h3 className="text-2xl md:text-3xl font-black text-white mb-6 leading-tight">
                                                We make your<br />lot <span className="text-blue-400">work for you.</span>
                                            </h3>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <a href="tel:513-879-5163" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-5 py-3.5 transition-all group">
                                                    <Phone className="w-5 h-5 text-blue-300 shrink-0" />
                                                    <div>
                                                        <p className="text-[9px] font-black text-blue-300/60 uppercase tracking-widest">Call / Text</p>
                                                        <p className="font-bold text-white text-sm">513-879-5163</p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 ml-auto text-blue-400 group-hover:translate-x-1 transition-transform" />
                                                </a>
                                                <a href="mailto:detroitparkingllc@gmail.com" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-5 py-3.5 transition-all group">
                                                    <Mail className="w-5 h-5 text-blue-300 shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] font-black text-blue-300/60 uppercase tracking-widest">Email</p>
                                                        <p className="font-bold text-white text-sm truncate">detroitparkingllc@gmail.com</p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 ml-auto shrink-0 text-blue-400 group-hover:translate-x-1 transition-transform" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Sticky Summary */}
                                <div className="md:col-span-1">
                                    <div className="sticky top-24 space-y-4">

                                        {/* Pricing summary */}
                                        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                            <div className="bg-gray-900 px-6 py-5">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Proposal Summary</p>
                                                <p className="text-white font-bold text-lg leading-snug">{proposal.lotName}</p>
                                            </div>
                                            <div className="divide-y divide-gray-50">
                                                {[
                                                    { label: 'Total Spots', value: `${proposal.spots} spaces` },
                                                    { label: 'Per Spot / Month', value: `$${fmt(proposal.perSpotPriceMonthly)} /mo` },
                                                    { label: 'Full Lot / Month', value: `$${fmt(proposal.masterLeasePrice)}`, highlight: true, color: 'text-emerald-700' },
                                                    { label: 'Yearly Lease', value: proposal.yearlyLease ? `$${fmt(proposal.yearlyLease)}` : '$*****', color: proposal.yearlyLease ? 'text-blue-900' : 'text-gray-300' },
                                                ].map((row, i) => (
                                                    <div key={i} className={`flex justify-between items-center px-6 py-4 ${row.highlight ? 'bg-emerald-50/40' : ''}`}>
                                                        <span className="text-sm text-gray-500 font-medium">{row.label}</span>
                                                        <span className={`font-black text-sm ${row.color || 'text-gray-900'}`}>{row.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Address */}
                                        {proposal.parcelAddress && (
                                            <div className="rounded-2xl border border-gray-100 px-5 py-4 flex items-start gap-3">
                                                <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Location</p>
                                                    <p className="text-sm font-semibold text-gray-700">{proposal.parcelAddress}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* CTA */}
                                        <a href="tel:513-879-5163"
                                            className="flex items-center justify-center gap-3 w-full bg-blue-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/25 text-sm uppercase tracking-widest group">
                                            <Phone className="w-4 h-4" />
                                            Contact Us Now
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </a>

                                        <Link href="/landlords"
                                            className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:border-gray-400 text-gray-600 hover:text-gray-900 font-semibold py-3.5 rounded-2xl transition-all text-sm">
                                            <ArrowLeft className="w-4 h-4" />
                                            View All Proposals
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
