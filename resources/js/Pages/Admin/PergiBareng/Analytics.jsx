import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import AccountPerformanceCard from "@/Components/AccountPerformanceCard";
import EmptyState from "@/Components/EmptyState";
import StatCard from "@/Components/StatCard";
import { useTranslation } from "@/lib/useTranslation";
import { FaCar } from "react-icons/fa6";
import { FiUsers, FiTrendingUp, FiPercent, FiMap } from "react-icons/fi";

export default function Analytics({ stats, topRoutes = [], rating }) {
    const { t } = useTranslation();
    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-700">{t("admin.pergi.analytics_title")}</h1>
                <p className="text-neutral-500 text-sm">{t("admin.pergi.analytics_subtitle")}</p>
            </div>
            <div className="space-y-6">
                <Head title="Analitik Pergi Bareng" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<FaCar />} label={t("admin.pergi.analytics.stat_total")} value={stats.total_trips} />
                    <StatCard icon={<FiTrendingUp />} label={t("admin.pergi.analytics.stat_active")} value={stats.active_trips} />
                    <StatCard icon={<FiUsers />} label={t("admin.pergi.analytics.stat_participants")} value={stats.total_participants} />
                    <StatCard icon={<FiPercent />} label={t("admin.pergi.analytics.stat_fill_rate")} value={`${stats.fill_rate}%`} />
                </div>

                <AccountPerformanceCard rating={rating} />

                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-neutral-100">
                        <h3 className="font-bold text-neutral-700">{t("admin.pergi.analytics.top_routes_title")}</h3>
                        <p className="text-sm text-neutral-500">{t("admin.pergi.analytics.top_routes_desc")}</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                                <tr className="bg-neutral-100 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="py-3 px-5">{t("admin.pergi.analytics.col_name")}</th>
                                    <th className="py-3 px-5">{t("admin.pergi.analytics.col_route")}</th>
                                    <th className="py-3 px-5">{t("admin.pergi.analytics.col_transport")}</th>
                                    <th className="py-3 px-5">{t("admin.pergi.analytics.col_participants")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {topRoutes.length > 0 ? (
                                    topRoutes.map((r) => (
                                        <tr key={r.id} className="hover:bg-neutral-50/50 transition">
                                            <td className="py-3.5 px-5 text-sm font-semibold text-neutral-700">{r.name}</td>
                                            <td className="py-3.5 px-5 text-sm text-neutral-600">{r.route}</td>
                                            <td className="py-3.5 px-5 text-sm text-neutral-600">{r.transportation}</td>
                                            <td className="py-3.5 px-5 text-sm font-semibold text-primary-700">{r.joined}/{r.capacity}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">
                                            <EmptyState icon={<FiMap size={30} />} title={t("admin.pergi.analytics.empty_title")} description={t("admin.pergi.analytics.empty_desc")} />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Analytics.layout = (page) => (
    <AdminLayout title="Dasbor - Home">
        {page}
    </AdminLayout>
);
