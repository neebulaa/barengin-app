import React from "react";
import { FaSuitcaseRolling, FaUsers, FaShoppingCart } from "react-icons/fa";
import { useTranslation } from "@/lib/useTranslation";

export default function HeroTabs({ activeTab, setActiveTab }) {
    const { t } = useTranslation();
    const base =
        "pb-3 flex items-center gap-2 transition border-b-2 text-sm font-medium cursor-pointer";

    const tabClass = (key) =>
        [
            base,
            activeTab === key
                ? "text-primary-700 border-primary-700"
                : "text-neutral-500 border-transparent hover:text-primary-600",
        ].join(" ");

    return (
        <div className="flex flex-wrap gap-8 border-b border-neutral-200 mb-6 pb-0">
            <button
                type="button"
                onClick={() => setActiveTab("trip")}
                className={tabClass("trip")}
            >
                <FaSuitcaseRolling className="text-base" />
                {t("nav.trip_bareng")}
            </button>

            <button
                type="button"
                onClick={() => setActiveTab("pergi")}
                className={tabClass("pergi")}
            >
                <FaUsers className="text-base" />
                {t("nav.pergi_bareng")}
            </button>

            <button
                type="button"
                onClick={() => setActiveTab("jastip")}
                className={tabClass("jastip")}
            >
                <FaShoppingCart className="text-base" />
                {t("search.tab_jastip")}
            </button>
        </div>
    );
}
