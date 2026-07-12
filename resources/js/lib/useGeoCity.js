import { useEffect, useRef } from "react";

/**
 * Deteksi kota pengguna sekali (reverse geocode via BigDataCloud) secara
 * imperatif. Kembalikan nama kota (atau null). Dipakai untuk tombol
 * "gunakan lokasi saya" yang ditekan pengguna, bukan diisi otomatis.
 */
export function detectCity() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const res = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=id`
                    );
                    const geo = await res.json();
                    resolve(
                        geo.city || geo.locality || geo.principalSubdivision || null,
                    );
                } catch {
                    resolve(null);
                }
            },
            () => resolve(null),
            { enableHighAccuracy: false, timeout: 10000 }
        );
    });
}

/**
 * Deteksi kota pengguna sekali (reverse geocode via BigDataCloud) dan panggil
 * `apply(city)` bila `shouldRun` true. Dipakai untuk mengisi default kolom
 * lokasi "Dari" pada form pencarian (Trip / Pergi Bareng / Jastip).
 */
export function useGeoCity(shouldRun, apply) {
    const done = useRef(false);

    useEffect(() => {
        if (!shouldRun || done.current) return;
        done.current = true;
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const res = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=id`
                    );
                    const geo = await res.json();
                    const city =
                        geo.city || geo.locality || geo.principalSubdivision || "";
                    if (city) apply(city);
                } catch {
                    /* abaikan kegagalan geolokasi */
                }
            },
            () => {},
            { enableHighAccuracy: false, timeout: 10000 }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
