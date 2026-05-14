import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import TripCard from "@/Components/TripCard";
import Container from "@/Components/Container";
import TripSearchForm from "@/Components/TripSearchForm";
import Pagination from "@/Components/Pagination";
import Select from "@/Components/Select"; // Import kembali komponen Select kustommu

import MainLayout from "@/Layouts/MainLayout";

export default function Index({ trips, all_trips }) {
    const [activeTab, setActiveTab] = useState("all");
    const [sortBy, setSortBy] = useState("");
    const [filterBy, setFilterBy] = useState("");

    const tripItems = trips?.data || [];

    const handlePageChange = (newPage) => {
        router.get(
            window.location.pathname, 
            { page: newPage },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-16 md:pb-24">
            <Head title="Trip Bareng - Barengin" />

            {/* --- Hero Section --- */}
            <header
                className="relative pt-28 pb-32 md:pt-40 md:pb-44 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('/assets/trips/hero.jpg')",
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
                    
                    {/* [PERBAIKAN]: Menggunakan komponen <Select> kustom seperti gambar */}
                    <div className="flex items-center gap-3">
                        <Select
                            label=""
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-40"
                            selectClassName="h-10 bg-white"
                        >
                            <option value="">Urutkan</option>
                            <option value="rating">Rating Tertinggi</option>
                            <option value="price_asc">Harga Termurah</option>
                            <option value="price_desc">Harga Termahal</option>
                        </Select>

                        <Select
                            label=""
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                            className="w-40"
                            selectClassName="h-10 bg-white"
                        >
                            <option value="">Filter By</option>
                            <option value="popular">Paling Populer</option>
                            <option value="new">Trip Terbaru</option>
                        </Select>
                    </div>
                </div>

                {tripItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {tripItems.map((trip) => (
                                <TripCard key={trip.id} trip={trip} />
                            ))}
                        </div>

                        {trips.last_page > 1 && (
                            <div className="mt-12 md:mt-16 border-t border-neutral-200 pt-8 flex justify-center">
                                <Pagination
                                    currentPage={trips.current_page} 
                                    totalPages={trips.last_page}     
                                    onPageChange={handlePageChange}  
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                        <p className="text-neutral-500 text-lg font-medium">Belum ada trip yang tersedia saat ini.</p>
                    </div>
                )}
                
            </Container>
        </div>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;