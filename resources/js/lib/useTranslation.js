import { usePage } from "@inertiajs/react";

// Hook terjemahan sederhana. Membaca kamus `translations` (untuk locale aktif)
// yang dibagikan lewat Inertia. Kalau key tidak ada, pakai fallback / key itu sendiri.
export function useTranslation() {
    const page = usePage();
    const translations = page?.props?.translations || {};
    const locale = page?.props?.locale || "id";

    const t = (key, fallback) => translations[key] ?? fallback ?? key;

    return { t, locale };
}
