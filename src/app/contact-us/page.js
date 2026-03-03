'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MapPin, Phone, Building, Send, Clock } from 'lucide-react';
import ContactUsMobile from '@/components/ContactUsMobile';

export default function ContactUs() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="flex-grow">
                {/* Mobile View */}
                <ContactUsMobile />

                {/* Desktop View */}
                <div className="hidden md:block">
                    {/* Header Section */}
                    <section className="bg-blue-900 text-white py-20 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute left-0 bottom-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                        </div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                            <h1 className="text-5xl font-extrabold tracking-tight mb-4">CONTACT US</h1>
                            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                                We're here to help you. Reach out to us for any questions regarding our
                                parking services.
                            </p>
                        </div>
                    </section>

                    {/* Contact info grid */}
                    <section className="py-16 -mt-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Phone */}
                                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center flex flex-col items-center">
                                    <div className="bg-blue-100 p-4 rounded-xl mb-6">
                                        <Phone className="w-8 h-8 text-blue-900" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
                                    <p className="text-gray-600 mb-4">Call us today for immediate assistance.</p>
                                    <a href="tel:513-879-5163" className="text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors">
                                        513-879-5163
                                    </a>
                                </div>

                                {/* Email */}
                                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center flex flex-col items-center">
                                    <div className="bg-blue-100 p-4 rounded-xl mb-6">
                                        <Mail className="w-8 h-8 text-blue-900" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                                    <p className="text-gray-600 mb-4">Send us an email and we'll respond within 24 hours.</p>
                                    <a href="mailto:detroitparkingllc@gmail.com" className="text-lg font-bold text-blue-900 hover:text-blue-700 transition-colors">
                                        detroitparkingllc@gmail.com
                                    </a>
                                </div>

                                {/* Address */}
                                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center flex flex-col items-center">
                                    <div className="bg-blue-100 p-4 rounded-xl mb-6">
                                        <MapPin className="w-8 h-8 text-blue-900" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Main Office</h3>
                                    <p className="text-gray-600 mb-4">Visit our headquarters in Ohio.</p>
                                    <p className="text-lg font-bold text-blue-900">
                                        1102 Adams St, <br />
                                        Toledo, OH 43604
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Form and info section */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid lg:grid-cols-2 gap-16">
                                {/* Form Side */}
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                                    <div className="w-16 h-1 bg-blue-900 mb-8 rounded-full"></div>

                                    <form className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Your name"
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                            <input
                                                type="text"
                                                placeholder="How can we help?"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                            <textarea
                                                rows={5}
                                                placeholder="Your message here..."
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all resize-none"
                                            ></textarea>
                                        </div>
                                        <button
                                            type="button"
                                            className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all flex items-center justify-center group"
                                        >
                                            Send Message
                                            <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </button>
                                    </form>
                                </div>

                                {/* Info Side */}
                                <div className="flex flex-col justify-center">
                                    <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-8">DETROIT PARKING LLC</h3>

                                        <div className="space-y-8">
                                            <div className="flex items-start">
                                                <Clock className="w-6 h-6 text-blue-900 mr-4 mt-1" />
                                                <div>
                                                    <p className="font-bold text-gray-900">Operating Hours</p>
                                                    <p className="text-gray-600">Daily: 24/7 Availability</p>
                                                    <p className="text-gray-600">Monthly: Available for rentals</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <Building className="w-6 h-6 text-blue-900 mr-4 mt-1" />
                                                <div>
                                                    <p className="font-bold text-gray-900">Office Location</p>
                                                    <p className="text-gray-600">1102 Adams St., Toledo, OH 43604</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <Phone className="w-6 h-6 text-blue-900 mr-4 mt-1" />
                                                <div>
                                                    <p className="font-bold text-gray-900">Telephone</p>
                                                    <p className="text-gray-600">513-879-5163</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-12 flex flex-wrap gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            <a href="/terms-conditions" className="hover:text-blue-900">Terms & Conditions</a>
                                            <span>•</span>
                                            <a href="/privacy-policy" className="hover:text-blue-900">Privacy Policy</a>
                                            <span>•</span>
                                            <a href="/refund-policy" className="hover:text-blue-900">Refund Policy</a>
                                        </div>
                                    </div>
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
