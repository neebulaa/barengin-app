<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class JastipSeeder extends Seeder
{
    public function run(): void
    {
        // Pemilik jastip = admin (jastiper utama)
        $owner = User::where('email', 'admin@barengin.com')->first() ?? User::first();
        if (! $owner) {
            $this->command?->warn('JastipSeeder: tidak ada user, dilewati.');
            return;
        }

        $buyerIds = User::where('id', '!=', $owner->id)->pluck('id')->all();
        if (empty($buyerIds)) {
            $buyerIds = [$owner->id];
        }

        $images = [
            '/assets/home/jastip/kacang-rostcas.jpg',
            '/assets/home/jastip/celana-sontog.jpg',
            '/assets/default-image.png',
        ];

        // [name, brand, category, base, fee, stock, sold, status, imgIndex]
        $products = [
            ['Milo Potomalt 3in1 Malaysia', 'Nestle', 'Food', 90000, 9000, 20, 12, 'published', 0],
            ['Kacang Roastcas Premium', 'Roastcas', 'Food', 25000, 3000, 40, 28, 'published', 0],
            ['Celana Sontog 3/4 Betis', 'Sontog', 'Fashion', 45000, 5000, 25, 25, 'published', 1],
            ['Kopi Bubuk Legend Aming', 'Aming Coffee', 'Food', 35000, 4000, 12, 7, 'published', 2],
            ['Pie Susu Dhian Bali', 'Dhian', 'Food', 40000, 5000, 20, 14, 'published', 2],
            ['Bolu Talas Sangkuriang', 'Sangkuriang', 'Food', 32000, 5000, 20, 0, 'draft', 2],
        ];

        $now = Carbon::now();

        foreach ($products as $i => $p) {
            [$name, $brand, $cat, $base, $fee, $stock, $sold, $status, $imgIdx] = $p;

            $itemId = DB::table('jastip_items')->insertGetId([
                'user_id'     => $owner->id,
                'jastip_id'   => null,
                'name'        => $name,
                'brand'       => $brand,
                'category'    => $cat,
                'description' => 'Produk jastip pilihan: ' . $name . '. Kualitas terjamin, dibawa langsung oleh jastiper terpercaya.',
                'max_slot'    => $stock,
                'base_price'  => $base,
                'jastip_fee'  => $fee,
                'min_buy'     => 1,
                'weight_gram' => rand(200, 1500),
                'status'      => $status,
                'start_date'  => $now->copy()->subDays(30)->toDateString(),
                'end_date'    => $now->copy()->addDays(30)->toDateString(),
                'created_at'  => $now->copy()->subDays(rand(5, 40)),
                'updated_at'  => $now,
            ]);

            // Gambar (2 per produk — demo multi-image)
            DB::table('jastip_item_images')->insert([
                ['jastip_item_id' => $itemId, 'image_name' => $images[$imgIdx]],
                ['jastip_item_id' => $itemId, 'image_name' => $images[($imgIdx + 1) % count($images)]],
            ]);

            // Varian (minimal satu — "Original")
            $variantId = DB::table('jastip_item_variants')->insertGetId([
                'jastip_item_id'   => $itemId,
                'var_name'         => 'Varian',
                'var_value'        => 'Original',
                'additional_price' => 0,
                'created_at'       => $now,
                'updated_at'       => $now,
            ]);
            DB::table('jastip_item_variants')->insert([
                'jastip_item_id'   => $itemId,
                'var_name'         => 'Varian',
                'var_value'        => 'Spesial',
                'additional_price' => 5000,
                'created_at'       => $now,
                'updated_at'       => $now,
            ]);

            // Buat pesanan berbayar sebanyak $sold (tersebar 6 bulan untuk grafik)
            $remaining = $sold;
            while ($remaining > 0) {
                $qty = min($remaining, rand(1, 3));
                $remaining -= $qty;

                $buyer = $buyerIds[array_rand($buyerIds)];
                $orderDate = $now->copy()->subMonths(rand(0, 5))->subDays(rand(0, 25));
                $useShipping = (bool) rand(0, 1);
                $total = ($base + $fee) * $qty;

                $txId = (string) Str::uuid();
                DB::table('transactions')->insert([
                    'id'             => $txId,
                    'user_id'        => $buyer,
                    'total_amount'   => $total,
                    'type'           => 'jastip',
                    'payment_method' => 'midtrans',
                    'expired_at'     => $orderDate->copy()->addDay(),
                    'created_at'     => $orderDate,
                    'updated_at'     => $orderDate,
                ]);

                $orderId = DB::table('jastip_orders')->insertGetId([
                    'transaction_id'   => $txId,
                    'use_shipping'     => $useShipping,
                    'shipping_address' => $useShipping ? 'Jl. Contoh No. ' . rand(1, 99) . ', Indonesia' : '-',
                    'order_status'     => 'paid',
                    'created_at'       => $orderDate,
                    'updated_at'       => $orderDate,
                ]);

                DB::table('jastip_order_items')->insert([
                    'jastip_order_id'        => $orderId,
                    'jastip_item_id'         => $itemId,
                    'jastip_item_variant_id' => $variantId,
                    'quantity'               => $qty,
                    'created_at'             => $orderDate,
                    'updated_at'             => $orderDate,
                ]);
            }
        }

        // Rating jastiper (untuk stat "Rata-Rata Rating")
        foreach (range(1, 12) as $n) {
            DB::table('user_ratings')->insert([
                'user_id'       => $buyerIds[array_rand($buyerIds)],
                'rated_user_id' => $owner->id,
                'type'          => 'jastiper',
                'rating_amount' => rand(45, 50) / 10,
                'comment'       => 'Jastipnya amanah, barang sesuai & cepat!',
                'created_at'    => $now->copy()->subDays(rand(1, 60)),
                'updated_at'    => $now,
            ]);
        }

        $this->command?->info('JastipSeeder: ' . count($products) . ' produk jastip + pesanan dibuat untuk ' . $owner->email . '.');
    }
}
