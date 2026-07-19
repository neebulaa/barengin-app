<?php

namespace App\Services\Chat;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\PergiBareng;

/**
 * Membagikan kartu "pantau perjalanan" ke grup chat pergi bareng.
 *
 * Satu-satunya tempat yang menaruh kartu ini di grup, dipanggil dari beberapa
 * pintu masuk yang berbagi aturan sama:
 *  - Otomatis saat anggota membuka grup pergi bareng yang sedang berlangsung.
 *  - Terjadwal (command) begitu perjalanan memasuki jam keberangkatan.
 *  - Tombol "Pantau Perjalanan" penyelenggara di dasbor.
 *
 * Idempoten & hanya aktif saat perjalanan `ongoing`: aman dipanggil berulang —
 * kalau kartunya sudah nangkring di grup untuk perjalanan ini, tidak dikirim
 * lagi sehingga grup tak dibanjiri kartu duplikat.
 *
 * Idempotensinya bersandar pada kolom `pergi_barengs.track_shared_at`, bukan
 * pada memindai isi percakapan. Dua alasannya:
 *
 *  1. Murah. Pemeriksaan ini ikut berjalan pada tiap tick polling chat (~5 detik
 *     dikali jumlah anggota grup), justru pada grup yang sedang paling ramai.
 *     Memindai seluruh pesan bereferensi lalu menyaringnya di PHP tumbuh seiring
 *     panjang percakapan; membaca satu kolom lewat primary key tidak.
 *  2. Aman terhadap balapan. Klaimnya berupa satu UPDATE bersyarat, jadi dua
 *     poll yang datang bersamaan tidak bisa sama-sama lolos lalu mengirim kartu
 *     dua kali — persis kasus yang tak bisa dicegah oleh pemeriksaan baca-dulu.
 */
class PergiBarengTrackShare
{
    /**
     * Kirim kartu bila perjalanan sedang berlangsung dan belum pernah dibagikan.
     * Mengembalikan true hanya bila kartu baru saja dikirim.
     */
    public static function share(PergiBareng $trip): bool
    {
        if ($trip->status() !== 'ongoing') {
            return false;
        }

        // Jalur tersering: kartunya sudah pernah dikirim. Dijawab dari kolom yang
        // sudah ikut termuat bersama perjalanannya, sehingga tick polling yang
        // berulang tidak menyentuh database sama sekali. Klaim atomik di bawah
        // tetap menjadi penentu sesungguhnya kalau nilainya basi.
        if ($trip->track_shared_at) {
            return false;
        }

        $conversation = Conversation::where('pergi_bareng_id', $trip->id)
            ->where('is_group', true)
            ->first();

        if (! $conversation) {
            return false;
        }

        // Klaim atomik: hanya pemanggil yang berhasil mengubah NULL → sekarang
        // yang boleh mengirim. Pemanggil lain menerima 0 baris terpengaruh dan
        // mundur, tanpa perlu kunci eksplisit.
        $claimed = PergiBareng::whereKey($trip->id)
            ->whereNull('track_shared_at')
            ->update(['track_shared_at' => now()]);

        if ($claimed === 0) {
            return false;
        }

        $trip->track_shared_at = now();

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $trip->initiator_id,
            'message_text' => '',
            'reference' => [
                'type' => 'pergi_track',
                'id' => (int) $trip->id,
                'title' => $trip->name,
                'subtitle' => $trip->destination_loc,
                'url' => '/pergi-bareng/' . $trip->id . '/track',
            ],
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return true;
    }
}
