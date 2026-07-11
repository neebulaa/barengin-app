<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Melekatkan admin@barengin ke data yang SUDAH ada (bukan membuat data khusus),
 * satu untuk tiap status, agar tab riwayat menampilkan seluruh status:
 * - Trip Bareng   : Selesai / Berlangsung / Akan Mulai
 * - Pergi Bareng  : Selesai / Berlangsung / Akan Mulai
 * - Jastip        : Selesai (bisa diulas) + variasi masa pengambilan
 */
class AdminHistorySeeder extends Seeder
{
    public function run(): void
    {
        $admin = DB::table('users')->where('email', 'admin@barengin.com')->first();
        if (! $admin) {
            $this->command?->warn('User admin@barengin.com tidak ditemukan. Lewati AdminHistorySeeder.');
            return;
        }

        $today = Carbon::today();

        // ===== Trip Bareng: satu per status =====
        foreach (['done', 'ongoing', 'created'] as $status) {
            $trip = DB::table('trips')
                ->where('status', $status)
                ->where('guider_id', '!=', $admin->id)
                ->inRandomOrder()
                ->first();
            if ($trip) {
                $this->attachTripBuyer($admin->id, $trip);
            }
        }

        // ===== Pergi Bareng: satu per status (derivasi dari time_appointment) =====
        $pergiByPhase = [
            DB::table('pergi_barengs')->whereDate('time_appointment', '<', $today)->where('initiator_id', '!=', $admin->id)->inRandomOrder()->first(),
            DB::table('pergi_barengs')->whereDate('time_appointment', $today)->where('initiator_id', '!=', $admin->id)->inRandomOrder()->first(),
            DB::table('pergi_barengs')->whereDate('time_appointment', '>', $today)->where('initiator_id', '!=', $admin->id)->inRandomOrder()->first(),
        ];
        foreach (array_filter($pergiByPhase) as $pb) {
            $already = DB::table('pergi_bareng_participants')
                ->where('pergi_bareng_id', $pb->id)
                ->where('user_id', $admin->id)
                ->exists();
            if (! $already) {
                DB::table('pergi_bareng_participants')->insert([
                    'pergi_bareng_id' => $pb->id,
                    'user_id'         => $admin->id,
                    'quantity'        => 1,
                    'created_at'      => now()->subDays(3),
                    'updated_at'      => now()->subDays(3),
                ]);
            }
        }

        // ===== Jastip: 2 item selesai (bisa diulas) + 1 sedang masa ambil =====
        $finished = DB::table('jastip_items')
            ->whereDate('pickup_end_date', '<', $today)
            ->where('user_id', '!=', $admin->id)
            ->inRandomOrder()->limit(2)->get();
        $pickup = DB::table('jastip_items')
            ->whereDate('pickup_start_date', '<=', $today)
            ->whereDate('pickup_end_date', '>=', $today)
            ->where('user_id', '!=', $admin->id)
            ->inRandomOrder()->first();

        foreach ($finished->push($pickup)->filter() as $item) {
            $this->attachJastipBuyer($admin->id, $item);
        }

        $this->command?->info('AdminHistorySeeder: admin dilekatkan ke trip/pergi/jastip lintas status.');
    }

    /** Buat transaksi + trip_order berbayar untuk admin (idempotent per trip). */
    private function attachTripBuyer(int $userId, $trip): void
    {
        $exists = DB::table('trip_orders')
            ->where('trip_id', $trip->id)
            ->where('user_id', $userId)
            ->exists();
        if ($exists) {
            return;
        }

        $bookedAt = Carbon::parse($trip->start_date)->subDays(rand(5, 15));
        $total    = (float) $trip->price + 10000;
        $txId     = (string) Str::uuid();

        DB::table('transactions')->insert([
            'id' => $txId, 'user_id' => $userId, 'total_amount' => $total,
            'type' => 'trip', 'payment_method' => 'Midtrans',
            'expired_at' => $bookedAt->copy()->addDay(),
            'created_at' => $bookedAt, 'updated_at' => $bookedAt,
        ]);
        DB::table('trip_orders')->insert([
            'transaction_id' => $txId, 'trip_id' => $trip->id, 'user_id' => $userId,
            'quantity' => 1, 'total' => $total, 'order_status' => 'paid',
            'created_at' => $bookedAt, 'updated_at' => $bookedAt,
        ]);
    }

    /** Buat transaksi + jastip_order berbayar untuk admin (idempotent per item). */
    private function attachJastipBuyer(int $userId, $item): void
    {
        $variant = DB::table('jastip_item_variants')->where('jastip_item_id', $item->id)->first();
        if (! $variant) {
            return;
        }

        $exists = DB::table('jastip_order_items')
            ->join('jastip_orders', 'jastip_order_items.jastip_order_id', '=', 'jastip_orders.id')
            ->join('transactions', 'jastip_orders.transaction_id', '=', 'transactions.id')
            ->where('transactions.user_id', $userId)
            ->where('jastip_order_items.jastip_item_id', $item->id)
            ->exists();
        if ($exists) {
            return;
        }

        $orderedAt = Carbon::parse($item->end_date)->subDays(rand(1, 5));
        if ($orderedAt->isFuture()) {
            $orderedAt = Carbon::now()->subDays(2);
        }
        $total = (float) $item->base_price + (float) $item->jastip_fee + (float) $variant->additional_price;
        $txId  = (string) Str::uuid();

        DB::table('transactions')->insert([
            'id' => $txId, 'user_id' => $userId, 'total_amount' => $total + 5000,
            'type' => 'jastip', 'payment_method' => 'Midtrans',
            'expired_at' => $orderedAt->copy()->addDay(),
            'created_at' => $orderedAt, 'updated_at' => $orderedAt,
        ]);
        $orderId = DB::table('jastip_orders')->insertGetId([
            'transaction_id' => $txId, 'use_shipping' => false, 'shipping_address' => '-',
            'order_status' => 'paid', 'created_at' => $orderedAt, 'updated_at' => $orderedAt,
        ]);
        DB::table('jastip_order_items')->insert([
            'jastip_order_id' => $orderId, 'jastip_item_id' => $item->id,
            'jastip_item_variant_id' => $variant->id, 'quantity' => 1,
            'created_at' => $orderedAt, 'updated_at' => $orderedAt,
        ]);
        DB::table('jastip_orders_fees')->insert([
            'jastip_order_id' => $orderId, 'fee_name' => 'Biaya Layanan', 'amount' => 5000,
            'created_at' => $orderedAt, 'updated_at' => $orderedAt,
        ]);
    }
}
