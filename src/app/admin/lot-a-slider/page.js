"use client";
import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Trash2, Loader2, Image as ImageIcon, Plus, Eye, EyeOff } from "lucide-react";

export default function BookBannerAdmin() {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSliderVisible, setIsSliderVisible] = useState(true);
    const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch images
            const imgRes = await fetch("/api/admin/slider");
            const imgData = await imgRes.json();
            setImages(Array.isArray(imgData) ? imgData : []);

            // Fetch visibility setting
            const settingsRes = await fetch("/api/admin/settings");
            const settingsData = await settingsRes.json();
            const visibilitySetting = settingsData.find(s => s.key === "book_page_slider_visible");
            if (visibilitySetting) {
                setIsSliderVisible(visibilitySetting.value === "true");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSliderVisibility = async () => {
        setIsUpdatingVisibility(true);
        const newValue = !isSliderVisible;
        try {
            await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "book_page_slider_visible", value: String(newValue) }),
            });
            setIsSliderVisible(newValue);
        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdatingVisibility(false);
        }
    };

    const handleUploadSuccess = async (result) => {
        const { secure_url, public_id } = result.info;
        try {
            await fetch("/api/admin/slider", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: secure_url, publicId: public_id }),
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id, publicId) => {
        if (!confirm("Are you sure you want to delete this image?")) return;
        try {
            await fetch("/api/admin/slider", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, publicId }),
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Book Page Banner</h1>
                    <p className="text-gray-500 mt-1">Manage the image slider for the Book Parking page.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleSliderVisibility}
                        disabled={isUpdatingVisibility}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-md ${isSliderVisible
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                    >
                        {isUpdatingVisibility ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {isSliderVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                {isSliderVisible ? "Slider Visible" : "Slider Hidden"}
                            </>
                        )}
                    </button>

                    <CldUploadWidget
                        uploadPreset="ml_default"
                        onSuccess={handleUploadSuccess}
                        onError={(err) => {
                            console.error("Cloudinary Error Detailed:", err);
                            alert("Upload failed! Error: " + (err?.statusText || "Check Cloudinary Settings"));
                        }}
                    >
                        {({ open }) => (
                            <button
                                onClick={() => open()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add Image
                            </button>
                        )}
                    </CldUploadWidget>
                </div>
            </div>

            {!isSliderVisible && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-700 animate-pulse">
                    <EyeOff className="w-5 h-5" />
                    <p className="text-sm font-medium">The slider is currently hidden on the public "Book Parking" page.</p>
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-300">
                            <div className="relative aspect-video">
                                <img
                                    src={img.url}
                                    alt="Slider"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                                <button
                                    onClick={() => handleDelete(img.id, img.publicId)}
                                    className="absolute top-4 right-4 p-3 bg-red-600/80 hover:bg-red-700 text-white rounded-2xl transition-all hover:scale-110 shadow-lg backdrop-blur-sm z-10"
                                    title="Delete Image"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 flex items-center justify-between">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${img.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {img.isActive ? 'Ready' : 'Draft'}
                                </span>
                                <span className="text-xs font-semibold text-gray-400"># {img.order}</span>
                            </div>
                        </div>
                    ))}

                    {images.length === 0 && (
                        <div className="col-span-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] p-20 text-center">
                            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-gray-900">No images yet</h3>
                            <p className="text-gray-500 mt-2">Upload beautiful photos to showcase your parking lot.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
