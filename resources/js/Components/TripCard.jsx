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
        rating,
        reviews,
        price,
        guide,
        guide_badge,
        image,
        liked,
    } = trip;

    return (
        
        <Link href={`/trip-bareng/${trip.id}`} >
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition">
                {/* --- Bagian Gambar --- */}
                <div className="relative">
                    <img
                        src={image}
                    alt={title}
                    className="h-44 w-full object-cover"
                />
                <button className="absolute right-3 top-3 bg-white/90 rounded-full p-2 shadow">
                    <FaHeart
                        className={`h-5 w-5 ${liked ? "text-red-500" : "text-gray-500"}`}
                    />
                </button>
                <div className="absolute left-3 bottom-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <BsLightningFill className="text-yellow-400" />
                    <span>sisa 5 kursi lagi</span>
                </div>
            </div>

            {/* --- Bagian Konten --- */}
            <div className="p-5">
                {/* Judul & Lokasi */}
                <div className="mb-4 space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-blue-600" />
                        <p>{location}</p>
                    </div>
                </div>

                {/* Grid Info (Ditambah Pembatas Vertikal: divide-x & divide-dashed) */}
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 divide-x divide-dashed divide-gray-300">
                    <div className="flex gap-1.5">
                        <MdDateRange
                            size={16}
                            className="text-gray-500 shrink-0"
                        />
                        <div className="space-y-0.5">
                            <p className="text-neutral-500">Tanggal Trip</p>
                            <p className="text-neutral-800 font-medium">
                                {date}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1.5">
                        <MdPeopleAlt
                            size={16}
                            className="text-blue-500 shrink-0"
                        />
                        <div className="space-y-0.5">
                            <p className="text-neutral-500">Kapasitas</p>
                            <p className="text-neutral-800 font-medium">
                                {capacity}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1.5">
                        <FaStar
                            size={16}
                            className="text-yellow-500 shrink-0"
                        />
                        <div className="space-y-0.5">
                            <p className="text-neutral-500">Rating Trip</p>
                            <p className="text-neutral-800 font-medium">
                                {rating}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Garis Pembatas Horizontal 1 */}
                <hr className="border-t border-dashed border-gray-300 my-5" />

                {/* Info Pemandu */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                            {/* Hapus tag img ini jika tidak pakai foto asli, biarkan div bg-gray-200 sebagai placeholder */}
                            <img
                                src="https://i.pravatar.cc/150?u=kingsman"
                                alt="Guide"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="text-sm">
                            <div className="font-bold text-gray-900 flex items-center gap-1">
                                {guide}{" "}
                                <MdVerified className="text-blue-500 size-4" />
                            </div>
                            <div className="text-orange-500 text-xs font-medium">
                                {guide_badge}
                            </div>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-600 font-medium rounded-lg flex items-center gap-2"
                    >
                        <BsChatDots className="size-4" /> Chat Pemandu
                    </Button>
                </div>

                {/* Garis Pembatas Horizontal 2 */}
                <hr className="border-t border-dashed border-gray-300 my-5" />

                {/* Harga & Tombol Aksi */}
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">
                        Rp {price.toLocaleString("id-ID")}{" "}
                        <span className="text-sm font-normal text-gray-500">
                            / orang
                        </span>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2">
                        Ikut Trip
                    </Button>
                </div>
            </div>
        </div>
        </Link>
    );

}
