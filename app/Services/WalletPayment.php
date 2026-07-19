<?php

namespace App\Services;

use App\Http\Controllers\MidtransController;
use App\Models\Wallet;
use Illuminate\Support\Facades\Log;

/**
 * Pembayaran memakai saldo dompet, sebagai alternatif Midtrans Snap.
 *
 * Pesanan tetap dibuat persis seperti alur Midtrans (transactions + *_orders),
 * lalu saldo dipotong dan pesanan langsung dianggap lunas. Pelunasannya sengaja
 * menumpang MidtransController::applyStatus() dengan status 'settlement' supaya
 * seluruh akibat pembayaran — peserta trip, grup chat, notifikasi, kredit dompet
 * penyelenggara — berjalan lewat jalur yang sama persis dengan pembayaran
 * Midtrans, alih-alih diduplikasi di sini dan berisiko menyimpang.
 */
class WalletPayment
{
    /**
     * Potong saldo lalu tandai transaksinya lunas.
     *
     * Mengembalikan `true` bila saldo benar-benar terpotong pada pemanggilan ini,
     * dan `false` bila sumber (`$sourceType`/`$sourceId`) ternyata sudah pernah
     * didebit — Wallet::debit() idempoten terhadap sumber, jadi uangnya tidak
     * terpotong dua kali.
     *
     * Nilai `false` bukan kegagalan, tetapi patut dicurigai: pesanan ini sudah
     * dibayar dari saldo, namun pemanggil tetap menyodorkan `$transactionId`
     * baru. Artinya ada transaksi kembar untuk satu pesanan — biasanya karena
     * klik ganda yang lolos dari penjagaan status di controller, atau percobaan
     * ulang setelah proses sebelumnya terputus.
     *
     * Pelunasan tetap dijalankan supaya percobaan ulang yang sah tidak
     * meninggalkan pesanan menggantung padahal uangnya sudah diambil (mis. proses
     * mati setelah debit berhasil tetapi sebelum applyStatus). Kejadiannya
     * dicatat sebagai warning agar transaksi kembar tetap terlihat di log alih-
     * alih lewat diam-diam.
     *
     * @throws \App\Exceptions\InsufficientBalanceException bila saldo tak cukup.
     */
    public function settle(
        int $userId,
        string $transactionId,
        float $amount,
        string $description,
        string $sourceType,
        int $sourceId,
    ): bool {
        $debited = Wallet::forUser($userId)->debit($amount, $description, $sourceType, $sourceId);

        if (! $debited) {
            Log::warning('Pembayaran saldo: sumber ini sudah pernah didebit, saldo tidak dipotong lagi.', [
                'user_id' => $userId,
                'transaction_id' => $transactionId,
                'source_type' => $sourceType,
                'source_id' => $sourceId,
                'amount' => $amount,
            ]);
        }

        MidtransController::applyStatus($transactionId, 'settlement');

        return $debited;
    }
}
