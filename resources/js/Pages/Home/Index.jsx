import MainLayout from "@/Layouts/MainLayout";
import Button from "@/Components/Button";
import { GoHeart } from "react-icons/go";
import { useState } from "react";

export default function Home() {
    // --- Data Dummy untuk Mapping ---
    const popularTrips = [
        {
            id: 1,
            title: "Malang, Jawa Timur",
            duration: "3 Hari, 2 Malam",
            rating: "4,9",
            image: "/assets/hero-bg.jpg",
        },
        {
            id: 2,
            title: "Pati, Jawa Tengah",
            duration: "3 Hari, 2 Malam",
            rating: "4,9",
            image: "/assets/hero-bg.jpg",
        },
        {
            id: 3,
            title: "Bali",
            duration: "3 Hari, 2 Malam",
            rating: "4,9",
            image: "/assets/hero-bg.jpg",
        },
        {
            id: 4,
            title: "Pontianak, Kalbar",
            duration: "3 Hari, 2 Malam",
            rating: "4,8",
            image: "/assets/hero-bg.jpg",
        },
    ];

    const jastipProducts = [
        {
            id: 1,
            name: "Kacang Mente Rostcas",
            price: "Rp67.000",
            from: "Surabaya",
            to: "Bogor",
            author: "Edwin Hendly",
            rating: "4,9",
            tag: "Berlangsung hingga 3 Okt 2025",
            tagColor: "bg-blue-500",
            image: "/assets/hero-bg.jpg",
        },
        {
            id: 2,
            name: "Celana SONDOG 3/4 Betis",
            price: "Rp30.000",
            from: "Jakarta",
            to: "Bogor",
            author: "Edwin Hendly",
            rating: "4,9",
            tag: "Akan Buka 1 Okt 2025",
            tagColor: "bg-red-500",
            image: "/assets/hero-bg.jpg",
        },
        {
            id: 3,
            name: "Kacang Mente Rostcas",
            price: "Rp67.000",
            from: "Surabaya",
            to: "Bogor",
            author: "Edwin Hendly",
            rating: "4,9",
            tag: "Berlangsung hingga 3 Okt 2025",
            tagColor: "bg-blue-500",
            image: "/assets/hero-bg.jpg",
        },
        {
            id: 4,
            name: "Celana SONDOG 3/4 Betis",
            price: "Rp30.000",
            from: "Jakarta",
            to: "Bogor",
            author: "Edwin Hendly",
            rating: "4,9",
            tag: "Akan Buka 1 Okt 2025",
            tagColor: "bg-red-500",
            image: "/assets/hero-bg.jpg",
        },
    ];
    const [activeTab, setActiveTab] = useState("trip");

    return (
        <>
            {/* 1. Hero Section */}
            <header
                className="relative pt-24 pb-[26rem]  md:pt-40 md:pb-48 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/assets/hero-bg.jpg')",
                }}
            >
                <div className="container mx-auto px-6 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Eksplor Tempat disekitar Anda
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light">
                        Ambil jeda dari stres kehidupan sehari-hari, rencanakan
                        perjalanan, dan jelajahi destinasi favoritmu.
                    </p>
                </div>

                {/* Search Card (Floating) */}
                <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-[90%] lg:w-4/5 bg-white rounded-2xl shadow-xl p-6 z-10">
                    {/* Tab Navigation */}
                    <div className="flex space-x-8 border-b border-gray-200 mb-6 pb-0 text-sm font-medium">
                        <button
                            onClick={() => setActiveTab("trip")}
                            className={`pb-3 flex items-center gap-2 transition border-b-2 ${activeTab === "trip" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-blue-500"}`}
                        >
                            <i className="fa-solid fa-suitcase"></i> Trip Bareng
                        </button>
                        <button
                            onClick={() => setActiveTab("pergi")}
                            className={`pb-3 flex items-center gap-2 transition border-b-2 ${activeTab === "pergi" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-blue-500"}`}
                        >
                            <i className="fa-solid fa-user-group"></i> Pergi
                            Bareng
                        </button>
                        <button
                            onClick={() => setActiveTab("jastip")}
                            className={`pb-3 flex items-center gap-2 transition border-b-2 ${activeTab === "jastip" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-blue-500"}`}
                        >
                            <i className="fa-solid fa-cart-shopping"></i> Jastip
                        </button>
                    </div>

                    {/* 1. FORM TRIP BARENG (Default) */}
                    {activeTab === "trip" && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-fade-in">
                            <div className="col-span-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Tujuan
                                </label>
                                <div className="relative">
                                    <i className="fa-solid fa-plane-departure absolute left-3 top-3.5 text-gray-400"></i>
                                    <input
                                        type="text"
                                        placeholder="Jakarta"
                                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Tanggal Mulai
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600 text-sm"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Tanggal Selesai
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600 text-sm"
                                />
                            </div>
                            <div className="col-span-1">
                                <Button
                                    type="primary"
                                    className="w-full py-2 flex justify-center items-center gap-2 rounded-full"
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>{" "}
                                    Cari
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* 2. FORM PERGI BARENG */}
                    {activeTab === "pergi" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end animate-fade-in">
                            <div className="col-span-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Dari mana
                                </label>
                                <div className="relative">
                                    <i className="fa-solid fa-location-dot absolute left-3 top-3.5 text-gray-400"></i>
                                    <input
                                        type="text"
                                        placeholder="Jln Sentul, Bogor Selatan"
                                        className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Ke mana
                                </label>
                                <div className="relative">
                                    <i className="fa-solid fa-plane absolute left-3 top-3.5 text-gray-400"></i>
                                    <input
                                        type="text"
                                        placeholder="Bandar Soekarno Hatta"
                                        className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Tanggal Pergi
                                </label>
                                <div className="relative">
                                    <i className="fa-regular fa-calendar absolute left-3 top-3.5 text-gray-400"></i>
                                    <input
                                        type="text"
                                        placeholder="01/01/2026"
                                        className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm text-gray-500"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Waktu Kumpul
                                </label>
                                <div className="relative">
                                    <i className="fa-regular fa-clock absolute left-3 top-3.5 text-gray-400"></i>
                                    <input
                                        type="text"
                                        placeholder="09:00"
                                        className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm text-gray-500"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Jumlah Orang
                                </label>
                                <div className="relative">
                                    <i className="fa-regular fa-user absolute left-3 top-3.5 text-gray-400"></i>
                                    <input
                                        type="number"
                                        placeholder="1"
                                        min="1"
                                        className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm text-gray-500"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <Button
                                    type="primary"
                                    className="w-full py-2 flex justify-center items-center gap-2 rounded-full"
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>{" "}
                                    Cari
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* 3. FORM JASTIP */}
                    {activeTab === "jastip" && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-fade-in">
                            <div className="col-span-1 md:col-span-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Mau Jastip dari mana
                                </label>
                                <div className="relative">
                                    <i className="fa-solid fa-location-dot absolute left-3 top-3.5 text-gray-400"></i>
                                    <input
                                        type="text"
                                        placeholder="Jln Sentul, Bogor Selatan"
                                        className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Kategori Jastip
                                </label>
                                <div className="relative">
                                    {/* Class appearance-none menghilangkan panah bawaan browser, kita ganti pakai ikon FontAwesome */}
                                    <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm appearance-none bg-white text-gray-600">
                                        <option value="">
                                            Makanan dan Snack
                                        </option>
                                        <option value="fashion">Pakaian</option>
                                        <option value="elektronik">
                                            Elektronik
                                        </option>
                                    </select>
                                    <i className="fa-solid fa-chevron-down absolute right-3 top-3.5 text-gray-400 pointer-events-none text-xs"></i>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Status
                                </label>
                                <div className="relative">
                                    <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm appearance-none bg-white text-gray-600">
                                        <option value="ongoing">
                                            Sedang Berlangsung
                                        </option>
                                        <option value="outgoing">
                                            Sudah Tutup
                                        </option>
                                        <option value="upcoming">
                                            Akan Berlangsung
                                        </option>
                                    </select>
                                    <i className="fa-solid fa-chevron-down absolute right-3 top-3.5 text-gray-400 pointer-events-none text-xs"></i>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <Button
                                    type="primary"
                                    className="w-full py-2 flex justify-center items-center gap-2 rounded-full"
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>{" "}
                                    Cari
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Spacer untuk floating card */}
            <div className="h-32"></div>

            {/* 2. Tentang Kami */}
            <section className="container mx-auto px-6 py-12 md:py-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] w-12 bg-gray-300"></div>
                    <span className="text-sm font-semibold italic text-gray-800">
                        Tentang Kami
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold mb-8 leading-tight text-gray-800">
                    Kami merancang perjalanan di seluruh dunia{" "}
                    <span className="text-gray-400">
                        dengan memadukan destinasi ikonik dan hidden gems untuk
                        menghadirkan pengalaman yang autentik dan berkesan.
                    </span>
                </h2>

                <div className="relative rounded-2xl overflow-hidden h-[400px] mb-8">
                    <img
                        src="/assets/hero-bg.jpg"
                        alt="About"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-sm text-gray-600">
                    <p>
                        Tim kami terdiri dari para pecinta tempat, ahli lokal,
                        dan spesialis perjalanan yang berdedikasi untuk
                        menciptakan pengalaman yang unik dan bermakna.
                    </p>
                    <p>
                        Dari kota yang dinamis hingga alam dan pantai yang
                        menenangkan, kami sajikan pengalaman terbaik di setiap
                        perjalanan.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                    <div>
                        <h3 className="text-5xl font-light mb-2 text-gray-800">
                            90%
                        </h3>
                        <p className="text-sm text-gray-600">
                            wisatawan akan merekomendasikan kami kepada teman
                            dan keluarga.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-5xl font-light mb-2 text-gray-800">
                            100+
                        </h3>
                        <p className="text-sm text-gray-600">
                            rencana perjalanan unik dibuat untuk menampilkan
                            keindahan Indonesia.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-5xl font-light mb-2 text-gray-800">
                            4,9/5
                        </h3>
                        <p className="text-sm text-gray-600">
                            Rating rata-rata 4,9/5 dari ratusan pelanggan yang
                            puas.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Trip Popular */}
            <section className="container mx-auto px-6 py-12">
                <div className="flex items-center gap-4 mb-8 justify-center">
                    <div className="h-[1px] w-12 bg-gray-300"></div>
                    <span className="text-sm font-semibold italic text-gray-800">
                        Trip Popular
                    </span>
                    <div className="h-[1px] w-12 bg-gray-300"></div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-semibold mb-2 text-gray-800">
                            Perjalanan Melalui
                        </h2>
                        <h2 className="text-3xl font-semibold text-gray-400">
                            Destinasi Terbaik di Dunia
                        </h2>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                        <p className="text-sm text-gray-600 mb-4 max-w-xs ml-auto">
                            Jelajahi kota kosmopolitan dengan perpaduan budaya
                            dan kehidupan modern yang dinamis.
                        </p>
                        {/* Integrasi Komponen Button */}
                        <Button
                            type="primary"
                            className="px-6 py-2 rounded-full text-sm"
                        >
                            Eksplor Lebih Banyak
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {popularTrips.map((trip) => (
                        <div
                            key={trip.id}
                            className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer"
                        >
                            <img
                                src={trip.image}
                                alt={trip.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                <i className="fa-solid fa-star text-orange-400 text-[10px]"></i>{" "}
                                {trip.rating} rating
                            </div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-lg font-semibold">
                                    {trip.title}
                                </h3>
                                <p className="text-sm text-gray-300">
                                    {trip.duration}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Jasa Titip */}
            <section className="container mx-auto px-6 py-12">
                <div className="flex items-center gap-4 mb-8 justify-end">
                    <span className="text-sm font-semibold italic text-gray-800">
                        Jasa Titip Terbaru
                    </span>
                    <div className="h-[1px] w-12 bg-gray-300"></div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-semibold mb-2 text-gray-800">
                            Belanja produk incaranmu
                        </h2>
                        <h2 className="text-3xl font-semibold text-gray-400">
                            diseluruh tempat
                        </h2>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                        <p className="text-sm text-gray-600 mb-4 max-w-sm ml-auto">
                            Titip barang impian dari mana pun dengan mudah,
                            aman, dan praktis langsung sampai ke tangan Anda.
                        </p>
                        {/* Integrasi Komponen Button */}
                        <Button
                            type="primary"
                            className="px-6 py-2 rounded-full text-sm"
                        >
                            Eksplor Lebih Banyak
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {jastipProducts.map((product) => (
                        <div
                            key={product.id}
                            className="border rounded-xl overflow-hidden shadow-sm bg-white"
                        >
                            <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                                <span
                                    className={`absolute top-2 ${product.tag.includes("Buka") ? "right-2" : "left-2"} ${product.tagColor} text-white text-[10px] px-2 py-1 rounded`}
                                >
                                    {product.tag}
                                </span>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="object-cover h-full w-full"
                                />
                            </div>
                            <div className="p-4 text-gray-800">
                                <h4 className="font-medium text-sm mb-1">
                                    {product.name}
                                </h4>
                                <p className="font-bold mb-3">
                                    {product.price}
                                </p>
                                <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                    Dari {product.from} ke{" "}
                                    <strong>{product.to}</strong>
                                </div>
                                <div className="flex items-center justify-between border-t pt-3">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcepRNPYMHpVkXIrKDmVD5imvvt2XuLxrEpKXTwiDADfNWFqkUzNROcaF34ImdhJA4KR2k6j-dESkKAeUGJGUm3lGAAhVQQ6z3NRs-Wg&s=10"
                                            className="w-6 h-6 rounded-full"
                                            alt="User"
                                        />
                                        <span className="text-xs text-gray-600">
                                            Oleh {product.author}
                                        </span>
                                    </div>
                                    <div className="text-xs font-semibold flex items-center gap-1">
                                        <i className="fa-solid fa-star text-orange-400"></i>{" "}
                                        <GoHeart />
                                        {product.rating}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Gallery */}
            <section className="container mx-auto px-6 py-12 text-center border-t border-gray-100 mt-8 pt-16">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="h-[1px] w-12 bg-gray-300"></div>
                    <span className="text-sm font-semibold italic text-gray-800">
                        Gallery
                    </span>
                    <div className="h-[1px] w-12 bg-gray-300"></div>
                </div>
                <h2 className="text-3xl font-semibold mb-12 text-gray-800">
                    Temukan Bentang Alam,{" "}
                    <span className="text-gray-400">
                        Budaya, dan
                        <br /> Momen-Momen dalam Foto
                    </span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative">
                    <img
                        src="/assets/hero-bg.jpg"
                        className="rounded-xl w-full h-48 object-cover"
                        alt="Gallery"
                    />
                    <img
                        src="/assets/hero-bg.jpg"
                        className="rounded-xl w-full h-48 object-cover"
                        alt="Gallery"
                    />
                    <img
                        src="/assets/hero-bg.jpg"
                        className="rounded-xl w-full h-48 object-cover"
                        alt="Gallery"
                    />
                    <img
                        src="/assets/hero-bg.jpg"
                        className="rounded-xl w-full h-48 object-cover"
                        alt="Gallery"
                    />

                    <img
                        src="/assets/hero-bg.jpg"
                        className="rounded-xl w-full h-48 object-cover col-span-2"
                        alt="Gallery"
                    />
                    <img
                        src="/assets/hero-bg.jpg"
                        className="rounded-xl w-full h-48 object-cover"
                        alt="Gallery"
                    />
                    <img
                        src="/assets/hero-bg.jpg"
                        className="rounded-xl w-full h-48 object-cover"
                        alt="Gallery"
                    />

                    <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-gray-900 px-6 py-2 rounded-full font-medium shadow-lg text-sm hover:bg-gray-50 transition">
                        Lihat Lebih Banyak
                    </button>
                </div>
                <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                    Masuki dunia melalui galeri kurasi kami, yang mengabadikan
                    keindahan, budaya, dan momen tak terlupakan dari perjalanan
                    kami di seluruh negeri.
                </p>
            </section>

            {/* 6. Hubungi Kami */}
            <section className="container mx-auto px-6 py-16 border-t border-gray-100 mt-8 mb-8">
                <div className="flex items-center justify-end gap-4 mb-12">
                    <span className="text-sm font-semibold italic text-gray-800">
                        Hubungi Kami
                    </span>
                    <div className="h-[1px] w-12 bg-gray-300"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-semibold mb-2 text-gray-800">
                            Tuliskan saran{" "}
                            <span className="text-gray-400">maupun</span>
                        </h2>
                        <h2 className="text-3xl font-semibold text-gray-400 mb-6">
                            permintaan sekarang
                        </h2>
                        <p className="text-sm text-gray-600 mb-8">
                            Ada pertanyaan atau saran buat liburanmu? Yuk,
                            hubungi kami di sini dan mari buat perjalananmu
                            lebih seru bareng-bareng!
                        </p>

                        <form
                            className="space-y-4"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nama Lengkap Anda"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Kita akan kembali pada Anda disini"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    placeholder="Tuliskan bagaimana saran ataupun bantuan yang anda inginkan"
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none"
                                ></textarea>
                            </div>
                            {/* Integrasi Komponen Button */}
                            <Button
                                type="primary"
                                className="w-fit px-12 py-3 mt-2 rounded-lg"
                            >
                                Kirim Pesan
                            </Button>
                        </form>
                    </div>

                    <div>
                        <img
                            src="/assets/hero-bg.jpg"
                            alt="Contact"
                            className="w-full h-64 object-cover rounded-2xl mb-8"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium mb-2 text-gray-800">
                                    Kunjungi kami sekarang
                                </h4>
                                <p className="text-sm text-gray-600 flex items-start gap-2">
                                    <i className="fa-solid fa-location-dot mt-1 text-gray-400"></i>
                                    Jl. Pakuan No.3, Sumur Batu, Kec. Babakan
                                    Madang, Kabupaten Bogor, Jawa Barat 16810,
                                    Indonesia
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-gray-800">
                                    Bicara kepada kami
                                </h4>
                                <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                                    <i className="fa-solid fa-phone text-gray-400"></i>{" "}
                                    +628123123123
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <i className="fa-solid fa-envelope text-gray-400"></i>{" "}
                                    barenginapp@barengin.co.id
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Home.layout = (page) => <MainLayout children={page} />;
