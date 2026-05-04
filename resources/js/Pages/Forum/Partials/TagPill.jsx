import React from "react";

export default function TagPill({ tag, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "inline-flex items-center gap-2",
                "rounded-lg bg-neutral-100 px-3 py-2",
                "text-sm font-medium text-neutral-800",
                "hover:bg-neutral-200 transition",
                "whitespace-nowrap cursor-pointer",
            ].join(" ")}
        >
            <span className="text-neutral-500">#</span>
            <span className="truncate">{tag}</span>
        </button>
    );
}
