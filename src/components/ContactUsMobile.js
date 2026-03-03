'use client';

import { Mail, MapPin, Phone, Building, Send, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ContactUsMobile() {
    const contactOptions = [
        {
            icon: Phone,
            title: 'Phone',
            detail: '513-879-5163',
            action: 'tel:513-879-5163',
            subtitle: 'Call us for immediate help'
        },
        {
            icon: Mail,
            title: 'Email',
            detail: 'detroitparkingllc@gmail.com',
            action: 'mailto:detroitparkingllc@gmail.com',
            subtitle: 'Response within 24 hours'
        },
        {
            icon: MapPin,
            title: 'Main Office',
            detail: '1102 Adams St, Toledo, OH 43604',
            action: null,
            subtitle: 'Visit our Ohio HQ'
        }
    ];

    return (
        <div className="md:hidden">
            {/* Header Section */}
            <div className="bg-blue-900 text-white px-4 py-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute right-0 top-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute left-0 bottom-0 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-4">CONTACT US</h1>
                    <p className="text-blue-100 text-sm max-w-xs mx-auto">
                        We're here to help you. Reach out to us for any questions regarding our
                        parking services.
                    </p>
                </div>
            </div>

            {/* Info Cards - 3D Effect */}
            <div className="px-4 py-8 bg-white -mt-6">
                <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                    {contactOptions.map((opt, i) => (
                        <div key={i} className="relative group transform-gpu active:scale-95 transition-all">
                            <div className="absolute inset-0 bg-black/5 rounded-2xl transform translate-y-1 blur-md"></div>
                            <div className="relative bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:border-blue-200 transition-colors">
                                <div className="bg-blue-600 p-3 rounded-xl flex-shrink-0 shadow-md">
                                    <opt.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{opt.title}</p>
                                    {opt.action ? (
                                        <a href={opt.action} className="text-sm font-bold text-blue-900 truncate block mt-1">{opt.detail}</a>
                                    ) : (
                                        <p className="text-sm font-bold text-blue-900 mt-1">{opt.detail}</p>
                                    )}
                                    <p className="text-[10px] text-gray-500 mt-1">{opt.subtitle}</p>
                                </div>
                                {opt.action && <ArrowRight className="w-4 h-4 text-blue-200" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Section */}
            <div className="px-4 py-8 bg-gray-50">
                <div className="max-w-sm mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-gray-900">Send us a Message</h2>
                        <div className="w-12 h-1 bg-blue-900 mx-auto mt-2 rounded-full"></div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-black/5 rounded-3xl transform translate-y-2 blur-xl"></div>
                        <div className="relative bg-white p-6 rounded-3xl border border-gray-100 shadow-lg">
                            <form className="space-y-4">
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none text-sm transition-all"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none text-sm transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none text-sm transition-all"
                                    />
                                    <textarea
                                        rows={4}
                                        placeholder="Your message here..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none text-sm transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="button"
                                    className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-800 transition-all flex items-center justify-center group active:scale-95 shadow-md shadow-blue-200"
                                >
                                    Send Message
                                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info & Sub-Section */}
            <div className="px-4 py-12 bg-white">
                <div className="max-w-sm mx-auto">
                    <div className="bg-blue-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <Building className="w-48 h-48 absolute -right-10 -bottom-10" />
                        </div>

                        <ShieldCheck className="w-10 h-10 text-blue-300 mb-4" />
                        <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">Detroit Parking LLC</h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-blue-100">Operating Hours</p>
                                    <p className="text-xs">Daily: 24/7 Availability</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Building className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-blue-100">Office Location</p>
                                    <p className="text-xs">1102 Adams St., Toledo, OH 43604</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                            <a href="/terms-conditions">Terms</a>
                            <a href="/privacy-policy">Privacy</a>
                            <a href="/refund-policy">Refund</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
