import React from "react";
import { FiX } from "react-icons/fi";

export default function TagPill({ tag, onClick, fontSize="sm", onRemove, cursor }) {
    return (
        <div
            type="button"
            onClick={onClick}
            className={[
                "inline-flex items-center gap-2",
                "rounded-lg bg-neutral-100 px-2.5 py-1.5",
                `text-${fontSize} font-medium text-neutral-800`,
                `${onRemove ? '' : 'hover:bg-neutral-200 transition'}`,
                "whitespace-nowrap",
                cursor == 'pointer' && "cursor-pointer",
            ].join(" ")}
        >
            <span className="text-neutral-500">#</span>
            <span className="truncate">{tag}</span>
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-neutral-500 hover:text-red-500"
                >
                    <FiX />
                </button>
            )}
        </div>
    );
}
