import { FaHeart } from "react-icons/fa";
import { BsLightningFill } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { MdPeopleAlt } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { Link } from "@inertiajs/react";

import Button from "@/Components/Button";

export default function TripCard({ trip }) {
    const {
        title,
        location,
        date,
        capacity,
        remaining_seats, // Data baru dari Controller
        rating,
        price,
        guide,
        guide_avatar,    // Data baru dari Controller
        guide_badge,
        guide_rating,    // Data baru dari Controller
        guide_reviews,   // Data baru dari Controller
        image,
        liked,
    } = trip;

    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition">
            {/* --- Bagian Gambar --- */}
            <div className="relative">
                <img
                    src={image}
                    alt={title}
                    className="h-44 w-full object-cover"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=2071&auto=format&fit=crop"; }}
                />
                <button className="absolute right-3 top-3 bg-white/90 rounded-full p-2 shadow z-10 hover:scale-105 transition-transform">
                    <FaHeart
                        className={`h-5 w-5 ${liked ? "text-red-500" : "text-gray-400"}`}
                    />
                </button>
                
                {/* [PERBAIKAN 1]: SISA KURSI DINAMIS */}
                <div className="absolute left-3 bottom-3 bg-neutral-800/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium z-10">
                    <BsLightningFill className="text-yellow-400" />
                    <span>sisa {remaining_seats} kursi lagi</span>
                </div>
            </div>

            {/* --- Bagian Konten --- */}
            <div className="p-5">
                {/* Judul & Lokasi */}
                <div className="mb-4 space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{title}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                        <FaMapMarkerAlt className="text-primary-600" />
                        <p>{location}</p>
                    </div>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 divide-x divide-dashed divide-gray-300">
                    <div className="flex flex-col gap-1.5 pl-1">
                        <div className="flex items-center gap-1 text-neutral-500 font-medium">
                            <MdDateRange size={16} className="text-neutral-400" />
                            Tanggal Trip
                        </div>
                        <p className="text-neutral-800 font-semibold leading-tight pr-2">
                            {date}
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 pl-3">
                        <div className="flex items-center gap-1 text-neutral-500 font-medium">
                            <MdPeopleAlt size={16} className="text-primary-500" />
                            Kapasitas
                        </div>
                        <p className="text-neutral-800 font-semibold">
                            {capacity}
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 pl-3">
                        <div className="flex items-center gap-1 text-neutral-500 font-medium">
                            <FaStar size={14} className="text-yellow-400" />
                            Rating Trip
                        </div>
                        {/* [PERBAIKAN 2]: RATING TRIP DINAMIS */}
                        <p className="text-neutral-800 font-semibold">
                            {rating}
                        </p>
                    </div>
                </div>

                <hr className="border-t border-dashed border-gray-300 my-5" />

                {/* Info Pemandu */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200 overflow-hidden border border-neutral-200">
                            <img
                                src={guide_avatar}
                                alt={guide}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="min-w-0">
                            {/* [PERBAIKAN 3]: NAMA GUIDE TERPOTONG (TRUNCATE) */}
                            <div className="font-bold text-gray-900 flex items-center gap-1 text-sm">
                                <span className="truncate">{guide}</span>
                                <MdVerified className="text-blue-500 shrink-0 size-4" />
                            </div>
                            
                            <div className="text-orange-500 text-xs font-semibold mt-0.5">
                                {guide_badge}
                            </div>
                            
                            {/* [PERBAIKAN 4]: RATING GUIDER DITAMBAHKAN */}
                            <div className="flex items-center gap-1 mt-0.5 text-[11px] font-medium text-neutral-500">
                                <FaStar className="text-yellow-400 size-3" />
                                <span className="text-neutral-900 font-bold">{guide_rating}</span>
                                <span>({guide_reviews} ulasan)</span>
                            </div>
                        </div>
                    </div>
                    
                    <Button
                        size="xs"
                        variant="outline"
                        className="px-4 py-2.5 flex gap-1 items-center"
                    >
                        <BsChatDots size={14} /> Chat Pemandu
                    </Button>
                </div>

                <hr className="border-t border-dashed border-gray-300 my-5" />

                {/* Harga & Tombol Aksi */}
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">
                        Rp {price.toLocaleString("id-ID")}
                        <span className="text-sm font-medium text-gray-500 ml-1">
                            / orang
                        </span>
                    </div>
                    <Button size="sm" isButtonLink={true} href={`/trip-bareng/${trip.id}`} className="px-4 py-2">
                        Ikut Trip
                    </Button>
                    {/* <Link 
                        href={`/trip-bareng/${trip.id}`}
                        className="bg-[#0071C1] hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition-colors"
                        >
                        </Link> */}
                </div>
            </div>
        </div>
    );
}