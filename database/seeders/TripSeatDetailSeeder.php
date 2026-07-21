<?php

namespace Database\Seeders;

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

// Isi kolom trip_orders.participants (snapshot identitas per kursi) untuk pesanan
// hasil seeder yang dulu dibiarkan kosong. Tanpa ini "DETAIL PESERTA PER KURSI"
// di halaman peserta tampil kosong padahal kursinya jelas terpesan.
//
// Bentuk JSON-nya sama persis dengan yang disimpan checkout asli: array objek
// { name, phone, nik, passport } sebanyak quantity kursi.
class TripSeatDetailSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Hanya pesanan berbayar yang belum punya rincian peserta. '[]' & 'null'
        // sama-sama dianggap kosong supaya aman dijalankan ulang.
        $orders = DB::table('trip_orders')
            ->where('order_status', 'paid')
            ->where(function ($q) {
                $q->whereNull('participants')
                    ->orWhere('participants', '')
                    ->orWhere('participants', '[]');
            })
            ->get();

        if ($orders->isEmpty()) {
            $this->command?->info('TripSeatDetailSeeder: tidak ada pesanan trip yang perlu diisi.');
            return;
        }

        $userNames = DB::table('users')->pluck('full_name', 'id');
        $filled = 0;

        foreach ($orders as $order) {
            $seats = max(1, (int) $order->quantity);
            $participants = [];

            for ($seat = 0; $seat < $seats; $seat++) {
                // Kursi pertama pakai nama pemesan; sisanya teman/keluarga (nama acak).
                $name = $seat === 0
                    ? ($userNames[$order->user_id] ?? $faker->name)
                    : $faker->name;

                // Sebagian kecil pakai paspor (trip luar negeri); mayoritas NIK.
                $usesPassport = $faker->boolean(20);

                $participants[] = [
                    'name'     => $name,
                    'phone'    => '08' . $faker->numerify('##########'),
                    'nik'      => $usesPassport ? '' : $faker->numerify('################'), // 16 digit
                    'passport' => $usesPassport ? strtoupper($faker->bothify('?#######')) : '',
                ];
            }

            DB::table('trip_orders')
                ->where('id', $order->id)
                ->update(['participants' => json_encode($participants)]);

            $filled++;
        }

        $this->command?->info("TripSeatDetailSeeder: {$filled} pesanan trip diisi rincian pesertanya.");
    }
}
