"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageSlider from "@/components/ImageSlider";
import BookingForm from "@/components/BookingForm";
import { Loader2 } from "lucide-react";

export default function BookParkingPage() {
    const [images, setImages] = useState([]);
    const [lots, setLots] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const loadContent = async () => {
            try {
                // Fetch images
                const imgRes = await fetch("/api/admin/slider");
                const imgData = await imgRes.json();

                // Fetch lots for the booking form
                const lotsRes = await fetch("/api/admin/lots");
                const lotsData = await lotsRes.json();
                setLots(Array.isArray(lotsData) ? lotsData : []);

                // Fetch visibility settings
                const settingsRes = await fetch("/api/admin/settings");
                const settingsData = await settingsRes.json();

                const visibilitySetting = Array.isArray(settingsData) 
                    ? settingsData.find(s => s.key === "book_page_slider_visible")
                    : null;
                setIsVisible(visibilitySetting ? visibilitySetting.value === "true" : true);
                setImages(Array.isArray(imgData) ? imgData.filter(img => img.isActive) : []);
            } catch (err) {
                console.error("Failed to load page content:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="w-full">
                {isLoading ? (
                    <div className="w-full h-[600px] flex items-center justify-center bg-gray-50">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <>
                        {/* Banner Section */}
                        {isVisible && (
                            <section className="relative group w-full overflow-hidden">
                                <ImageSlider images={images} fullWidth={true} />
                                {images.length === 0 && (
                                    <div className="w-full h-[450px] bg-gray-100 flex items-center justify-center">
                                        <p className="text-gray-400 font-medium">Ready to welcome your cars...</p>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Booking Form Section */}
                        <div className={`bg-gray-50/50 ${!isVisible ? 'pt-4' : ''}`}>
                            <BookingForm lots={lots} />
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
