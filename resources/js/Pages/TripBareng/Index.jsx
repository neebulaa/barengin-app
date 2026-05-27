import { useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import TripCard from "@/Components/TripCard";
import Container from "@/Components/Container";
import TripSearchForm from "@/Components/TripSearchForm";
import Pagination from "@/Components/Pagination";
import Select from "@/Components/Select";

import MainLayout from "@/Layouts/MainLayout";

export default function Index({ trips, all_trips }) {
    const { url } = usePage(); // supaya bisa ambil query param dari url inertia
    const [activeTab, setActiveTab] = useState("all");

    // Ambil query param `sort` dari URL agar dropdown tetap kepilih setelah refresh/back
    const getSortFromUrl = () => {
        try {
            const u = new URL(window.location.href);
            return u.searchParams.get("sort") || "";
        } catch {
            return "";
        }
    };

    const [sortBy, setSortBy] = useState(getSortFromUrl());

    const tripItems = trips?.data || [];

    const handleSortChange = (value) => {
        setSortBy(value);

        router.get(
            window.location.pathname,
            { sort: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePageChange = (newPage) => {
        router.get(
            window.location.pathname,
            { page: newPage, sort: sortBy },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Kalau user navigasi (back/forward) dan URL berubah, sync sortBy dari URL lagi
    useEffect(() => {
        setSortBy(getSortFromUrl());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

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

                    {/* Urutkan (1 dropdown saja) */}
                    <div className="flex items-center gap-3">
                        <Select
                            label=""
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="w-48"
                            selectClassName="h-10 bg-white"
                        >
                            <option value="">Urutkan</option>
                            <option value="rating_desc">Rating Tertinggi</option>
                            <option value="price_asc">Harga Termurah</option>
                            <option value="price_desc">Harga Termahal</option>
                            <option value="newest">Terbaru</option>
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
                        <p className="text-neutral-500 text-lg font-medium">
                            Belum ada trip yang tersedia saat ini.
                        </p>
                    </div>
                )}
            </Container>
        </div>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;