import { useCallback, useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";

/**
 * Jumlah percakapan yang punya pesan belum dibaca, untuk lencana di navbar.
 *
 * Dipakai bersama oleh navbar depan dan navbar dasbor supaya keduanya
 * menunjukkan angka yang sama — sebelumnya logikanya hanya ada di navbar depan,
 * jadi lencananya hilang begitu pengguna masuk ke dasbor.
 *
 * Nilai awal datang dari shared prop Inertia (ikut berubah tiap pindah halaman),
 * lalu dijaga tetap hidup lewat Echo, dan polling sebagai cadangan untuk hosting
 * tanpa WebSocket.
 *
 * @returns {{ count: number, label: string, refresh: () => void }}
 */
export function useUnreadChats() {
    const { props } = usePage();
    const user = props?.auth?.user;

    const [count, setCount] = useState(Number(props?.chat_unread_count ?? 0));

    // Selaraskan lagi setiap kunjungan Inertia (mis. setelah membuka /chat,
    // lencana harus langsung turun tanpa menunggu poll berikutnya).
    useEffect(() => {
        setCount(Number(props?.chat_unread_count ?? 0));
    }, [props?.chat_unread_count]);

    // Hitung ulang dari sumber yang sama dengan halaman Chat, agar lencana dan
    // daftar chat tidak pernah berbeda angka.
    const refresh = useCallback(async () => {
        try {
            const { data } = await axios.get("/chat/poll");
            if (Array.isArray(data?.conversations)) {
                setCount(
                    data.conversations.filter((c) => (c.unread ?? 0) > 0).length,
                );
            }
        } catch {
            /* diamkan — lencana cukup pakai nilai terakhir */
        }
    }, []);

    // Realtime: pesan masuk ke channel pribadi user langsung memicu hitung ulang.
    useEffect(() => {
        if (!window.Echo || !user?.id) return;

        const channelName = `user.${user.id}`;
        const channel = window.Echo.private(channelName);

        channel.listen(".message.sent", (payload) => {
            // Pesan sendiri (dikirim dari perangkat lain) bukan notifikasi.
            if (Number(payload?.sender_id) === Number(user.id)) return;
            refresh();
        });

        return () => {
            channel.stopListening(".message.sent");
            window.Echo.leave(`private-${channelName}`);
        };
    }, [user?.id, refresh]);

    // Fallback polling — menjaga lencana tetap akurat pada hosting tanpa
    // WebSocket, sekaligus menurunkan angka saat chat dibaca di tab lain.
    useEffect(() => {
        if (!user?.id) return;

        const tick = () => {
            if (document.hidden) return;
            refresh();
        };
        const interval = setInterval(tick, 12000);

        return () => clearInterval(interval);
    }, [user?.id, refresh]);

    return {
        count,
        label: count > 99 ? "99+" : String(count),
        refresh,
    };
}

export default useUnreadChats;
