import React, { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import useLockBodyScroll from "@/Hooks/useLockBodyScroll";

/**
 * ImageLightbox — modal untuk melihat gambar tanpa terpotong (object-contain).
 *
 * Komponen umum & bisa dipakai ulang di mana saja: cukup kirim daftar `images`
 * (URL) dan indeks awal. Mendukung navigasi kiri/kanan (tombol & panah keyboard),
 * tutup lewat tombol X / klik latar / tombol Esc.
 *
 * Contoh:
 *   const [lb, setLb] = useState({ open: false, index: 0 });
 *   <ImageLightbox
 *       images={urls}
 *       index={lb.index}
 *       open={lb.open}
 *       onClose={() => setLb((s) => ({ ...s, open: false }))}
 *   />
 */
export default function ImageLightbox({
    images = [],
    index = 0,
    open = false,
    onClose,
    alt = "image",
}) {
    const list = Array.isArray(images) ? images.filter(Boolean) : [];
    const [current, setCurrent] = useState(index);

    useLockBodyScroll(open);

    // Sinkronkan indeks saat modal dibuka dari thumbnail berbeda.
    useEffect(() => {
        if (open) setCurrent(Math.min(Math.max(0, index), Math.max(0, list.length - 1)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, index]);

    const hasMany = list.length > 1;

    const goPrev = useCallback(
        (e) => {
            e?.stopPropagation();
            setCurrent((c) => (c - 1 + list.length) % list.length);
        },
        [list.length],
    );

    const goNext = useCallback(
        (e) => {
            e?.stopPropagation();
            setCurrent((c) => (c + 1) % list.length);
        },
        [list.length],
    );

    // Navigasi & tutup lewat keyboard.
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
            else if (e.key === "ArrowLeft" && hasMany) goPrev();
            else if (e.key === "ArrowRight" && hasMany) goNext();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, hasMany, goPrev, goNext, onClose]);

    if (!open || list.length === 0) return null;

    return (
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4"
            onClick={() => onClose?.()}
            role="dialog"
            aria-modal="true"
        >
            {/* Tombol tutup */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose?.();
                }}
                className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Tutup"
            >
                <FiX className="h-5 w-5" />
            </button>

            {hasMany && (
                <>
                    <button
                        type="button"
                        onClick={goPrev}
                        className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        aria-label="Sebelumnya"
                    >
                        <FiChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        aria-label="Berikutnya"
                    >
                        <FiChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Gambar utuh (tidak dipotong) */}
            <img
                src={list[current]}
                alt={alt}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
            />

            {hasMany && (
                <div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white"
                    onClick={(e) => e.stopPropagation()}
                >
                    {current + 1} / {list.length}
                </div>
            )}
        </div>
    );
}
