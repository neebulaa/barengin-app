import React from "react";
import { FiTrendingUp } from "react-icons/fi";

export default function ResponseSortBar({
    sort = "popular", // popular | newest
    onChangeSort,
    responseCount = 0,
}) {
    return (
        <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-3">
            <button
                type="button"
                onClick={() =>
                    onChangeSort?.(sort === "popular" ? "newest" : "popular")
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition"
            >
                <FiTrendingUp className="text-base" />
                {sort === "popular" ? "Populer" : "Terbaru"}
            </button>

            <span className="text-sm font-semibold text-neutral-700">
                {responseCount} Balasan
            </span>
        </div>
    );
}
