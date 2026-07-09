import { router } from "@inertiajs/react";
import { FaMapMarkerAlt, FaRegCalendarAlt, FaRoute, FaCarSide, FaCheck, FaStar, FaShoppingBag, FaUsers } from "react-icons/fa";
import Button from "@/Components/Button";
import { useTranslation } from "@/lib/useTranslation";

// Label & warna badge status (jalan bareng + jastip). #4
const STATUS_META = {
    waiting:      { key: "ph.status_waiting", cls: "bg-amber-100 text-amber-700" },
    ongoing:      { key: "ph.status_ongoing", cls: "bg-blue-100 text-primary-700" },
    finish:       { key: "ph.status_finish", cls: "bg-success-50 text-success-700" },
    order:        { key: "ph.status_order", cls: "bg-amber-100 text-amber-700" },
    buying:       { key: "ph.status_buying", cls: "bg-blue-100 text-primary-700" },
    ready_pickup: { key: "ph.status_ready", cls: "bg-success-50 text-success-700" },
    closed:       { key: "ph.status_closed", cls: "bg-neutral-100 text-neutral-600" },
};

/**
 * Kartu horizontal riwayat (Trip Bareng / Pergi Bareng / Jastip)
 * dengan badge status, tombol chat grup, dan "Beri Ulasan".
 */
export default function JalanBarengCard({ item, onReview }) {
    const { t } = useTranslation();
    const {
        type,
        type_label,
        title,
        subtitle,
        image,
        date_label,
        user,
        reviewed,
        review_target,
        status,
        can_review,
        group_chat_url,
    } = item;

    const isTrip = type === "trip";
    const isJastip = type === "jastip";
    const TypeIcon = isTrip ? FaRoute : isJastip ? FaShoppingBag : FaCarSide;
    const badgeColor = isTrip ? "bg-primary-700" : isJastip ? "bg-warning-600" : "bg-success-600";
    const statusMeta = STATUS_META[status];
    const reviewable = can_review ?? true; // fallback: kartu lama tanpa status tetap bisa diulas

    const openGroupChat = () => {
        if (group_chat_url) router.post(group_chat_url);
    };

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-3 sm:flex-row sm:items-center">
            {/* Gambar */}
            <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-32">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        e.target.src = "/assets/default-image.png";
                    }}
                />
                <span
                    className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${badgeColor}`}
                >
                    <TypeIcon className="h-2.5 w-2.5" />
                    {type_label}
                </span>
            </div>

            {/* Konten */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-bold text-neutral-900">
                        {title}
                    </h3>
                    {statusMeta && (
                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusMeta.cls}`}>
                            {t(statusMeta.key)}
                        </span>
                    )}
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                    <FaMapMarkerAlt className="h-3.5 w-3.5 shrink-0 text-primary-600" />
                    <span className="truncate">{subtitle}</span>
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                    <FaRegCalendarAlt className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                    <span className="truncate">{date_label}</span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-6 w-6 rounded-full object-cover border border-neutral-200"
                        onError={(e) => {
                            e.target.src = "/assets/default-profile.png";
                        }}
                    />
                    <span className="truncate text-xs font-medium text-neutral-600">
                        {user.name}
                    </span>
                </div>
            </div>

            {/* Aksi */}
            <div className="flex shrink-0 items-center gap-2 sm:self-center">
                {group_chat_url && (
                    <button
                        type="button"
                        onClick={openGroupChat}
                        title={t("ph.group_chat")}
                        aria-label={t("ph.group_chat")}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 transition hover:bg-neutral-100"
                    >
                        <FaUsers className="h-4 w-4" />
                    </button>
                )}
                {reviewed ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-success-50 px-4 py-2 text-sm font-semibold text-success-700">
                        <FaCheck className="h-3.5 w-3.5" />
                        {t("ph.reviewed")}
                    </span>
                ) : reviewable && review_target ? (
                    <Button
                        type="primary"
                        variant="solid"
                        size="sm"
                        rounded={false}
                        className="gap-2 rounded-lg"
                        onClick={() => onReview(review_target)}
                    >
                        <FaStar className="h-3.5 w-3.5" />
                        {t("ph.give_review")}
                    </Button>
                ) : null}
            </div>
        </div>
    );
}
