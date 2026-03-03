'use client';

import { Building2, MapPin, Phone, Shield, Target, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function AboutUsMobile() {
    const values = [
        {
            icon: Shield,
            title: 'Secure Parking',
            description: 'Our locations are monitored and maintained to ensure the safety of your vehicle at all times.'
        },
        {
            icon: Target,
            title: 'Prime Locations',
            description: 'We operate in strategic locations in Ohio to provide you with the most convenient parking spots.'
        },
        {
            icon: Users,
            title: 'Customer First',
            description: 'Our dedicated support team is always ready to assist you with any questions or concerns.'
        }
    ];

    return (
        <div className="md:hidden">
            {/* Hero / Header Section */}
            <div className="bg-blue-900 text-white px-4 py-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-10 -top-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-4">About Us</h1>
                    <p className="text-blue-100 text-sm max-w-xs mx-auto">
                        Detroit Parking LLC is a premier parking services company dedicated to providing
                        reliable and convenient solutions across Ohio.
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <div className="px-4 py-8 bg-white">
                <div className="max-w-sm mx-auto">
                    <div className="relative group mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent rounded-2xl transform translate-y-2 translate-x-1 blur-lg"></div>
                        <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-blue-100 shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-600 p-2 rounded-lg shadow-md">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Our Story</h2>
                            </div>
                            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                                <p>
                                    Detroit Parking LLC is a parking services company operating parking lots in Ohio.
                                    The company provides daily and monthly parking space rentals for vehicles at specific locations.
                                </p>
                                <p>
                                    Our mission is to simplify the parking experience through technology and exceptional customer service.
                                </p>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                                    <p className="text-xl font-bold text-blue-900 leading-none">24/7</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Access</p>
                                </div>
                                <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                                    <p className="text-xl font-bold text-blue-900 leading-none">Ohio</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Based</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Details Card */}
                    <div className="relative group mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent rounded-2xl transform translate-y-2 translate-x-1 blur-lg"></div>
                        <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Company Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-2 rounded-lg">
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company Name</p>
                                        <p className="text-sm font-semibold text-gray-800">DETROIT PARKING LLC</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-2 rounded-lg">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registered Address</p>
                                        <p className="text-sm font-semibold text-gray-800">1102 Adams St., Toledo, OH 43604</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-2 rounded-lg">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Number</p>
                                        <a href="tel:513-879-5163" className="text-sm font-semibold text-blue-600">513-879-5163</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="px-4 py-8 bg-gray-50">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Why Choose Us?</h2>
                    <div className="w-12 h-1 bg-blue-900 mx-auto mt-2 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                    {values.map((v, i) => (
                        <div key={i} className="relative group transform-gpu active:scale-95 transition-all">
                            <div className="absolute inset-0 bg-black/5 rounded-2xl transform translate-y-1 blur-md"></div>
                            <div className="relative bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-sm">
                                <div className="bg-blue-50 p-3 rounded-xl flex-shrink-0">
                                    <v.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{v.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Policies / Legal Section */}
            <div className="px-4 py-12 bg-white">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <a href="/terms-conditions" className="hover:text-blue-900 transition-colors">Terms & Conditions</a>
                        <span className="text-gray-200">|</span>
                        <a href="/privacy-policy" className="hover:text-blue-900 transition-colors">Privacy Policy</a>
                        <span className="text-gray-200">|</span>
                        <a href="/refund-policy" className="hover:text-blue-900 transition-colors">Refund Policy</a>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-2xl text-center max-w-xs border border-blue-100">
                        <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs font-bold text-blue-900">Authorized Parking Provider</p>
                        <p className="text-[10px] text-blue-600 mt-1">Managing **** locations across Ohio</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
