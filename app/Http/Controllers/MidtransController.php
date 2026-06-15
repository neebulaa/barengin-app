<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MidtransController extends Controller
{
    /**
     * Webhook notifikasi dari Midtrans (server-to-server).
     * Set URL ini di dashboard Midtrans: {APP_URL}/midtrans/notification
     */
    public function notification()
    {
        self::configure();

        try {
            $notif = new \Midtrans\Notification();
        } catch (\Throwable $e) {
            Log::warning('[MIDTRANS] Notifikasi tidak valid: ' . $e->getMessage());
            return response()->json(['message' => 'invalid notification'], 400);
        }

        self::applyStatus(
            $notif->order_id,
            $notif->transaction_status,
            $notif->fraud_status ?? null,
        );

        return response()->json(['message' => 'ok']);
    }

    /**
     * Cek status transaksi langsung ke Midtrans lalu sinkronkan ke DB.
     * Dipakai saat membuka halaman Profile History (cocok untuk localhost
     * tanpa webhook publik).
     */
    public static function syncTransaction(string $transactionId): void
    {
        try {
            self::configure();
            $status = (array) \Midtrans\Transaction::status($transactionId);

            self::applyStatus(
                $transactionId,
                $status['transaction_status'] ?? null,
                $status['fraud_status'] ?? null,
            );
        } catch (\Throwable $e) {
            // Transaksi belum ada di Midtrans / network error -> abaikan saja
            Log::info('[MIDTRANS] Gagal sync transaksi ' . $transactionId . ': ' . $e->getMessage());
        }
    }

    /**
     * Petakan status Midtrans -> order_status (paid | pending | unpaid)
     * dan update trip_orders / jastip_orders terkait.
     */
    public static function applyStatus(?string $orderId, ?string $txStatus, ?string $fraudStatus = null): void
    {
        if (! $orderId || ! $txStatus) {
            return;
        }

        $orderStatus = match ($txStatus) {
            'capture'    => $fraudStatus === 'challenge' ? 'pending' : 'paid',
            'settlement' => 'paid',
            'pending'    => 'pending',
            'deny', 'expire', 'cancel', 'failure' => 'unpaid',
            default      => null,
        };

        if (! $orderStatus) {
            return;
        }

        DB::table('trip_orders')
            ->where('transaction_id', $orderId)
            ->update(['order_status' => $orderStatus, 'updated_at' => now()]);

        DB::table('jastip_orders')
            ->where('transaction_id', $orderId)
            ->update(['order_status' => $orderStatus, 'updated_at' => now()]);
    }

    private static function configure(): void
    {
        \Midtrans\Config::$serverKey    = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production', false);
        \Midtrans\Config::$isSanitized  = true;
        \Midtrans\Config::$is3ds        = true;
    }
}
