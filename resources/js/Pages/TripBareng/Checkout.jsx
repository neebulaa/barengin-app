import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import Container from "@/Components/Container";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import MainLayout from "@/Layouts/MainLayout";

import { FaChevronLeft, FaUserFriends, FaMinus, FaPlus } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BsCheckCircleFill } from "react-icons/bs";

export default function Checkout({ trip }) {
    const [quantity, setQuantity] = useState(2);
    const [paymentMethod, setPaymentMethod] = useState("bca_va");

    // Dynamic participants form state
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        setParticipants((prev) => {
            if (prev.length === quantity) return prev;
            if (prev.length < quantity) {
                return [
                    ...prev,
                    ...Array(quantity - prev.length).fill({
                        name: "",
                        passport: "",
                        phone: "",
                        nik: "",
                    }),
                ];
            }
            return prev.slice(0, quantity);
        });
    }, [quantity]);

    const handleQuantityChange = (type) => {
        if (type === "minus" && quantity > 1) setQuantity(quantity - 1);
        if (type === "plus" && quantity < trip.remaining_quota)
            setQuantity(quantity + 1);
    };

    // Calculations
    const subtotal = trip.price * quantity;
    const serviceFee = 5000;
    const insuranceFee = 5000;
    const total = subtotal + serviceFee + insuranceFee;

    // Mock Payment Methods
    const paymentMethods = [
        {
            id: "bca_va",
            label: "BCA Virtual Account",
            icon: (
                <div className="text-blue-700 font-bold italic text-lg">
                    BCA
                </div>
            ),
        },
        {
            id: "qris",
            label: "QRIS",
            icon: (
                <div className="text-red-600 font-bold text-lg tracking-tighter">
                    QRIS
                </div>
            ),
        },
        {
            id: "gopay",
            label: "Gopay",
            subLabel: "+62 89694636303",
            icon: (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                    G
                </div>
            ),
        },
        {
            id: "dana",
            label: "Dana",
            subLabel: "+62 89694636303",
            icon: (
                <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-xs">
                    D
                </div>
            ),
        },
        {
            id: "ovo",
            label: "Ovo",
            subLabel: "+62 89694636303",
            icon: (
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                    O
                </div>
            ),
        },
        {
            id: "mastercard",
            label: "Mastercard",
            subLabel: "1234 5678 9123 456",
            icon: (
                <div className="flex">
                    <div className="w-5 h-5 rounded-full bg-red-500 z-10 opacity-90"></div>
                    <div className="w-5 h-5 rounded-full bg-yellow-500 -ml-2 opacity-90"></div>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-6">
            <Head title="Checkout Trip - Barengin" />

            <Container>
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/trip-bareng/${trip.id}`}
                        className="inline-flex items-center text-2xl font-bold text-neutral-900 hover:text-primary-700 mb-2 gap-3 transition"
                    >
                        <FaChevronLeft className="text-xl" />
                        Checkout Trip
                    </Link>
                    <p className="text-neutral-500 ml-9">
                        Selesaikan pesanan Anda dengan aman dan cepat
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: Forms */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* 1. Trip Summary & Quantity Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                            <div className="flex gap-4 items-center pb-6 border-b border-neutral-100">
                                <img
                                    src={trip.image}
                                    alt={trip.title}
                                    className="w-20 h-20 rounded-xl object-cover border border-neutral-200"
                                    onError={(e) =>
                                        (e.target.src =
                                            "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=2071&auto=format&fit=crop")
                                    }
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-900 mb-1">
                                        {trip.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2 font-medium">
                                        <FaUserFriends className="text-neutral-400" />
                                        {trip.joined_count} / {trip.capacity}{" "}
                                        orang telah bergabung
                                    </div>
                                    <p className="text-primary-700 font-bold">
                                        Rp {trip.price.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6">
                                <div>
                                    <h4 className="font-bold text-neutral-900">
                                        Total partisipan
                                    </h4>
                                    <p className="text-sm text-neutral-500">
                                        Hanya tersisa {trip.remaining_quota}{" "}
                                        kuota lagi
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() =>
                                            handleQuantityChange("minus")
                                        }
                                        disabled={quantity <= 1}
                                        className="w-8 h-8 rounded-full border-2 border-primary-100 text-primary-700 flex items-center justify-center hover:bg-primary-50 disabled:opacity-30 transition"
                                    >
                                        <FaMinus className="text-xs" />
                                    </button>
                                    <span className="font-bold text-lg w-4 text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            handleQuantityChange("plus")
                                        }
                                        disabled={
                                            quantity >= trip.remaining_quota
                                        }
                                        className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center shadow-sm hover:bg-primary-800 disabled:opacity-50 transition"
                                    >
                                        <FaPlus className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. Participant Forms (Dynamic) */}
                        {participants.map((p, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 animate-fade-in"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-neutral-900">
                                        Info Partisipan {idx + 1}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${idx % 2 === 0 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                                    >
                                        Person {idx + 1}
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    <Input
                                        label="Nama Lengkap"
                                        placeholder="Masukkan nama lengkap anda sesuai ktp"
                                    />
                                    <Input
                                        label="No. Paspor (optional)"
                                        placeholder="Nomor paspor resmi anda"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Input
                                            label="Nomor Telepon"
                                            placeholder="No Telpon"
                                            leftAddon={
                                                <span className="text-neutral-700 font-medium">
                                                    +62
                                                </span>
                                            }
                                        />
                                        <Input
                                            label="NIK (Optional)"
                                            placeholder="NIK"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* 3. Payment Methods */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                            <h3 className="text-lg font-bold text-neutral-900 mb-6">
                                Metode Pembayaran
                            </h3>

                            <div className="space-y-3">
                                {paymentMethods.map((pm) => (
                                    <label
                                        key={pm.id}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === pm.id ? "border-primary-600 bg-primary-50/50" : "border-neutral-100 hover:border-primary-200"}`}
                                        onClick={() => setPaymentMethod(pm.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 flex justify-center">
                                                {pm.icon}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-neutral-900 text-sm">
                                                    {pm.label}
                                                </p>
                                                {pm.subLabel && (
                                                    <p className="text-xs text-neutral-500 mt-0.5">
                                                        {pm.subLabel}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Radio Circle */}
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === pm.id ? "border-primary-600" : "border-neutral-300"}`}
                                        >
                                            {paymentMethod === pm.id && (
                                                <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <MdOutlineShoppingBag className="text-xl text-neutral-800" />
                                <h3 className="text-lg font-bold text-neutral-900">
                                    Detail Pembayaran
                                </h3>
                            </div>

                            <div className="space-y-4 text-sm text-neutral-600 border-b border-neutral-100 pb-6 mb-6">
                                <div className="flex justify-between items-center">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-neutral-900">
                                        Rp {subtotal.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Biaya Layanan</span>
                                    <span className="font-semibold text-neutral-900">
                                        Rp {serviceFee.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Biaya Asuransi Trip</span>
                                    <span className="font-semibold text-neutral-900">
                                        Rp{" "}
                                        {insuranceFee.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-neutral-900">
                                    Total Pembayaran
                                </span>
                                <span className="text-lg font-bold text-neutral-900">
                                    Rp {total.toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 mb-6">
                                <IoMdInformationCircleOutline className="text-orange-600 text-2xl shrink-0 mt-0.5" />
                                <p className="text-xs text-orange-800 leading-relaxed">
                                    Dengan menekan tombol 'Bayar Sekarang', Anda
                                    menyetujui Ketentuan Layanan dan Kebijakan
                                    Pembatalan kami untuk perjalanan grup.
                                </p>
                            </div>

                            <Button
                                isButtonLink
                                href={`/trip-bareng/${trip.id}/payment`}
                                type="primary"
                                size="md"
                                className="w-full font-bold"
                            >
                                Bayar Sekarang
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

// Pasang MainLayout
Checkout.layout = (page) => <MainLayout children={page} />;
