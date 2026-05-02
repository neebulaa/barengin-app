import React from "react";
import Input from "@/Components/Input";
import Select from "@/Components/Select";
import Button from "@/Components/Button";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

export default function HeroJastipForm() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-13 gap-4 items-end animate-fade-in">
            <div className="md:col-span-5">
                <Input
                    label="Mau Jastip dari mana"
                    placeholder="Jln Sentul, Bogor Selatan"
                    leftIcon={<FaMapMarkerAlt />}
                />
            </div>

            <div className="md:col-span-3">
                <Select label="Kategori Jastip" defaultValue="">
                    <option value="">Makanan dan Snack</option>
                    <option value="fashion">Pakaian</option>
                    <option value="elektronik">Elektronik</option>
                </Select>
            </div>

            <div className="md:col-span-3">
                <Select label="Status" defaultValue="ongoing">
                    <option value="ongoing">Sedang Berlangsung</option>
                    <option value="outgoing">Sudah Tutup</option>
                    <option value="upcoming">Akan Berlangsung</option>
                </Select>
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
