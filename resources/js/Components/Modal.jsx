import { useEffect } from "react";
import { createPortal } from "react-dom";

const SIZE_MAP = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
};

// Shell modal dasar - satu tempat untuk perilaku overlay yang dulu disalin di
// tiap modal: portal ke <body>, tutup via Esc / klik backdrop, dan panel putih
// ber-rounded di tengah layar. Di-portal ke <body> supaya z-index-nya tidak
// terkurung stacking context induk (kartu/sidebar sticky, elemen ber-transform).
// ConfirmModal & FormModal dibangun di atas ini; modal kustom lain bisa ikut
// memakainya agar konsisten.
export default function Modal({
    open,
    onClose,
    size = "sm", // sm | md | lg | xl | 2xl - lebar maksimum panel
    className = "", // kelas tambahan untuk panel (mis. flex/max-h/overflow)
    closeOnBackdrop = true,
    closeOnEsc = true, // matikan untuk form yang tak boleh hilang tak sengaja
    children,
}) {
    // Esc menutup modal - pasangan alami dari klik di luar. Hook di atas early
    // return supaya urutannya tidak berubah antar render.
    useEffect(() => {
        if (!open || !closeOnEsc) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, closeOnEsc, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            // Klik di area gelap menutup modal; klik di dalam panel tidak, karena
            // panel menghentikan propagasi.
            onClick={closeOnBackdrop ? onClose : undefined}
            role="presentation"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-900/40 p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                className={`w-full ${SIZE_MAP[size] ?? SIZE_MAP.sm} rounded-2xl bg-white shadow-2xl animate-fade-in-up ${className}`}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}
