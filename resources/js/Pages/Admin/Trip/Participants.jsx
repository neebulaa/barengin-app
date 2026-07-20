import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import EmptyState from "@/Components/EmptyState";
import { useTranslation } from "@/lib/useTranslation";
import { FiChevronLeft, FiChevronDown, FiUsers, FiUserX } from "react-icons/fi";

const rupiah = (n) =>
    "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(Number(n) || 0));

export default function Participants({ trip, participants = [] }) {
    const { t } = useTranslation();
    const [kickingId, setKickingId] = useState(null);
    // Baris peserta yang detail per-kursinya sedang dibuka.
    const [expanded, setExpanded] = useState(() => new Set());

    const toggleExpand = (userId) =>
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(userId) ? next.delete(userId) : next.add(userId);
            return next;
        });

    const kick = (p) => {
        const msg = t("admin.trip.kick_confirm")
            .replace(":name", p.name)
            .replace(":amount", new Intl.NumberFormat("id-ID").format(Math.round(p.total_paid || 0)));
        if (!window.confirm(msg)) return;

        setKickingId(p.user_id);
        router.delete(`/admin/trip/${trip.id}/participants/${p.user_id}`, {
            preserveScroll: true,
            onFinish: () => setKickingId(null),
        });
    };

    return (
        <>
            <Head title={`${t("admin.trip.participants_title")} - ${trip.name}`} />

            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/admin/trip"
                    className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                    <FiChevronLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-neutral-700">{t("admin.trip.participants_title")}</h1>
                    <p className="text-neutral-500 text-sm">{t("admin.trip.participants_subtitle")}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="p-5 border-b border-neutral-100 flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-neutral-700">{trip.name}</h2>
                        <p className="text-sm text-neutral-500">{trip.location}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-primary-700">
                            {trip.joined}/{trip.capacity} {t("admin.pergi.requests.seats_filled_suffix")}
                        </p>
                        <p className="text-xs text-neutral-400">
                            {t("admin.pergi.requests.remaining_prefix")} {trip.remaining} {t("admin.trip.seats_suffix")}
                        </p>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {participants.length === 0 ? (
                        <EmptyState
                            icon={<FiUsers size={30} />}
                            title={t("admin.trip.participants_empty_title")}
                            description={t("admin.trip.participants_empty_desc")}
                        />
                    ) : (
                        <div className="space-y-3">
                            {participants.map((p) => {
                                const isOpen = expanded.has(p.user_id);
                                const identity = (
                                    <>
                                        <img src={p.avatar} alt={p.name} className="w-11 h-11 rounded-full object-cover border border-neutral-200" onError={(e) => (e.target.src = "/assets/default-profile.png")} />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-neutral-700 text-sm truncate">{p.name}</p>
                                            <p className="text-xs text-neutral-500">
                                                {p.seats} {t("admin.trip.seats_suffix")} • {t("admin.trip.paid_label")} {rupiah(p.total_paid)}
                                            </p>
                                        </div>
                                    </>
                                );

                                return (
                                    <div
                                        key={p.user_id}
                                        className="border border-neutral-100 rounded-xl overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between gap-4 p-4 hover:bg-neutral-50/60 transition">
                                            {p.username ? (
                                                <Link href={`/forum/users/${p.username}`} className="flex items-center gap-3 min-w-0">
                                                    {identity}
                                                </Link>
                                            ) : (
                                                <div className="flex items-center gap-3 min-w-0">{identity}</div>
                                            )}
                                            <div className="flex items-center gap-2 shrink-0">
                                                {/* Buka rincian identitas tiap kursi yang dipesan peserta ini */}
                                                <button
                                                    onClick={() => toggleExpand(p.user_id)}
                                                    aria-expanded={isOpen}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 text-neutral-600 text-sm font-medium hover:bg-neutral-50 transition-colors"
                                                    title={t("admin.trip.seat_details")}
                                                >
                                                    <FiChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                                    <span className="hidden sm:inline">{p.seats} {t("admin.trip.seats_suffix")}</span>
                                                </button>
                                                <button
                                                    onClick={() => kick(p)}
                                                    disabled={kickingId === p.user_id}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                                                    title={t("admin.trip.kick")}
                                                >
                                                    <FiUserX size={16} /> <span className="hidden sm:inline">{t("admin.trip.kick")}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {isOpen && (
                                            <div className="border-t border-neutral-100 bg-neutral-50/50 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-3">
                                                    {t("admin.trip.seat_details")}
                                                </p>
                                                {p.seat_details?.length ? (
                                                    <ol className="space-y-2">
                                                        {p.seat_details.map((s, i) => (
                                                            <li
                                                                key={i}
                                                                className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-white border border-neutral-100 px-3 py-2 text-sm"
                                                            >
                                                                <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-full bg-primary-50 text-primary-700 text-xs font-bold">
                                                                    {t("admin.trip.seat")} {i + 1}
                                                                </span>
                                                                <span className="font-semibold text-neutral-700">{s.name}</span>
                                                                {s.phone && (
                                                                    <span className="text-neutral-500 text-xs">
                                                                        {t("trip.checkout.phone_label")}: +62{s.phone}
                                                                    </span>
                                                                )}
                                                                {s.nik && (
                                                                    <span className="text-neutral-500 text-xs">NIK: {s.nik}</span>
                                                                )}
                                                                {s.passport && (
                                                                    <span className="text-neutral-500 text-xs">
                                                                        {t("trip.checkout.passport")}: {s.passport}
                                                                    </span>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ol>
                                                ) : (
                                                    <p className="text-xs text-neutral-400 italic">
                                                        {t("admin.trip.seat_details_empty")}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Participants.layout = (page) => (
    <AdminLayout title="Dasbor - Home">
        {page}
    </AdminLayout>
);
