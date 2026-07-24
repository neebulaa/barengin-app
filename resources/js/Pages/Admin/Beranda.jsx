import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import TripCard from "@/Components/TripCard";
import PergiBarengCard from "@/Components/PergiBarengCard";
import JastipProductCard from "@/Components/JastipProductCard";
import Pagination from "@/Components/Pagination";
import StatCard from "@/Components/StatCard";
import { useTranslation } from "@/lib/useTranslation";
import { formatNumber } from "@/lib/format";
import { FiUsers, FiDownload, FiArrowRight } from "react-icons/fi";
import { FaSuitcase, FaCar } from "react-icons/fa6";
import { MdOutlineShoppingBag } from "react-icons/md";

const AVATAR_BG = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-red-100 text-red-600",
    "bg-purple-100 text-purple-600",
    "bg-orange-100 text-orange-600",
    "bg-pink-100 text-pink-600",
];

// Header seksi dengan judul + tautan "Lihat Semua" ke halaman publik terkait
function SectionHeader({ title, href, seeAllLabel }) {
    return (
        <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold text-neutral-700">{title}</h2>
            <Link
                href={href}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline whitespace-nowrap"
            >
                {seeAllLabel} <FiArrowRight size={15} />
            </Link>
        </div>
    );
}

export default function Beranda({ stats, latestTrips = [], latestPergi = [], popularJastip = [], logs }) {
    const { t } = useTranslation();
    const data = logs?.data ?? [];
    const currentPage = logs?.current_page ?? 1;
    const lastPage = logs?.last_page ?? 1;

    const goPage = (page) => {
        if (page < 1 || page > lastPage) return;
        router.get(window.location.pathname, { logs_page: page }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="space-y-6">
            <Head title="Beranda Admin" />

            <div>
                <h1 className="text-2xl font-bold text-neutral-700">{t("admin.home.title")}</h1>
                <p className="text-neutral-500 text-sm">
                    {t("admin.home.subtitle")}
                </p>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FiUsers />} label={t("admin.home.total_users")} value={formatNumber(stats.users)} />
                <StatCard icon={<FaSuitcase />} label={t("admin.home.total_trips")} value={formatNumber(stats.trips)} />
                <StatCard icon={<MdOutlineShoppingBag />} label={t("admin.home.total_jastip")} value={formatNumber(stats.jastip)} />
                <StatCard icon={<FaCar />} label={t("admin.home.total_pergi")} value={formatNumber(stats.pergi_bareng)} />
            </div>

            {/* Trip terbaru */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <SectionHeader
                    title={`${latestTrips.length} ${t("admin.home.latest_trips_suffix")}`}
                    href="/trip-bareng"
                    seeAllLabel={t("admin.home.see_all")}
                />
                {latestTrips.length > 0 ? (
                    <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-slim">
                        {latestTrips.map((trip) => (
                            <div key={trip.id} className="w-[340px] shrink-0">
                                <TripCard trip={trip} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-neutral-400 py-8 text-center">{t("admin.home.no_trips")}</p>
                )}
            </div>

            {/* Pergi bareng terbaru */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <SectionHeader
                    title={`${latestPergi.length} ${t("admin.home.latest_pergi_suffix")}`}
                    href="/pergi-bareng"
                    seeAllLabel={t("admin.home.see_all")}
                />
                {latestPergi.length > 0 ? (
                    <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-slim">
                        {latestPergi.map((trip) => (
                            <div key={trip.id} className="w-[360px] shrink-0">
                                <PergiBarengCard data={trip} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-neutral-400 py-8 text-center">{t("admin.home.no_pergi")}</p>
                )}
            </div>

            {/* Jastip terpopuler */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <SectionHeader
                    title={`${popularJastip.length} ${t("admin.home.popular_jastip_suffix")}`}
                    href="/jastip"
                    seeAllLabel={t("admin.home.see_all")}
                />
                {popularJastip.length > 0 ? (
                    <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-slim">
                        {popularJastip.map((item) => (
                            <Link key={item.id} href={`/jastip/${item.id}`} className="w-[280px] shrink-0">
                                <JastipProductCard item={item} />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-neutral-400 py-8 text-center">{t("admin.home.no_jastip")}</p>
                )}
            </div>

            {/* Log kegiatan */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                    <h2 className="text-lg font-semibold text-neutral-700">{t("admin.home.activity_log")}</h2>
                    <a
                        href="/admin/logs/export"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                    >
                        <FiDownload size={15} /> {t("admin.home.export_log")}
                    </a>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[720px]">
                        <thead>
                            <tr className="bg-neutral-100 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                                <th className="py-3 px-5">{t("admin.home.col_time")}</th>
                                <th className="py-3 px-5">{t("admin.home.col_actor")}</th>
                                <th className="py-3 px-5">{t("admin.home.col_action")}</th>
                                <th className="py-3 px-5">{t("admin.home.col_ip")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {data.length > 0 ? (
                                data.map((log) => (
                                    <tr key={log.id} className="hover:bg-neutral-50/50 transition">
                                        <td className="py-3.5 px-5 text-sm text-neutral-600 whitespace-nowrap">{log.time}</td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-2.5">
                                                {log.avatar ? (
                                                    <img src={log.avatar} alt={log.actor} className="w-7 h-7 rounded-full object-cover" />
                                                ) : (
                                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${AVATAR_BG[log.id % AVATAR_BG.length]}`}>
                                                        {log.initials}
                                                    </span>
                                                )}
                                                <span className="text-sm font-semibold text-neutral-700">{log.actor}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-sm text-neutral-600">{log.action}</td>
                                        <td className="py-3.5 px-5 text-sm text-neutral-400">{log.ip}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-neutral-500 text-sm">{t("admin.home.no_logs")}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-neutral-50 p-4 border-t border-neutral-100">
                    <span className="text-xs text-neutral-500 font-medium">
                        {t("common.showing")} {logs?.from ?? 0}–{logs?.to ?? 0} {t("common.of")} {logs?.total ?? 0} {t("common.data")}
                    </span>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={lastPage}
                        onPageChange={goPage}
                    />
                </div>
            </div>
        </div>
    );
}

Beranda.layout = (page) => (
    <AdminLayout title="Dasbor - Admin">
        {page}
    </AdminLayout>
);
