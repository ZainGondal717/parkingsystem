'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LandlordsMobile from '@/components/LandlordsMobile';
import { Building2, MapPin, Calculator, Coins, Phone, Mail, Loader2, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Landlords() {
    const [lots, setLots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchLots();
    }, []);

    const fetchLots = async () => {
        try {
            const res = await fetch('/api/admin/landlords');
            const data = await res.json();
            setLots(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch proposals:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="flex-grow">
                <LandlordsMobile lots={lots} />

                <div className="hidden md:block">
                    {/* Hero Section */}
                    <section className="bg-blue-900 text-white py-24 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                        </div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                            <h1 className="text-5xl font-extrabold tracking-tight mb-6 uppercase">OUR OFFERS FOR LEASING</h1>
                            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                                Detroit Parking LLC is pleased to submit these proposals to the Cincinnati Parking Property owners
                                for leasing any of their parking lots located in Downtown Cincinnati OH, at month-to-month rent
                                bases or long-term lease.
                            </p>

                            <div className="mt-10 flex flex-wrap justify-center gap-6">
                                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-blue-300" />
                                    <span className="font-bold">TALK OR TEXT: 513-879-5163</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Content Sections */}
                    <section className="py-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-12 h-12 animate-spin text-blue-900 mb-4" />
                                    <p className="text-gray-500 font-medium">Loading leasing opportunities...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {lots.map((lot, index) => (
                                        <div
                                            key={lot.id}
                                            className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-200/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full"
                                        >
                                            {/* Image Container */}
                                            <div className="relative h-60 overflow-hidden shrink-0">
                                                <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500" />
                                                <img
                                                    src={lot.thumbnail || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800'}
                                                    alt={lot.lotName}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#03071e]/90 via-[#03071e]/20 to-transparent z-10" />

                                                {/* Top Badges */}
                                                <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                                                    <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border border-white/20 shadow-xl">
                                                        Proposal {String(index + 1).padStart(2, '0')}
                                                    </div>
                                                    {lot.masterLeasePrice > 0 && (
                                                        <div className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                                            Master Lease
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Image Bottom Info overlaid */}
                                                <div className="absolute bottom-5 left-5 right-5 z-20">
                                                    <h3 className="text-2xl font-black text-white mb-1 leading-tight tracking-tight drop-shadow-md group-hover:text-blue-200 transition-colors uppercase line-clamp-1">
                                                        {lot.lotName}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 text-white/80">
                                                        <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                                                        <p className="text-xs font-bold tracking-wider uppercase truncate">
                                                            {lot.address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="p-6 md:p-8 flex flex-col flex-grow bg-white relative">

                                                {/* Pricing Stats Grid */}
                                                <div className="grid grid-cols-2 gap-3 mb-6">
                                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:border-blue-100 transition-colors">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Building2 className="w-3 h-3 text-blue-500" /> Capacity</p>
                                                        <p className="text-xl font-black text-gray-900 group-hover:text-blue-900 transition-colors">{lot.spots || 0} <span className="text-xs font-bold text-gray-400">SPOTS</span></p>
                                                    </div>
                                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:border-emerald-100 transition-colors">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calculator className="w-3 h-3 text-emerald-500" /> Per Spot</p>
                                                        <p className="text-xl font-black text-gray-900 group-hover:text-emerald-700 transition-colors">${lot.perSpotPriceMonthly || 0} <span className="text-xs font-bold text-gray-400">/mo</span></p>
                                                    </div>
                                                </div>

                                                {/* Master & Yearly Rows */}
                                                <div className="space-y-4 mb-8">
                                                    <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                                        <div>
                                                            <p className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest mb-0.5">Full Lot / Month</p>
                                                            <p className="font-bold text-gray-500 text-xs flex items-center gap-1"><Coins className="w-3 h-3" /> Master Lease</p>
                                                        </div>
                                                        <p className="text-2xl font-black text-emerald-700">${lot.masterLeasePrice?.toLocaleString() || '0'}</p>
                                                    </div>

                                                    <div className="flex items-center justify-between px-4">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Yearly Contract</p>
                                                        <p className={`text-lg font-black ${lot.yearlyLease ? 'text-gray-900' : 'text-gray-300 tracking-wider'}`}>
                                                            {lot.yearlyLease ? `$${Number(lot.yearlyLease).toLocaleString()}` : '$*****'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Button */}
                                                <Link href={`/landlords/${lot.id}`} className="mt-auto relative w-full inline-flex items-center justify-center gap-2 px-8 py-4 font-black uppercase tracking-widest text-sm text-white bg-[#03071e] hover:bg-blue-600 rounded-2xl overflow-hidden transition-all group/btn shadow-xl shadow-[#03071e]/10 hover:shadow-blue-500/25">
                                                    <span className="relative z-10 transition-transform group-hover/btn:-translate-x-1">View Details</span>
                                                    <ArrowRight className="w-4 h-4 relative z-10 transition-all group-hover/btn:translate-x-1 opacity-70 group-hover/btn:opacity-100" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}

                                    {lots.length === 0 && (
                                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                                            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                                            <h3 className="text-2xl font-black text-gray-900 uppercase">No active proposals</h3>
                                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                                We are constantly looking for new opportunities. Check back soon or contact us directly.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Why Partner with Us */}
                    <section className="py-24 bg-white border-y border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 uppercase leading-tight">
                                        Why Partner With <span className="text-blue-900">Detroit Parking LLC?</span>
                                    </h2>
                                    <div className="space-y-8">
                                        <div className="flex gap-4">
                                            <div className="bg-blue-100 p-4 rounded-2xl h-fit">
                                                <ShieldCheck className="w-6 h-6 text-blue-900" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-2">Proven Track Record</h3>
                                                <p className="text-gray-600">Managing numerous prime locations across Ohio with consistent performance and reliability.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="bg-emerald-100 p-4 rounded-2xl h-fit">
                                                <Calculator className="w-6 h-6 text-emerald-900" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-2">Maximum Yield</h3>
                                                <p className="text-gray-600">Our master lease models are designed to provide property owners with guaranteed competitive monthly returns.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=800"
                                        className="rounded-[40px] shadow-3xl"
                                        alt="Parking management"
                                    />
                                    <div className="absolute -bottom-8 -right-8 bg-blue-900 text-white p-10 rounded-[40px] shadow-2xl hidden md:block border-8 border-white">
                                        <p className="text-4xl font-black mb-1">100%</p>
                                        <p className="text-xs font-black uppercase tracking-widest opacity-70">Guaranteed Management</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact Footer */}
                    <section className="py-20 bg-gray-900 text-white text-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-black mb-12 uppercase tracking-tighter">Ready to lease your property?</h2>
                            <div className="flex flex-wrap justify-center gap-12">
                                <div className="flex flex-col items-center">
                                    <div className="bg-white/10 p-5 rounded-3xl mb-4 border border-white/10">
                                        <Phone className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Call / Text</p>
                                    <a href="tel:513-879-5163" className="text-2xl font-bold">513-879-5163</a>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="bg-white/10 p-5 rounded-3xl mb-4 border border-white/10">
                                        <Mail className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Email Proposal</p>
                                    <a href="mailto:detroitparkingllc@gmail.com" className="text-2xl font-bold">detroitparkingllc@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
