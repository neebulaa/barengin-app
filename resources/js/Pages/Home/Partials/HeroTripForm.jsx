import React from "react";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import { FaPlaneDeparture, FaSearch } from "react-icons/fa";

export default function HeroTripForm() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end animate-fade-in">
            <div className="md:col-span-4">
                <Input
                    label="Tujuan"
                    placeholder="Jakarta"
                    leftIcon={<FaPlaneDeparture />}
                />
            </div>

            <div className="md:col-span-3">
                <Input label="Tanggal Mulai" type="date" />
            </div>

            <div className="md:col-span-3">
                <Input label="Tanggal Selesai" type="date" />
            </div>

            <div className="md:col-span-2">
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
    );
}
