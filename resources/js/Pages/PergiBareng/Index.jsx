import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Container from "@/Components/Container";
import PergiBarengSearchForm from "@/Components/PergiBarengSearchForm";
import PergiBarengCard from "@/Components/PergiBarengCard";
import Select from "@/Components/Select";
import Pagination from "@/Components/Pagination";
import HeroSection from "@/Components/HeroSection";

export default function Index({ trips = [] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("newest");

    // Demo data - ganti dengan data dari backend
    const demoTrips = [
        {
            id: 1,
            image: "/assets/terminal-cibubur.jpg",
            title: "Terminal Cibubur",
            address: "Gang. Siliwangi No 5, Jakarta Timur",
            date: "31 Jan 26",
            time: "09:00",
            capacity: "15/20 Orang",
            remainingSeats: 5,
            user: {
                name: "Edwin Hendly",
                avatar: "/assets/default-avatar.png",
                rating: 4.9,
                reviews: 120,
                verified: true,
            },
            transportType: "Mobil Pribadi",
            transportIcon: "car",
            href: "/pergi-bareng/1",
        },
        {
            id: 2,
            image: "/assets/bandara-soetta.jpg",
            title: "Bandara Soekarno Hatta",
            address: "Jl. Insinyur Raden Massaid No.10",
            date: "31 Jan 26",
            time: "09:00",
            capacity: "15/20 Orang",
            remainingSeats: 5,
            user: {
                name: "Edwin Hendly",
                avatar: "/assets/default-avatar.png",
                rating: 4.9,
                reviews: 120,
                verified: true,
            },
            transportType: "Transportasi Online",
            transportIcon: "car",
            href: "/pergi-bareng/2",
        },
        {
            id: 3,
            image: "/assets/stasiun-bogor.jpg",
            title: "Stasiun Bogor",
            address: "Jl. Muara Kumbang No.12 Kec. Tambun",
            date: "31 Jan 26",
            time: "09:00",
            capacity: "15/20 Orang",
            remainingSeats: 5,
            user: {
                name: "Edwin Hendly",
                avatar: "/assets/default-avatar.png",
                rating: 4.9,
                reviews: 120,
                verified: true,
            },
            transportType: "Transportasi Umum",
            transportIcon: "train",
            href: "/pergi-bareng/3",
        },
        {
            id: 4,
            image: "/assets/stasiun-bgk.jpg",
            title: "Stasiun BGK",
            address: "Jl. Merdeka Jaya No. 22",
            date: "31 Jan 26",
            time: "09:00",
            capacity: "15/20 Orang",
            remainingSeats: 5,
            user: {
                name: "Edwin Hendly",
                avatar: "/assets/default-avatar.png",
                rating: 4.9,
                reviews: 120,
                verified: true,
            },
            transportType: "Transportasi Umum",
            transportIcon: "train",
            href: "/pergi-bareng/4",
        },
        {
            id: 5,
            image: "/assets/terminal-cibubur.jpg",
            title: "Terminal Cibubur",
            address: "Gang. Siliwangi No 5, Jakarta Timur",
            date: "31 Jan 26",
            time: "09:00",
            capacity: "15/20 Orang",
            remainingSeats: 5,
            user: {
                name: "Edwin Hendly",
                avatar: "/assets/default-avatar.png",
                rating: 4.9,
                reviews: 120,
                verified: true,
            },
            transportType: "Mobil Pribadi",
            transportIcon: "car",
            href: "/pergi-bareng/5",
        },
        {
            id: 6,
            image: "/assets/bandara-soetta.jpg",
            title: "Bandara Soekarno Hatta",
            address: "Jl. Insinyur Raden Massaid No.10",
            date: "31 Jan 26",
            time: "09:00",
            capacity: "15/20 Orang",
            remainingSeats: 5,
            user: {
                name: "Edwin Hendly",
                avatar: "/assets/default-avatar.png",
                rating: 4.9,
                reviews: 120,
                verified: true,
            },
            transportType: "Transportasi Online",
            transportIcon: "car",
            href: "/pergi-bareng/6",
        },
        {
            id: 7,
            image: "/assets/stasiun-bogor.jpg",
            title: "Stasiun Bogor",
            address: "Jl. Muara Kumbang No.12 Kec. Tambun",
            date: "31 Jan 26",
            time: "09:00",
            capacity: "15/20 Orang",
            remainingSeats: 5,
            user: {
                name: "Edwin Hendly",
                avatar: "/assets/default-avatar.png",
                rating: 4.9,
                reviews: 120,
                verified: true,
            },
            transportType: "Transportasi Umum",
            transportIcon: "train",
            href: "/pergi-bareng/7",
        },
        {
            id: 8,
            image: "/assets/stasiun-bgk.jpg",
            title: "Stasiun BGK",
            address: "Jl. Merdeka Jaya No. 22",
            date: "31 Jan 26",
            time: "09:00",
            capacity: "15/20 Orang",
            remainingSeats: 5,
            user: {
                name: "Edwin Hendly",
                avatar: "/assets/default-avatar.png",
                rating: 4.9,
                reviews: 120,
                verified: true,
            },
            transportType: "Transportasi Umum",
            transportIcon: "train",
            href: "/pergi-bareng/8",
        },
    ];

    const displayTrips = trips.length > 0 ? trips : demoTrips;

    return (
        <>
            <Head title="Pergi Bareng - Barengin" />

            {/* Hero Section */}
            <HeroSection />

            {/* Search Form - Overlapping Hero */}
            <div className="relative z-20 -mt-16 px-4">
                <Container>
                    <PergiBarengSearchForm naked={true} />
                </Container>
            </div>

            {/* Main Content */}
            <Container className="py-12">
                {/* Header & Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900">
                        Cari Teman Bareng Anda
                    </h2>

                    <div className="flex items-center gap-3">
                        <Select
                            label=""
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-40"
                            selectClassName="h-10"
                        >
                            <option value="newest">Terbaru</option>
                            <option value="rating">Rating Tertinggi</option>
                            <option value="seats">Sisa Kursi</option>
                            <option value="price">Harga Termurah</option>
                        </Select>

                        <Select
                            label=""
                            defaultValue="all"
                            className="w-40"
                            selectClassName="h-10"
                        >
                            <option value="all">Filter By</option>
                            <option value="car">Mobil Pribadi</option>
                            <option value="online">Transportasi Online</option>
                            <option value="public">Transportasi Umum</option>
                        </Select>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayTrips.map((trip) => (
                        <PergiBarengCard key={trip.id} data={trip} />
                    ))}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={10}
                    onPageChange={setCurrentPage}
                />
            </Container>
        </>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;