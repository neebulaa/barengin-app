import React, { useMemo, useState } from "react";
import { FiArrowLeft, FiSearch, FiTarget } from "react-icons/fi";

export default function LocationSearchModal({
    open,
    onClose,
    onSelectLocation,
}) {
    const [q, setQ] = useState("");

    const items = useMemo(() => {
        const data = [
            { name: "Jakarta, Indonesia", meta: "100+ Post" },
            { name: "Plaza Indonesia", meta: "50+ Post" },
            { name: "Bandung, Indonesia", meta: "30+ Post" },
            { name: "Bali, Indonesia", meta: "200+ Post" },
        ];

        const qq = q.trim().toLowerCase();
        if (!qq) return data;
        return data.filter((x) => x.name.toLowerCase().includes(qq));
    }, [q]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-9 w-9 rounded-lg hover:bg-neutral-100 inline-flex items-center justify-center"
                            aria-label="Back"
                        >
                            <FiArrowLeft />
                        </button>

                        <div className="flex-1 text-center font-semibold">
                            Search Location
                        </div>

                        <div className="w-9" />
                    </div>

                    <div className="p-4">
                        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2">
                            <FiSearch className="text-neutral-500" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="w-full outline-none text-sm"
                                placeholder="Cari Lokasi..."
                            />
                            <button
                                type="button"
                                className="h-9 w-9 rounded-lg hover:bg-neutral-100 inline-flex items-center justify-center"
                                aria-label="Use current location"
                                onClick={() => {
                                    onSelectLocation?.("Current Location");
                                    onClose?.();
                                }}
                            >
                                <FiTarget />
                            </button>
                        </div>

                        <div className="mt-4 space-y-2">
                            {items.map((x) => (
                                <button
                                    key={x.name}
                                    type="button"
                                    onClick={() => {
                                        onSelectLocation?.(x.name);
                                        onClose?.();
                                    }}
                                    className="w-full text-left rounded-xl px-3 py-3 hover:bg-neutral-50 border border-neutral-100"
                                >
                                    <div className="font-medium text-sm text-neutral-900">
                                        {x.name}
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                        {x.meta}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}