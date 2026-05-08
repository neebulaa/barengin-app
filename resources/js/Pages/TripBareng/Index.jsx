import { useState } from "react";
import TripCard from "@/Components/TripCard";
import Container from "@/Components/Container";
import TripSearchForm from "@/Components/TripSearchForm";
import Pagination from "@/Components/Pagination";

import MainLayout from "@/Layouts/MainLayout";

export default function Index({ trips, all_trips }) {
    const [activeTab, setActiveTab] = useState("all");
    const [page, setPage] = useState(1);

    return (
        <div className="min-h-screen bg-neutral-50 pb-16 md:pb-24">
            {/* --- Hero Section --- */}
            <header
                className="relative pt-28 pb-32 md:pt-40 md:pb-44 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('/assets/trip-bareng/hero-bg.png')",
                }}
            >
                <Container className="relative z-10 text-center text-white px-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                        Eksplor Tempat di Sekitar Anda
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg mb-0 max-w-2xl mx-auto font-normal text-neutral-200 leading-relaxed">
                        Ambil jeda dari stres kehidupan sehari-hari, rencanakan
                        perjalanan, dan jelajahi destinasi favoritmu bersama-sama.
                    </p>
                </Container>
            </header>

            {/* --- Search Form Section --- */}
            {/* z-10 dan relative penting agar form tidak tenggelam di belakang background hero */}
            <section className="relative z-10 -mt-16 md:-mt-20 px-4 sm:px-0">
                <Container>
                    <TripSearchForm
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </Container>
            </section>

            {/* --- List Section --- */}
            <Container className="mt-12 md:mt-16">
                
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                        Cari Trip Terbaikmu
                    </h2>
                    
                    {/* Filter dibikin full-width di HP, auto di desktop */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <select className="w-full sm:w-auto bg-white border border-neutral-300 text-neutral-700 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all cursor-pointer shadow-sm">
                            <option value="">Urutkan Berdasarkan</option>
                            <option value="rating">Rating Tertinggi</option>
                            <option value="price_asc">Harga Termurah</option>
                            <option value="price_desc">Harga Termahal</option>
                        </select>
                        <select className="w-full sm:w-auto bg-white border border-neutral-300 text-neutral-700 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all cursor-pointer shadow-sm">
                            <option value="">Filter Kategori</option>
                            <option value="popular">Paling Populer</option>
                            <option value="new">Trip Terbaru</option>
                        </select>
                    </div>
                </div>

                {/* Grid Trip Cards (Responsif: 1 kolom HP, 2 kolom Tablet, 3 kolom Desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {trips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                    ))}
                </div>

                {/* --- Pagination --- */}
                <div className="mt-12 md:mt-16 border-t border-neutral-200 pt-8">
                    <Pagination
                        currentPage={page}
                        totalPages={20}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
                
            </Container>
        </div>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;