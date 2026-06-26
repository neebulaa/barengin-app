import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { FiChevronLeft, FiCheck, FiX, FiInbox } from "react-icons/fi";

export default function Requests({ trip, requests = [] }) {
    const [busyId, setBusyId] = useState(null);

    const approve = (id) => {
        setBusyId(id);
        router.post(
            `/admin/pergi-bareng/${trip.id}/requests/${id}/approve`,
            {},
            { preserveScroll: true, onFinish: () => setBusyId(null) },
        );
    };

    const reject = (id) => {
        setBusyId(id);
        router.delete(`/admin/pergi-bareng/${trip.id}/requests/${id}`, {
            preserveScroll: true,
            onFinish: () => setBusyId(null),
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <Head title={`Permintaan - ${trip.name}`} />

            <div className="p-5 border-b border-neutral-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                    <p className="text-xs text-neutral-400 font-medium">{trip.code}</p>
                    <h2 className="text-lg font-bold text-neutral-700">{trip.name}</h2>
                    <p className="text-sm text-neutral-500">{trip.destination}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-primary-700">{trip.joined}/{trip.capacity} kursi terisi</p>
                    <p className="text-xs text-neutral-400">Sisa {trip.remaining} kursi</p>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                {requests.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center text-neutral-400">
                        <FiInbox size={40} className="mb-3" />
                        <p className="text-sm">Belum ada permintaan bergabung.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {requests.map((req) => {
                            const overQuota = req.quantity > trip.remaining;
                            return (
                                <div
                                    key={req.id}
                                    className="flex items-center justify-between gap-4 p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50/60 transition"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={req.user.avatar}
                                            alt={req.user.name}
                                            className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                                            onError={(e) => (e.target.src = "/assets/default-profile.png")}
                                        />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-neutral-700 text-sm truncate">{req.user.name}</p>
                                            <p className="text-xs text-neutral-500">
                                                Meminta <span className="font-semibold text-primary-700">{req.quantity} kursi</span>
                                                {req.requested_at ? ` • ${req.requested_at}` : ""}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {overQuota && (
                                            <span className="text-xs text-red-500 font-medium hidden sm:inline">Melebihi kuota</span>
                                        )}
                                        <button
                                            onClick={() => approve(req.id)}
                                            disabled={busyId === req.id || overQuota}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={overQuota ? "Kuota tidak cukup" : "Setujui"}
                                        >
                                            <FiCheck size={16} /> Setujui
                                        </button>
                                        <button
                                            onClick={() => reject(req.id)}
                                            disabled={busyId === req.id}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                                            title="Tolak"
                                        >
                                            <FiX size={16} /> Tolak
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

Requests.layout = (page) => (
    <AdminLayout title="Dasbor - Home" subtitle="Selamat datang!">
        <div className="mb-6 flex items-center gap-3">
            <Link
                href="/admin/pergi-bareng"
                className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
            >
                <FiChevronLeft size={18} />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-neutral-700">Permintaan Bergabung</h1>
                <p className="text-neutral-500 text-sm">Setujui atau tolak permintaan, lalu undang ke grup chat.</p>
            </div>
        </div>
        {page}
    </AdminLayout>
);
