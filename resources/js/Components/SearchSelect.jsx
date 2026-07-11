import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

/**
 * Select + search (combobox) berbasis daftar opsi statis.
 * - options: array string.
 * - allowCustom: izinkan nilai bebas di luar daftar (mis. provinsi tanpa data kota).
 * Menampilkan `value` apa adanya walau tidak ada di options (agar data lama tetap tampil).
 */
export default function SearchSelect({
    label,
    value = "",
    onChange,
    options = [],
    placeholder = "Pilih...",
    searchPlaceholder = "Cari...",
    disabled = false,
    disabledText,
    allowCustom = false,
    emptyText = "Tidak ada pilihan",
    size = "sm",
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapRef = useRef(null);

    useEffect(() => {
        const h = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) => o.toLowerCase().includes(q));
    }, [options, query]);

    const heightClass = size === "sm" ? "h-11" : "h-12";
    const showCustom =
        allowCustom &&
        query.trim() &&
        !filtered.some((o) => o.toLowerCase() === query.trim().toLowerCase());

    const pick = (opt) => {
        onChange?.(opt);
        setQuery("");
        setOpen(false);
    };

    return (
        <div className="relative" ref={wrapRef}>
            {label ? (
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>
            ) : null}

            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((o) => !o)}
                className={`flex w-full items-center justify-between rounded-xl border border-neutral-400 px-4 text-left text-sm ${heightClass} transition-all focus:border-primary-700 focus:outline-none ${
                    disabled ? "cursor-not-allowed bg-neutral-50 text-neutral-400" : "bg-white text-neutral-700"
                }`}
            >
                <span className={`truncate ${value ? "" : "text-neutral-500"}`}>
                    {disabled && disabledText ? disabledText : value || placeholder}
                </span>
                <FiChevronDown className="ml-2 shrink-0 text-neutral-500" />
            </button>

            {open && !disabled && (
                <div className="absolute z-40 mt-1 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
                    <div className="border-b border-neutral-100 p-2">
                        <div className="relative">
                            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full rounded-lg border border-neutral-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-primary-700"
                            />
                        </div>
                    </div>

                    <ul className="max-h-56 overflow-y-auto py-1">
                        {showCustom && (
                            <li>
                                <button
                                    type="button"
                                    onClick={() => pick(query.trim())}
                                    className="block w-full px-4 py-2 text-left text-sm text-primary-700 hover:bg-neutral-50"
                                >
                                    Gunakan “{query.trim()}”
                                </button>
                            </li>
                        )}
                        {filtered.length === 0 && !showCustom && (
                            <li className="px-4 py-3 text-sm text-neutral-400">{emptyText}</li>
                        )}
                        {filtered.map((opt) => (
                            <li key={opt}>
                                <button
                                    type="button"
                                    onClick={() => pick(opt)}
                                    className={`block w-full truncate px-4 py-2 text-left text-sm hover:bg-neutral-50 ${
                                        opt === value ? "bg-primary-50 font-medium text-primary-700" : "text-neutral-700"
                                    }`}
                                >
                                    {opt}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
