import { useEffect, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { FiGlobe, FiCheck, FiChevronDown } from "react-icons/fi";

// Pemilih bahasa (globe dropdown). Membaca daftar bahasa aktif & locale saat ini
// dari props Inertia, lalu POST /locale/{code} untuk mengganti bahasa.
export default function LanguageSwitcher({ className = "" }) {
    const { props } = usePage();
    const languages = props?.languages || [];
    const locale = props?.locale || "id";

    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    // Jangan tampilkan bila hanya ada satu bahasa aktif
    if (languages.length <= 1) return null;

    const change = (code) => {
        setOpen(false);
        if (code === locale) return;
        router.post(`/locale/${code}`, {}, { preserveScroll: true });
    };

    return (
        <div ref={rootRef} className={["relative", className].join(" ")}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Ganti bahasa"
            >
                <FiGlobe className="h-4 w-4 text-neutral-500" />
                <span className="uppercase">{locale}</span>
                <FiChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 min-w-[13rem] w-max max-w-[20rem] rounded-xl border border-neutral-100 bg-white shadow-lg overflow-hidden z-50 animate-fade-in-up">
                    {languages.map((lang) => {
                        const activeLang = lang.code === locale;
                        return (
                            <button
                                key={lang.code}
                                type="button"
                                onClick={() => change(lang.code)}
                                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                                    activeLang
                                        ? "bg-primary-50 text-primary-700 font-semibold"
                                        : "text-neutral-700 hover:bg-neutral-50"
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="w-6 shrink-0 text-xs font-bold uppercase text-neutral-400">
                                        {lang.code}
                                    </span>
                                    <span>{lang.native_name || lang.name}</span>
                                </span>
                                {activeLang && <FiCheck className="h-4 w-4 shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
