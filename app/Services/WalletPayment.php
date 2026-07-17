<?php

namespace App\Services;

use App\Http\Controllers\MidtransController;
use App\Models\Wallet;

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
     * @throws \App\Exceptions\InsufficientBalanceException bila saldo tak cukup.
     */
    public function settle(
        int $userId,
        string $transactionId,
        float $amount,
        string $description,
        string $sourceType,
        int $sourceId,
    ): void {
        Wallet::forUser($userId)->debit($amount, $description, $sourceType, $sourceId);

        MidtransController::applyStatus($transactionId, 'settlement');
    }
}
