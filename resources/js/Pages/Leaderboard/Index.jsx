import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import { FaStar, FaSuitcase, FaBagShopping, FaTrophy } from "react-icons/fa6";
import { FaCrown } from "react-icons/fa";
import { useTranslation } from "@/lib/useTranslation";

const BOARDS = [
    { key: "purchase_trip", tab: "lb.tab_purchase_trip", metric: "lb.metric_purchase_trip", unit: "lb.unit_trip", rating: false, Icon: FaSuitcase },
    { key: "purchase_jastip", tab: "lb.tab_purchase_jastip", metric: "lb.metric_purchase_jastip", unit: "lb.unit_jastip", rating: false, Icon: FaBagShopping },
    { key: "best_guider", tab: "lb.tab_best_guider", metric: "lb.metric_created_trip", unit: "lb.unit_trip", rating: true, Icon: FaSuitcase },
    { key: "best_jastiper", tab: "lb.tab_best_jastiper", metric: "lb.metric_created_jastip", unit: "lb.unit_jastip", rating: true, Icon: FaBagShopping },
];

const PODIUM_STYLE = {
    1: { ring: "ring-yellow-400", badge: "bg-yellow-400 text-white", order: "order-2 md:-translate-y-5", size: "h-24 w-24" },
    2: { ring: "ring-neutral-300", badge: "bg-neutral-400 text-white", order: "order-1", size: "h-20 w-20" },
    3: { ring: "ring-amber-500", badge: "bg-amber-600 text-white", order: "order-3", size: "h-20 w-20" },
};

export default function Leaderboard({ boards = {} }) {
    const { t } = useTranslation();
    const [activeKey, setActiveKey] = useState("purchase_trip");

    const board = BOARDS.find((b) => b.key === activeKey);
    const rows = boards[activeKey] || [];
    const topThree = rows.slice(0, 3);
    const rest = rows.slice(3);
    const unit = t(board.unit);

    // Urutan podium: rank 2 (kiri), rank 1 (tengah), rank 3 (kanan)
    const podiumOrder = [topThree.find((r) => r.rank === 2), topThree.find((r) => r.rank === 1), topThree.find((r) => r.rank === 3)].filter(Boolean);

    const ProfileWrap = ({ user, className, children }) =>
        user.username ? (
            <Link href={`/forum/users/${user.username}`} className={className}>{children}</Link>
        ) : (
            <div className={className}>{children}</div>
        );

    return (
        <Container className="py-10">
            <Head title={t("nav.leaderboard")} />

            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-neutral-800 md:text-3xl">
                    <FaTrophy className="text-yellow-400" /> {t("nav.leaderboard")}
                </h1>
                <p className="mx-auto max-w-2xl text-sm text-neutral-500">{t("lb.subtitle")}</p>
            </div>

            {/* Tabs */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
                {BOARDS.map((b) => {
                    const active = activeKey === b.key;
                    return (
                        <button
                            key={b.key}
                            type="button"
                            onClick={() => setActiveKey(b.key)}
                            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                                active
                                    ? "border-primary-700 bg-primary-700 text-white shadow-sm"
                                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                            }`}
                        >
                            <b.Icon className="text-xs" />
                            {t(b.tab)}
                        </button>
                    );
                })}
            </div>

            {rows.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 py-20 text-center text-sm text-neutral-500">
                    {t("lb.empty")}
                </div>
            ) : (
                <>
                    {/* Podium top 3 */}
                    <div className="mb-8 flex items-end justify-center gap-4 md:gap-8">
                        {podiumOrder.map((u) => {
                            const s = PODIUM_STYLE[u.rank];
                            return (
                                <ProfileWrap
                                    key={u.id}
                                    user={u}
                                    className={`flex w-32 flex-col items-center rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition hover:shadow-md md:w-44 ${s.order}`}
                                >
                                    <div className="relative mb-3">
                                        {u.rank === 1 && (
                                            <FaCrown className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl text-yellow-400 drop-shadow" />
                                        )}
                                        <img
                                            src={u.avatar}
                                            alt={u.name}
                                            className={`rounded-full object-cover ring-4 ${s.ring} ${s.size}`}
                                            onError={(e) => { e.target.src = "/assets/default-profile.png"; }}
                                        />
                                        <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[11px] font-bold ${s.badge}`}>
                                            #{u.rank}
                                        </span>
                                    </div>
                                    <h3 className="line-clamp-1 text-center text-sm font-bold text-neutral-800">{u.name}</h3>
                                    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold text-neutral-600">
                                        <span className="flex items-center gap-1 text-primary-700">
                                            <board.Icon /> {u.count} {unit}
                                        </span>
                                        {board.rating && (
                                            <span className="flex items-center gap-1">
                                                <FaStar className="text-amber-400" /> {Number(u.rating).toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                </ProfileWrap>
                            );
                        })}
                    </div>

                    {/* Ranked list */}
                    {rest.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px] text-left">
                                    <thead>
                                        <tr className="bg-neutral-50 text-xs font-bold uppercase tracking-wider text-neutral-500">
                                            <th className="px-6 py-3">{t("lb.col_rank")}</th>
                                            <th className="px-6 py-3">{t("lb.col_user")}</th>
                                            <th className="px-6 py-3">{t(board.metric)}</th>
                                            {board.rating && <th className="px-6 py-3">{t("lb.col_rating")}</th>}
                                            <th className="px-6 py-3 text-right">{t("lb.col_action")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {rest.map((u) => (
                                            <tr key={u.id} className="transition hover:bg-neutral-50/60">
                                                <td className="px-6 py-3.5 text-sm font-semibold text-neutral-500">#{u.rank}</td>
                                                <td className="px-6 py-3.5">
                                                    <ProfileWrap user={u} className="flex items-center gap-3 group">
                                                        <img
                                                            src={u.avatar}
                                                            alt={u.name}
                                                            className="h-9 w-9 rounded-full border border-neutral-200 object-cover"
                                                            onError={(e) => { e.target.src = "/assets/default-profile.png"; }}
                                                        />
                                                        <span className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700">{u.name}</span>
                                                    </ProfileWrap>
                                                </td>
                                                <td className="px-6 py-3.5 text-sm text-neutral-600">{u.count} {unit}</td>
                                                {board.rating && (
                                                    <td className="px-6 py-3.5">
                                                        <span className="flex items-center gap-1 text-sm font-medium text-neutral-700">
                                                            <FaStar className="text-amber-400" /> {Number(u.rating).toFixed(1)}
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="px-6 py-3.5 text-right">
                                                    {u.username && (
                                                        <Button isButtonLink href={`/forum/users/${u.username}`} type="primary" variant="outline" size="xs" rounded={false} className="rounded-lg">
                                                            {t("lb.view_profile")}
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
}

Leaderboard.layout = (page) => <MainLayout>{page}</MainLayout>;
