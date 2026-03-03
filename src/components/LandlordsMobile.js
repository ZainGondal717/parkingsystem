import Link from 'next/link';
import { Building2, MapPin, Calculator, Coins, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LandlordsMobile({ lots }) {
    if (!lots || lots.length === 0) {
        return (
            <div className="md:hidden py-16 px-4 bg-gray-50 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Building2 className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase">No active proposals</h3>
                <p className="text-gray-500 mt-2 text-sm">Check back later or contact us directly.</p>
            </div>
        );
    }

    return (
        <div className="md:hidden bg-gray-50/50 pb-20">
            {/* Mobile Header / Hero Area */}
            <div className="bg-blue-900 text-white px-5 pt-12 pb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <h1 className="text-3xl font-black uppercase tracking-tight leading-[1.1] mb-4 relative z-10">
                    Leasing<br /><span className="text-blue-300">Proposals</span>
                </h1>
                <p className="text-sm text-blue-100/90 leading-relaxed mb-6 font-medium relative z-10">
                    Detroit Parking LLC presents these proposals for leasing parking properties in Downtown Cincinnati.
                </p>
                <a href="tel:513-879-5163" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 transition-all font-bold text-sm">
                    <Phone className="w-4 h-4 text-blue-300" />
                    513-879-5163
                </a>
            </div>

            {/* Proposals List */}
            <div className="px-4 -mt-8 relative z-20 space-y-6">
                {lots.map((lot, index) => (
                    <div key={lot.id} className="bg-white rounded-[1.75rem] shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col border border-gray-100">
                        {/* Image wrapper */}
                        <div className="relative h-48 w-full bg-gray-900 shrink-0 overflow-hidden">
                            <img
                                src={lot.thumbnail || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800'}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm">
                                    #{index + 1}
                                </span>
                                {lot.masterLeasePrice > 0 && (
                                    <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm">
                                        Master Lease
                                    </span>
                                )}
                            </div>

                            {/* Title & Addr inside image */}
                            <div className="absolute bottom-3 left-4 right-4 text-white">
                                <h3 className="text-xl font-black uppercase leading-tight line-clamp-1">{lot.lotName}</h3>
                                <div className="flex items-center gap-1.5 mt-1 text-white/80">
                                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                    <p className="text-[10px] font-bold tracking-widest uppercase truncate">{lot.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex flex-col">

                            <div className="flex gap-2 mb-4">
                                <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col justify-center">
                                    <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                                        <Building2 className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Spots</span>
                                    </div>
                                    <p className="text-lg font-black text-gray-900 leading-none">{lot.spots || 0}</p>
                                </div>
                                <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col justify-center">
                                    <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                                        <Calculator className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Per Spot</span>
                                    </div>
                                    <p className="text-lg font-black text-gray-900 leading-none">
                                        ${lot.perSpotPriceMonthly || 0} <span className="text-xs font-bold text-gray-500">/mo</span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="bg-emerald-100 p-1.5 rounded-lg">
                                        <Coins className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600/70">Full Lot / Mo</p>
                                        <p className="text-sm font-bold text-gray-600 leading-tight">Master Lease</p>
                                    </div>
                                </div>
                                <p className="text-xl font-black text-emerald-700">${lot.masterLeasePrice?.toLocaleString() || '0'}</p>
                            </div>

                            <Link href={`/landlords/${lot.id}`} className="w-full flex items-center justify-center gap-2 bg-[#03071e] active:bg-blue-900 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-[#03071e]/10">
                                View Details
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Trust section for mobile */}
            <div className="mt-12 px-5 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
                    <ShieldCheck className="w-6 h-6 text-blue-900" />
                </div>
                <h2 className="text-xl font-black uppercase text-gray-900 mb-2">Proven Track Record</h2>
                <p className="text-sm text-gray-500 font-medium">100% Guaranteed Management across Ohio.</p>
            </div>
        </div>
    );
}
