import React from "react";
import { Head } from "@inertiajs/react";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import MainLayout from "@/Layouts/MainLayout";
import {
    FaMapMarkerAlt,
    FaRegCalendarAlt,
    FaRegClock,
    FaCarSide,
    FaBed,
    FaUtensils,
    FaArrowRight,
    FaRegHeart,
    FaFacebookF,
    FaLinkedinIn,
    FaYoutube,
    FaInstagram,
} from "react-icons/fa";
import { BsChatText } from "react-icons/bs";
import { IoMdInformationCircleOutline } from "react-icons/io";

export default function Detail({ trip }) {
    // Dummy fallback data disesuaikan dengan gambar referensi (8 Langkah dalam 2 Hari)
    const currentTrip = trip || {
        title: "Gunung Bromo",
        location: "Jawa Timur, Indonesia",
        duration: "4 Hari 3 Malam",
        joined_count: 15,
        capacity: 20,
        date_range: "1 Januari 2026 10:00 hingga 2 Januari 2026 16:00",
        description:
            "Gunung Bromo merupakan gunung berapi aktif setinggi 2.329 mdpl yang mempesona dengan kawah megah berdiameter 800 meter, dikelilingi oleh hamparan Lautan Pasir atau 'Pasir Berbisik' seluas 10 kilometer persegi yang unik karena suara desiran anginnya. Kontras dengan lanskap vulkaniknya, sisi selatan kawasan ini menyuguhkan pemandangan epik berupa Padang Savana dan Bukit Teletubbies yang bergelombang hijau, menciptakan perpaduan alam yang dramatis dalam satu kawasan kaldera.",
        price: 3800000,
        host: {
            name: "King's Man",
            role: "Expert Guide",
            badge: "50 trip",
            label: "Pemilik",
        },
        itinerary: [
            {
                step: 1,
                title: "Penjemputan & Perjalanan Menuju Bromo",
                time: "1 Januari 2026, Jam 10:00 - 18:00",
                desc: "Tim akan menjemput kamu di titik pertemuan (Bandara/Stasiun di Malang atau Surabaya). Perjalanan dilanjutkan menuju desa terakhir di kaki Gunung Bromo (Cemoro Lawang atau Wonokitri) (Kurang lebih 2 - 3 jam).",
                images: [
                    "https://images.unsplash.com/photo-1596825205469-80fb2228a4da?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1628189679198-4660ebcf8e51?q=80&w=600&auto=format&fit=crop",
                ],
            },
            {
                step: 2,
                title: "Check-in & Makan Malam Lokal",
                time: "1 Januari 2026, Jam 18:00 - 02:00",
                desc: "Tiba di penginapan Hotel Bawangan untuk proses administrasi dan istirahat sejenak sebelum petualangan dini hari dimulai.",
                images: [
                    "https://images.unsplash.com/photo-1551882547-ff40c0d124ba?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
                ],
            },
            {
                step: 3,
                title: "Midnight Jeep Adventure", // Diperbaiki dari typo gambar asli agar UI bagus
                time: "2 Januari 2026, Jam 02:00 - 05:00",
                desc: "Petualangan dimulai! Kamu akan dibangunkan tengah malam untuk memulai perjalanan menggunakan Jeep 4WD menembus kabut Bromo.",
                images: [
                    "https://images.unsplash.com/photo-1520641151610-c08170e3049b?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1506016766781-8153ad6c1eec?q=80&w=600&auto=format&fit=crop",
                ],
            },
            {
                step: 4,
                title: "The Magical Sunrise (Penanjakan)",
                time: "2 Januari 2026, Jam 05:00 - 07:00",
                desc: "Momen paling ikonik! Menunggu matahari terbit dari salah satu titik pandang tertinggi.\n• Spot: Penanjakan 1, Bukit Kedaluh (Kingkong Hill), atau Bukit Cinta.\n• Momen: Melihat gradasi warna langit dan siluet Gunung Bromo yang legendaris.\n• Fotografi: Sesi foto dengan latar belakang Sea of Sand dan Gunung Semeru yang mengeluarkan asap.",
                images: [
                    "https://images.unsplash.com/photo-1605336691456-11f81d8da0d2?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=600&auto=format&fit=crop",
                ],
            },
            {
                step: 5,
                title: "Pendakian Kawah Bromo & Pura Luhur Poten",
                time: "2 Januari 2026, Jam 07:00 - 09:00",
                desc: "Turun dari puncak menuju Lautan Pasir. Di sini kamu akan merasakan sensasi berdiri di tengah kaldera raksasa dengan menunggangi kuda.",
                images: [
                    "https://images.unsplash.com/photo-1544715568-7b98d27931c8?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1517529452835-f481c4e16d43?q=80&w=600&auto=format&fit=crop",
                ],
            },
            {
                step: 6,
                title: "Savana & Bukit Teletubbies",
                time: "2 Januari 2026, Jam 09:00 - 10:30",
                desc: "Beralih dari pemandangan gersang ke area hijau yang menyejukkan mata di balik kawah.",
                images: [
                    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop",
                ],
            },
            {
                step: 7,
                title: "Pasir Berbisik",
                time: "2 Januari 2026, Jam 10:30 - 12:00",
                desc: "Destinasi terakhir sebelum meninggalkan kawasan Taman Nasional, tempat di mana angin menciptakan suara unik saat menerpa butiran pasir.",
                images: [
                    "https://images.unsplash.com/photo-1547631317-062e7f33d59e?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop",
                ],
            },
            {
                step: 8,
                title: "Check-out & Perjalanan Pulang",
                time: "2 Januari 2026, Jam 12:00 - 16:00",
                desc: "Kembali ke penginapan untuk membersihkan diri dan mengisi energi sebelum perjalanan berakhir.",
                images: [], // Tidak ada gambar di step 8 pada desain
            },
        ],
    };

    return (
        <div className="min-h-screen bg-white pb-32">
            <Head title={`Trip ${currentTrip.title} - Barengin`} />

            <Container className="pt-6">
                {/* --- HERO SECTION --- */}
                <div className="relative h-[350px] md:h-[400px] w-full rounded-3xl overflow-hidden mb-10 shadow-sm">
                    <img
                        src="/assets/trips/hero.jpg"
                        alt={currentTrip.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src =
                                "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=2071&auto=format&fit=crop";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">
                            {currentTrip.title}
                        </h1>
                        <div className="flex items-center text-sm md:text-base text-neutral-200 mb-6 gap-2 font-medium">
                            <FaMapMarkerAlt />
                            <span>{currentTrip.location}</span>
                            <span className="mx-1">•</span>
                            <span>{currentTrip.duration}</span>
                        </div>

                        {/* Avatar Group & Confirmed Count */}
                        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md w-fit px-4 py-2.5 rounded-full border border-white/20">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        className="w-8 h-8 rounded-full border-2 border-transparent object-cover"
                                        alt="User"
                                    />
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-transparent bg-blue-100 text-primary-700 flex items-center justify-center text-xs font-bold z-10">
                                    +6
                                </div>
                            </div>
                            <div className="text-xs leading-tight">
                                <p className="font-semibold text-white">
                                    Wisatawan Terkonfirmasi
                                </p>
                                <p className="text-white/80 font-medium">
                                    {currentTrip.joined_count}/
                                    {currentTrip.capacity} telah bergabung
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT & SIDEBAR --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Itinerary & Desc */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Deskripsi */}
                        <section>
                            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                                Tentang Trip {currentTrip.title}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-neutral-700 font-medium mb-5 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                                <FaRegCalendarAlt className="text-neutral-500 text-lg" />
                                <span>
                                    Trip akan berlangsung dari{" "}
                                    <strong>{currentTrip.date_range}</strong>
                                </span>
                            </div>
                            <p className="text-neutral-600 leading-relaxed text-[15px] text-justify">
                                {currentTrip.description}
                            </p>
                        </section>

                        <hr className="border-neutral-200" />

                        {/* Itinerary Timeline */}
                        <section>
                            <div className="space-y-0 relative">
                                {currentTrip.itinerary.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-4 md:gap-6 relative group"
                                    >
                                        {/* Timeline Line & Dot */}
                                        <div className="flex flex-col items-center">
                                            {/* Logika: Semua nomor dimulai dengan warna netral, berubah jadi Biru hanya saat Hover */}
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 z-10 text-sm mt-1 transition-colors duration-300 bg-neutral-200 text-neutral-600 group-hover:bg-primary-600 group-hover:text-white">
                                                {item.step}
                                            </div>

                                            {/* Garis Vertikal */}
                                            {idx !==
                                                currentTrip.itinerary.length -
                                                    1 && (
                                                <div className="w-0.5 h-full bg-neutral-200 mt-2 mb-1 rounded-full group-hover:bg-primary-300 transition-colors duration-300"></div>
                                            )}
                                        </div>

                                        {/* Itinerary Content */}
                                        <div className="pb-10 w-full">
                                            {/* Opsional: Membuat judul ikut berubah warna saat di-hover */}
                                            <h3 className="text-[17px] font-bold text-neutral-900 mb-1.5 group-hover:text-primary-700 transition-colors">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3 font-medium">
                                                <FaRegClock />
                                                <span>{item.time}</span>
                                            </div>
                                            <p className="text-neutral-600 text-[15px] leading-relaxed mb-4 whitespace-pre-line">
                                                {item.desc}
                                            </p>

                                            {/* Itinerary Images */}
                                            {item.images &&
                                                item.images.length > 0 && (
                                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                                        {item.images.map(
                                                            (img, imgIdx) => (
                                                                <img
                                                                    key={imgIdx}
                                                                    src={img}
                                                                    alt={`Itinerary Step ${item.step}`}
                                                                    className="w-40 md:w-48 h-28 object-cover rounded-xl border border-neutral-200 shrink-0 hover:border-primary-400 transition-all"
                                                                    onError={(
                                                                        e,
                                                                    ) => {
                                                                        e.target.src =
                                                                            "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=2071&auto=format&fit=crop";
                                                                    }}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Map Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden relative h-48 flex items-center justify-center group cursor-pointer">
                            <img
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
                                alt="Map"
                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
                            <Button
                                variant="outline"
                                className="relative z-10 bg-white font-semibold gap-2 border-primary-600 text-primary-700 shadow-sm hover:bg-neutral-50"
                            >
                                <FaMapMarkerAlt /> Lihat dipeta
                            </Button>
                        </div>

                        {/* Host Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        currentTrip.host.avatar ||
                                        "https://i.pravatar.cc/150?u=kingsman"
                                    }
                                    className="w-12 h-12 rounded-full border border-neutral-200 object-cover"
                                    alt={currentTrip.host.name}
                                />
                                <div>
                                    <p className="text-[11px] text-neutral-500 font-medium mb-0.5">
                                        {currentTrip.host.label}
                                    </p>
                                    <h4 className="font-bold text-neutral-900 leading-tight mb-0.5">
                                        {currentTrip.host.name}
                                    </h4>
                                    <div className="text-xs font-medium">
                                        <span className="text-orange-500">
                                            {currentTrip.host.role}
                                        </span>
                                        <span className="text-neutral-400 mx-1">
                                            •
                                        </span>
                                        <span className="text-neutral-500">
                                            {currentTrip.host.badge}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors shadow-sm">
                                <BsChatText className="text-lg" />
                            </button>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                            <h3 className="text-[17px] font-bold text-neutral-900 mb-2">
                                Total Harga
                            </h3>
                            <div className="flex items-end gap-1 mb-6">
                                <span className="text-3xl font-bold text-primary-600">
                                    Rp{" "}
                                    {currentTrip.price.toLocaleString("id-ID")}
                                </span>
                                <span className="text-sm text-neutral-500 mb-1">
                                    / orang
                                </span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3 text-sm text-neutral-700 font-medium">
                                    <FaCarSide className="text-neutral-500 text-lg shrink-0" />
                                    Perjalanan bandara
                                </div>
                                <div className="flex items-center gap-3 text-sm text-neutral-700 font-medium">
                                    <FaBed className="text-neutral-500 text-lg shrink-0" />
                                    Hotel Bawangan
                                </div>
                                <div className="flex items-center gap-3 text-sm text-neutral-700 font-medium">
                                    <FaUtensils className="text-neutral-500 text-lg shrink-0" />
                                    Sarapan setiap hari dan makan malam
                                </div>
                            </div>

                            <div className="bg-orange-50 border border-orange-200/60 rounded-xl p-4 flex items-start gap-3">
                                <IoMdInformationCircleOutline className="text-orange-600 text-xl shrink-0 mt-0.5" />
                                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                                    Dapat dikembalikan sepenuhnya (refund) jika
                                    dibatalkan 7 hari sebelum keberangkatan.
                                    Tidak termasuk tiket pesawat.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* --- STICKY BOTTOM ACTION BAR --- */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-neutral-200 shadow-[0_-4px_15px_rgba(0,0,0,0.03)] z-[60]">
                <Container className="py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Kiri: Info Trip */}
                    <div className="hidden md:block">
                        <p className="text-sm text-neutral-500 mb-0.5 font-medium">
                            Pesan perjalanan anda sekarang
                        </p>
                        <h3 className="text-lg font-bold text-neutral-900">
                            Trip {currentTrip.title}
                        </h3>
                    </div>

                    {/* Kanan: Harga & Tombol */}
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-5 md:gap-8">
                        <div className="text-right">
                            <p className="text-[13px] text-neutral-500 mb-0.5 font-medium">
                                Mulai dari
                            </p>
                            <p className="text-xl font-bold text-neutral-900">
                                Rp {currentTrip.price.toLocaleString("id-ID")}{" "}
                                <span className="text-sm font-medium text-neutral-500">
                                    / orang
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                type="primary"
                                size="md"
                                className="px-6 md:px-8 font-semibold gap-2 shadow-sm rounded-xl"
                            >
                                Booking Sekarang{" "}
                                <FaArrowRight className="text-sm" />
                            </Button>
                            <button className="w-11 h-11 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-500 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-colors bg-white shrink-0">
                                <FaRegHeart className="text-[17px]" />
                            </button>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}

Detail.layout = (page) => <MainLayout children={page} />;
