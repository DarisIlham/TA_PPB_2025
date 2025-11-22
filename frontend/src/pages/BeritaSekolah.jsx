import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BeritaSekolah = () => {
    const navigate = useNavigate();
    const [beritas, setBeritas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Fetch all news
    const fetchBeritas = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/berita`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch news. Status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            setBeritas(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "An unexpected error occurred while fetching news.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBeritas();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Memuat data berita...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    // Featured article (first item)
    const featuredArticle = beritas.length > 0 ? beritas[0] : null;
    const regularArticles = beritas.length > 1 ? beritas.slice(1) : [];

    return (
        <div className="min-h-screen bg-white">
            {/* Header Navigation */}
           <Header/>

            {/* Hero Banner */}
            <section className="relative bg-gray-800 py-24">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/600?random=1')] bg-cover bg-center opacity-20"></div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white">
                        Berita
                    </h1>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                {/* Featured Article Section */}
                {featuredArticle && (
                    <section className="mb-16">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <div className="grid md:grid-cols-2 gap-0">
                                <div className="relative">
                                    <img
                                        src={featuredArticle.gambar_utama.startsWith('http') 
                                            ? featuredArticle.gambar_utama 
                                            : `data:image/jpeg;base64,${featuredArticle.gambar_utama}`}
                                        alt={featuredArticle.judul}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <h3 className="text-3xl font-bold text-gray-800 mb-6">
                                        {featuredArticle.judul}
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {featuredArticle.isi.substring(0, 200)}...
                                    </p>
                                    <button 
                                        onClick={() => navigate(`/berita/${featuredArticle.id_berita}`)}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-block w-fit"
                                    >
                                        Baca Selengkapnya
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Regular Articles Section */}
                <section className="mb-16">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Berita Lainnya</h2>
                        <span className="text-gray-600">
                            {regularArticles.length} berita
                        </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {regularArticles.map((berita) => (
                            <div
                                key={berita.id_berita}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer"
                                onClick={() => navigate(`/berita/${berita.id_berita}`)}
                            >
                                {berita.gambar_utama && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={berita.gambar_utama.startsWith('http') 
                                                ? berita.gambar_utama 
                                                : `data:image/jpeg;base64,${berita.gambar_utama}`}
                                            alt={berita.judul}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 mt-2">
                                        {berita.judul}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {berita.isi.substring(0, 120)}...
                                    </p>
                                    <div className="text-sm text-gray-500">
                                        {new Date(berita.tanggal_publikasi).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/berita/${berita.id_berita}`);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Baca Selengkapnya
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {beritas.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                Tidak ada berita tersedia saat ini.
                            </p>
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
           <Footer/>
        </div>
    );
};

export default BeritaSekolah;