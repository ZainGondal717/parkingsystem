'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, MapPin, Phone, Shield, Target, Users } from 'lucide-react';
import AboutUsMobile from '@/components/AboutUsMobile';

export default function AboutUs() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="flex-grow">
                {/* Mobile View */}
                <AboutUsMobile />

                {/* Desktop View */}
                <div className="hidden md:block">
                    {/* Hero Section */}
                    <section className="bg-blue-900 text-white py-20 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                        </div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="text-center">
                                <h1 className="text-5xl font-extrabold tracking-tight mb-6">About Us</h1>
                                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                                    Detroit Parking LLC is a premier parking services company dedicated to providing
                                    reliable and convenient parking solutions across Ohio.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Content Section */}
                    <section className="py-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                                        <Building2 className="w-8 h-8 mr-3 text-blue-900" />
                                        Our Story
                                    </h2>
                                    <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                                        <p>
                                            Detroit Parking LLC is a parking services company operating parking lots in Ohio.
                                            The company provides daily and monthly parking space rentals for vehicles at specific locations.
                                        </p>
                                        <p>
                                            We understand that finding safe, convenient, and affordable parking is essential for
                                            commuters, visitors, and residents alike. Our mission is to simplify the parking
                                            experience through technology and exceptional customer service.
                                        </p>
                                    </div>

                                    <div className="mt-10 grid grid-cols-2 gap-6">
                                        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
                                            <p className="text-3xl font-bold text-blue-900">24/7</p>
                                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Access</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
                                            <p className="text-3xl font-bold text-blue-900">Ohio</p>
                                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Based</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="bg-blue-900/5 absolute -inset-4 rounded-3xl -rotate-2"></div>
                                    <div className="bg-white p-8 rounded-2xl shadow-xl relative border border-gray-100">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Company Details</h3>
                                        <div className="space-y-6">
                                            <div className="flex items-start">
                                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                                    <Users className="w-6 h-6 text-blue-900" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Company Name</p>
                                                    <p className="text-gray-600">DETROIT PARKING LLC</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                                    <MapPin className="w-6 h-6 text-blue-900" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Registered Address</p>
                                                    <p className="text-gray-600">1102 Adams St., Toledo, OH 43604</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                                    <Phone className="w-6 h-6 text-blue-900" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Contact Number</p>
                                                    <p className="text-gray-600">513-879-5163</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Values Section */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
                                <div className="w-20 h-1 bg-blue-900 mx-auto mt-4 rounded-full"></div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-md transition-shadow">
                                    <Shield className="w-12 h-12 text-blue-900 mb-6" />
                                    <h3 className="text-xl font-bold mb-4">Secure Parking</h3>
                                    <p className="text-gray-600">Our locations are monitored and maintained to ensure the safety of your vehicle at all times.</p>
                                </div>
                                <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-md transition-shadow">
                                    <Target className="w-12 h-12 text-blue-900 mb-6" />
                                    <h3 className="text-xl font-bold mb-4">Prime Locations</h3>
                                    <p className="text-gray-600">We operate in strategic locations in Ohio to provide you with the most convenient parking spots.</p>
                                </div>
                                <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-md transition-shadow">
                                    <Users className="w-12 h-12 text-blue-900 mb-6" />
                                    <h3 className="text-xl font-bold mb-4">Customer First</h3>
                                    <p className="text-gray-600">Our dedicated support team is always ready to assist you with any questions or concerns.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Policies Section */}
                    <section className="py-16 bg-gray-50 border-t border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-500 uppercase tracking-widest">
                                <a href="/terms-conditions" className="hover:text-blue-900 transition-colors">Terms & Conditions</a>
                                <a href="/privacy-policy" className="hover:text-blue-900 transition-colors">Privacy Policy</a>
                                <a href="/refund-policy" className="hover:text-blue-900 transition-colors">Refund Policy</a>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
