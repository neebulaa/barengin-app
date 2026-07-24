import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import AccountPerformanceCard from "@/Components/AccountPerformanceCard";
import StatCard from "@/Components/StatCard";
import { useTranslation } from "@/lib/useTranslation";
import { formatRupiah as rupiah } from "@/lib/format";
import { FaSuitcase } from "react-icons/fa6";
import { FiUsers, FiCheckCircle, FiDollarSign } from "react-icons/fi";

export default function Analytics({ stats, rating }) {
    const { t } = useTranslation();
    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-700">{t("admin.trip.analytics_title")}</h1>
                <p className="text-neutral-500 text-sm">{t("admin.trip.analytics_subtitle")}</p>
            </div>
            <div className="space-y-6">
                <Head title="Analitik Trip" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<FaSuitcase />} label={t("admin.trip.stat_total_trips")} value={stats.total_trips} />
                    <StatCard icon={<FiCheckCircle />} label={t("admin.trip.stat_published")} value={stats.published} />
                    <StatCard icon={<FiUsers />} label={t("admin.trip.stat_participants")} value={stats.participants} />
                    <StatCard icon={<FiDollarSign />} label={t("admin.trip.stat_revenue")} value={rupiah(stats.revenue)} />
                </div>
                <AccountPerformanceCard rating={rating} />
            </div>
        </>
    );
}

Analytics.layout = (page) => (
    <AdminLayout title="Dasbor - Home">
        {page}
    </AdminLayout>
);
