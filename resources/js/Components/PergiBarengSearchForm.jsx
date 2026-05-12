import React from "react";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import {
    FaMapMarkerAlt,
    FaPlane,
    FaCalendarAlt,
    FaClock,
    FaUser,
    FaSearch,
} from "react-icons/fa";

export default function PergiSearchForm({ naked = true }) {
    return (
        <div
            className={`w-full ${naked ? "bg-white rounded-2xl shadow-lg p-6" : ""}`}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-16 gap-4 items-end animate-fade-in">
                <div className="lg:col-span-3">
                    <Input
                        label="Dari mana"
                        placeholder="Jln Sentul, Bogor Selatan"
                        leftIcon={<FaMapMarkerAlt />}
                    />
                </div>

                <div className="lg:col-span-3">
                    <Input
                        label="Ke mana"
                        placeholder="Bandar Soekarno Hatta"
                        leftIcon={<FaPlane />}
                    />
                </div>

                <div className="lg:col-span-3">
                    <Input
                        label="Tanggal Pergi"
                        placeholder="01/01/2026"
                        type = "date"
                    />
                </div>

                <div className="lg:col-span-3">
                    <Input
                        label="Waktu Kumpul"
                        placeholder="09:00"
                        type = "time"
                    />
                </div>

                <div className="lg:col-span-2">
                    <Input
                        label="Jumlah Orang"
                        type="number"
                        min={1}
                        placeholder="1"
                        leftIcon={<FaUser />}
                    />
                </div>

                <div className="lg:col-span-2">
                    <Button
                        type="primary"
                        rounded={true}
                        className="w-full h-12 flex items-center justify-center gap-2"
                    >
                        <FaSearch />
                        Cari
                    </Button>
                </div>
            </div>
        </div>
    );
}
