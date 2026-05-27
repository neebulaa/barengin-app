import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";

import Container from "@/Components/Container";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import MainLayout from "@/Layouts/MainLayout";

import { FaChevronLeft, FaUserFriends, FaMinus, FaPlus } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";

export default function Checkout({ trip }) {
    const [quantity, setQuantity] = useState(1);
    const [participants, setParticipants] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [snapReady, setSnapReady] = useState(false);

    // =========
    // 1) Load Midtrans Snap script
    // =========
    useEffect(() => {
        const existing = document.querySelector('script[src*="midtrans.com/snap/snap.js"]');
        if (existing) {
            setSnapReady(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        // GANTI dengan CLIENT KEY kamu
        script.setAttribute("data-client-key", "Mid-client-4rh5_t-r2jDJxAyN");

        script.onload = () => setSnapReady(true);
        script.onerror = () => setSnapReady(false);

        document.head.appendChild(script);

        return () => {
            // optional: kalau kamu tidak mau remove, boleh dihapus bagian ini
            document.head.removeChild(script);
        };
    }, []);

    // =========
    // 2) Dynamic participants form (sesuai quantity)
    // =========
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
        if (isProcessing) return;

        if (type === "minus" && quantity > 1) setQuantity((q) => q - 1);
        if (type === "plus" && quantity < trip.remaining_quota) setQuantity((q) => q + 1);
    };

    // =========
    // 3) Kalkulasi
    // =========
    const subtotal = useMemo(() => trip.price * quantity, [trip.price, quantity]);
    const serviceFee = useMemo(() => 5000 * quantity, [quantity]);
    const insuranceFee = useMemo(() => 5000 * quantity, [quantity]);
    const total = useMemo(() => subtotal + serviceFee + insuranceFee, [subtotal, serviceFee, insuranceFee]);

    // =========
    // 4) Pay with Midtrans Snap
    // =========
    const handlePayment = async () => {
        if (!snapReady || !window.snap) {
            alert("Midtrans Snap belum siap. Coba refresh halaman.");
            return;
        }

        if (quantity < 1) return;

        setIsProcessing(true);

        try {
            // Minta Snap Token ke Laravel
            const response = await axios.post(`/trip-bareng/${trip.id}/payment`, {
                quantity: quantity,
                // (opsional) kirim participants juga kalau backend mau simpan
                // participants: participants,
            });

            const { snap_token, transaction_id } = response.data || {};

            if (!snap_token || !transaction_id) {
                throw new Error("Response token tidak lengkap (snap_token/transaction_id kosong).");
            }

            window.snap.pay(snap_token, {
                onSuccess: function () {
                    // Redirect berdasar transaction_id (ini kunci agar quantity di success akurat)
                    router.visit(`/trip-bareng/${transaction_id}/success`);
                },
                onPending: function () {
                    // Pending itu normal untuk VA/QRIS/transfer
                    // Kamu bisa arahkan ke halaman waiting kalau mau, atau cukup stop loading:
                    setIsProcessing(false);
                },
                onError: function () {
                    alert("Pembayaran gagal. Silakan coba lagi.");
                    setIsProcessing(false);
                },
                onClose: function () {
                    // User menutup popup
                    setIsProcessing(false);
                },
            });
        } catch (error) {
            console.error("Gagal mendapatkan token", error);
            alert("Terjadi kesalahan sistem. Coba beberapa saat lagi.");
            setIsProcessing(false);
        }
    };

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
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Trip Summary & Quantity */}
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
                                        {trip.joined_count} / {trip.capacity} orang telah bergabung
                                    </div>
                                    <p className="text-primary-700 font-bold">
                                        Rp {Number(trip.price).toLocaleString("id-ID")}{" "}
                                        <span className="text-sm font-normal text-neutral-500">/orang</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6">
                                <div>
                                    <h4 className="font-bold text-neutral-900">Total partisipan</h4>
                                    <p className="text-sm text-neutral-500">
                                        Hanya tersisa {trip.remaining_quota} kuota lagi
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleQuantityChange("minus")}
                                        disabled={quantity <= 1 || isProcessing}
                                        className="w-8 h-8 rounded-full border-2 border-primary-100 text-primary-700 flex items-center justify-center hover:bg-primary-50 disabled:opacity-30 transition"
                                    >
                                        <FaMinus className="text-xs" />
                                    </button>

                                    <span className="font-bold text-lg w-4 text-center">{quantity}</span>

                                    <button
                                        onClick={() => handleQuantityChange("plus")}
                                        disabled={quantity >= trip.remaining_quota || isProcessing}
                                        className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center shadow-sm hover:bg-primary-800 disabled:opacity-50 transition"
                                    >
                                        <FaPlus className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Participant Forms */}
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
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            idx % 2 === 0 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        Person {idx + 1}
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap anda sesuai ktp" />
                                    <Input label="No. Paspor (optional)" placeholder="Nomor paspor resmi anda" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Input
                                            label="Nomor Telepon"
                                            placeholder="No Telpon"
                                            leftAddon={<span className="text-neutral-700 font-medium">+62</span>}
                                        />
                                        <Input label="NIK (Optional)" placeholder="NIK" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <MdOutlineShoppingBag className="text-xl text-neutral-800" />
                                <h3 className="text-lg font-bold text-neutral-900">Detail Pembayaran</h3>
                            </div>

                            <div className="space-y-4 text-sm text-neutral-600 border-b border-neutral-100 pb-6 mb-6">
                                <div className="flex justify-between items-center">
                                    <span>Subtotal ({quantity} orang)</span>
                                    <span className="font-semibold text-neutral-900">
                                        Rp {Number(subtotal).toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Biaya Layanan</span>
                                    <span className="font-semibold text-neutral-900">
                                        Rp {Number(serviceFee).toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Biaya Asuransi Trip</span>
                                    <span className="font-semibold text-neutral-900">
                                        Rp {Number(insuranceFee).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-neutral-900">Total Pembayaran</span>
                                <span className="text-lg font-bold text-neutral-900">
                                    Rp {Number(total).toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 mb-6">
                                <IoMdInformationCircleOutline className="text-orange-600 text-2xl shrink-0 mt-0.5" />
                                <p className="text-xs text-orange-800 leading-relaxed">
                                    Dengan menekan tombol 'Bayar Sekarang', Anda menyetujui Ketentuan Layanan dan Kebijakan
                                    Pembatalan kami. Pembayaran ditangani aman oleh Midtrans.
                                </p>
                            </div>

                            <Button
                                onClick={handlePayment}
                                disabled={isProcessing || !snapReady}
                                type="button"
                                size="md"
                                className="w-full font-bold flex justify-center py-3 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? "Memproses..." : "Bayar Sekarang"}
                            </Button>

                            {!snapReady && (
                                <p className="text-xs text-neutral-500 mt-3">
                                    Memuat pembayaran... (Jika lama, coba refresh)
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

Checkout.layout = (page) => <MainLayout children={page} />;