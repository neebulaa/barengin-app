<?php

namespace Database\Seeders;

use App\Models\JastipCategory;
use App\Models\JastipItem;
use App\Models\PergiBareng;
use App\Models\Trip;
use App\Models\User;
use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

// "User lama" Barengin: satu akun yang sudah mengikuti banyak layanan admin,
// dibuat khusus untuk mensimulasikan alur review & pantau perjalanan/pengambilan.
//
// Semua item (trip, pergi bareng, jastip) diselenggarakan akun admin, lalu user
// ini ikut sebagai peserta/pembeli berbayar:
//   - Trip   : 1 trip status selesai            -> simulasi review guider
//   - Pergi  : 2 pergi bareng (berlangsung + selesai) -> pantau + review
//   - Jastip : 3 jastip (ambil, ambil, selesai) -> pantau ambil + review
//
// Ratingnya sengaja TIDAK diisi untuk user ini supaya tombol "beri ulasan" masih
// aktif saat login sebagai dia; rating dari user lain tetap dibuat sebagai baseline.
class VeteranUserSeeder extends Seeder
{
    private const EMAIL = 'veteran@barengin.com';
    private const USERNAME = 'veteran_barengin';
    private const PASSWORD = 'password123';

    public function run(): void
    {
        $faker = Faker::create('id_ID');

        $admin = User::where('email', 'admin@barengin.com')->first() ?? User::where('is_admin', true)->first();
        if (! $admin) {
            $this->command?->warn('VeteranUserSeeder: akun admin tidak ada, dilewati. Jalankan UsersSeeder dulu.');
            return;
        }

        if (JastipCategory::count() === 0) {
            $this->call(JastipCategorySeeder::class);
        }

        $now = Carbon::now();

        // Nama item yang dikelola seeder ini (dipakai juga untuk pembersihan ulang).
        $tripName   = 'Trip Kawah Ijen - Reuni Alumni Barengin';
        $pergiNames = ['Jakarta ke Puncak - Rombongan Alumni (Berlangsung)', 'Bandung ke Pangalengan - Alumni (Selesai)'];
        $jastipNames = [
            'Jastip iPhone Singapura - Alumni (Siap Diambil)',
            'Jastip Kosmetik Korea - Alumni (Siap Diambil)',
            'Jastip Cokelat Jepang - Alumni (Selesai)',
        ];

        $this->cleanup($tripName, $pergiNames, $jastipNames);

        // ---- User lama ----
        $veteran = User::updateOrCreate(
            ['email' => self::EMAIL],
            [
                'full_name'            => 'Rangga Persada',
                'username'             => self::USERNAME,
                'password'             => Hash::make(self::PASSWORD),
                'phone'                => '081277788899',
                'gender'               => 'male',
                'bio'                  => 'Anggota lama Barengin. Hobi jalan bareng, ikut trip, dan nitip oleh-oleh.',
                'is_admin'             => false,
                'is_guider'            => false,
                'onboarding_completed' => true,
                'created_at'           => $now->copy()->subYear(),
            ],
        );

        // User lain sebagai baseline rating (bukan si veteran).
        $otherUserIds = User::whereNotIn('id', [$admin->id, $veteran->id])
            ->orderBy('id')->limit(4)->pluck('id')->all();

        $this->seedTrip($admin, $veteran, $otherUserIds, $tripName, $now, $faker);
        $this->seedPergi($admin, $veteran, $otherUserIds, $pergiNames, $now);
        $this->seedJastip($admin, $veteran, $otherUserIds, $jastipNames, $now, $faker);

        $this->report($tripName, $pergiNames, $jastipNames);
    }

    // Hapus jejak lama agar seeder aman dijalankan berulang.
    private function cleanup(string $tripName, array $pergiNames, array $jastipNames): void
    {
        $veteran = User::where('email', self::EMAIL)->first();
        if ($veteran) {
            // Menghapus transaksi mencakup order trip & jastip (FK cascade).
            $txIds = DB::table('transactions')->where('user_id', $veteran->id)->pluck('id');
            DB::table('transactions')->whereIn('id', $txIds)->delete();
            DB::table('pergi_bareng_participants')->where('user_id', $veteran->id)->delete();
            DB::table('trip_participants')->where('full_name', $veteran->full_name)->delete();
            DB::table('user_ratings')->where('user_id', $veteran->id)->delete();
            DB::table('user_trip_ratings')->where('user_id', $veteran->id)->delete();
        }

        // Item yang dulu dibuat seeder ini -> cascade ke order/varian/gambar/percakapan.
        Trip::whereIn('name', [$tripName])->get()->each(function ($t) {
            DB::table('transactions')->whereIn('id', DB::table('trip_orders')->where('trip_id', $t->id)->pluck('transaction_id'))->delete();
            // Rating trip pakai FK restrict, jadi harus dibuang sebelum tripnya.
            DB::table('user_trip_ratings')->where('trips_id', $t->id)->delete();
            $t->delete();
        });
        foreach (JastipItem::whereIn('name', $jastipNames)->get() as $item) {
            $txIds = DB::table('jastip_order_items')
                ->join('jastip_orders', 'jastip_order_items.jastip_order_id', '=', 'jastip_orders.id')
                ->where('jastip_order_items.jastip_item_id', $item->id)
                ->pluck('jastip_orders.transaction_id');
            DB::table('transactions')->whereIn('id', $txIds)->delete();
            $item->delete();
        }
        PergiBareng::whereIn('name', $pergiNames)->delete();
    }

    // ------------------------------------------------------------------ Trip
    private function seedTrip(User $admin, User $veteran, array $others, string $name, Carbon $now, $faker): void
    {
        $start = $now->copy()->subDays(20);
        $end   = $now->copy()->subDays(17);

        $tripId = DB::table('trips')->insertGetId([
            'guider_id'     => $admin->id,
            'name'          => $name,
            'description'   => 'Reuni alumni Barengin menaklukkan blue fire Kawah Ijen. Perjalanan sudah selesai, saatnya berbagi ulasan.',
            'people_amount' => 20,
            'start_date'    => $start->toDateString(),
            'end_date'      => $end->toDateString(),
            'rating'        => 4.9,
            'price'         => 2100000,
            'image'         => '/assets/trips/ijen-1.jpg',
            'location'      => 'Jawa Timur',
            'status'        => Trip::STATUS_DONE,
            'finished_at'   => $end,
            'created_at'    => $now->copy()->subDays(40),
            'updated_at'    => $now,
        ]);

        foreach ([['Penjemputan & Briefing', 0], ['Pendakian Kawah Ijen', 1], ['Check-out & Pulang', 2]] as [$actName, $offset]) {
            $actStart = $start->copy()->addDays($offset)->setTime(3, 0);
            $activityId = DB::table('trip_activities')->insertGetId([
                'trip_id' => $tripId,
                'activity_order' => $offset + 1,
                'activity_name' => $actName,
                'activity_start_datetime' => $actStart,
                'activity_end_datetime' => $actStart->copy()->addHours(5),
                'activity_description' => 'Aktivitas trip alumni di Kawah Ijen.',
                'created_at' => $now,
            ]);
            DB::table('image_activities')->insert([
                'trip_activity_id' => $activityId,
                'activity_img_name' => '/assets/trips/ijen-' . ($offset % 2 + 1) . '.jpg',
            ]);
        }

        // Pesanan berbayar veteran: 2 kursi + rincian identitas per kursi.
        $price = 2100000;
        $qty = 2;
        $total = $price * $qty + 10000;
        $txId = (string) Str::uuid();

        DB::table('transactions')->insert([
            'id' => $txId, 'user_id' => $veteran->id, 'total_amount' => $total,
            'type' => 'trip', 'payment_method' => 'Midtrans',
            'expired_at' => $now->copy()->subDays(41), 'created_at' => $now->copy()->subDays(42), 'updated_at' => $now,
        ]);

        $participants = [
            ['name' => $veteran->full_name, 'phone' => $veteran->phone, 'nik' => $faker->numerify('################'), 'passport' => ''],
            ['name' => $faker->name, 'phone' => '08' . $faker->numerify('##########'), 'nik' => $faker->numerify('################'), 'passport' => ''],
        ];

        DB::table('trip_orders')->insert([
            'transaction_id' => $txId, 'trip_id' => $tripId, 'user_id' => $veteran->id,
            'quantity' => $qty, 'participants' => json_encode($participants), 'total' => $total,
            'order_status' => 'paid', 'fulfilled_at' => $now->copy()->subDays(42),
            'created_at' => $now->copy()->subDays(42), 'updated_at' => $now,
        ]);

        // Peserta lain sebagai baseline + ulasan dari mereka (bukan veteran).
        foreach ($others as $i => $uid) {
            $t2 = (string) Str::uuid();
            DB::table('transactions')->insert([
                'id' => $t2, 'user_id' => $uid, 'total_amount' => $price + 10000,
                'type' => 'trip', 'payment_method' => 'Midtrans',
                'expired_at' => $now->copy()->subDays(41), 'created_at' => $now->copy()->subDays(43 + $i), 'updated_at' => $now,
            ]);
            DB::table('trip_orders')->insert([
                'transaction_id' => $t2, 'trip_id' => $tripId, 'user_id' => $uid,
                'quantity' => 1, 'total' => $price + 10000, 'order_status' => 'paid',
                'participants' => json_encode([[ 'name' => $faker->name, 'phone' => '08' . $faker->numerify('##########'), 'nik' => $faker->numerify('################'), 'passport' => '']]),
                'fulfilled_at' => $now->copy()->subDays(43 + $i),
                'created_at' => $now->copy()->subDays(43 + $i), 'updated_at' => $now,
            ]);
            DB::table('user_trip_ratings')->insert([
                'user_id' => $uid, 'trips_id' => $tripId,
                'rating_amount' => 5, 'comment' => 'Trip alumni yang tak terlupakan, guide-nya top!',
                'created_at' => $now->copy()->subDays(15), 'updated_at' => $now,
            ]);
        }

        // Masukkan seluruh peserta berbayar ke grup chat trip.
        app(\App\Services\Chat\GroupConversationService::class)->syncTripGroupMembers($tripId);
    }

    // ----------------------------------------------------------- Pergi Bareng
    private function seedPergi(User $admin, User $veteran, array $others, array $names, Carbon $now): void
    {
        // [status, nama, waktu, finished_at, gambar]
        $configs = [
            ['ongoing', $names[0], $now->copy()->subHours(2), null, '/assets/trips/bandung-2.jpg', 'Sentul City, Bogor', 'Puncak, Bogor'],
            ['finish',  $names[1], $now->copy()->subDays(6)->setTime(7, 0), $now->copy()->subDays(5), '/assets/trips/bandung-3.jpg', 'Bandung Kota', 'Pangalengan, Bandung'],
        ];

        foreach ($configs as [$status, $name, $appointment, $finishedAt, $img, $from, $to]) {
            $trip = PergiBareng::create([
                'initiator_id'     => $admin->id,
                'name'             => $name,
                'description'      => 'Rombongan alumni Barengin jalan bareng. ' . ($status === 'finish' ? 'Perjalanan sudah selesai.' : 'Sedang dalam perjalanan.'),
                'departure_loc'    => $from,
                'destination_loc'  => $to,
                'transportation'   => 'Mobil Pribadi',
                'people_amount'    => 6,
                'img_name'         => $img,
                'time_appointment' => $appointment,
                'finished_at'      => $finishedAt,
            ]);

            $memberIds = array_merge([$veteran->id], $others);
            foreach ($memberIds as $uid) {
                DB::table('pergi_bareng_participants')->insert([
                    'pergi_bareng_id' => $trip->id, 'user_id' => $uid, 'quantity' => 1,
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }

            // Grup chat untuk yang berlangsung: kartu pantau perjalanan menyusul
            // otomatis saat grup dibuka (track_shared_at dibiarkan kosong).
            if ($status === 'ongoing') {
                $conversationId = DB::table('conversations')->insertGetId([
                    'trip_id' => null, 'pergi_bareng_id' => $trip->id, 'jastip_item_id' => null,
                    'is_group' => true, 'created_at' => $now, 'updated_at' => $now,
                ]);
                foreach (array_merge([$admin->id], $memberIds) as $uid) {
                    DB::table('conversation_participants')->insert([
                        'conversation_id' => $conversationId, 'user_id' => $uid,
                        'last_read_at' => $now, 'created_at' => $now, 'updated_at' => $now,
                    ]);
                }
            }

            // Baseline ulasan dari peserta lain (bukan veteran) untuk yang selesai.
            if ($status === 'finish') {
                foreach ($others as $uid) {
                    DB::table('user_ratings')->insert([
                        'user_id' => $uid, 'rated_user_id' => $admin->id, 'type' => 'pergi_bareng',
                        'rating_amount' => 5, 'comment' => 'Barengannya asik, tepat waktu!',
                        'created_at' => $now->copy()->subDays(4), 'updated_at' => $now,
                    ]);
                }
            }
        }
    }

    // ------------------------------------------------------------------ Jastip
    private function seedJastip(User $admin, User $veteran, array $others, array $names, Carbon $now, $faker): void
    {
        $catId = JastipCategory::pluck('id', 'name');

        // [phase, nama, kategori, harga, fee, gambar]
        $configs = [
            ['pickup', $names[0], 'Gadget & Aksesoris',   14500000, 500000, '/assets/jastip/products/p29.jpg'],
            ['pickup', $names[1], 'Skincare & Kecantikan', 650000,   80000, '/assets/jastip/products/p13.jpg'],
            ['finish', $names[2], 'Makanan & Minuman',     220000,   40000, '/assets/jastip/products/p20.jpg'],
        ];

        foreach ($configs as [$phase, $name, $catName, $base, $fee, $image]) {
            [$start, $end, $ps, $pe] = $this->jastipDates($phase, $now);

            $itemId = DB::table('jastip_items')->insertGetId([
                'user_id'            => $admin->id,
                'jastip_id'          => null,
                'jastip_category_id' => $catId[$catName] ?? $catId->first(),
                'name'               => $name,
                'description'        => 'Titipan alumni Barengin dari luar negeri, lengkap dengan bukti pembelian. Diambil di titik yang disepakati.',
                'pickup_province'    => 'DKI Jakarta',
                'pickup_city'        => 'Jakarta Pusat',
                'pickup_address'     => 'Stasiun Gambir',
                'purchase_province'  => 'Singapura',
                'purchase_city'      => 'Singapore',
                'purchase_address'   => 'ION Orchard',
                'max_slot'           => 15,
                'base_price'         => $base,
                'jastip_fee'         => $fee,
                'min_buy'            => 1,
                'has_variants'       => false,
                'weight_gram'        => 600,
                'status'             => 'published',
                'allow_requests'     => false,
                'start_date'         => $start->toDateString(),
                'end_date'           => $end->toDateString(),
                'pickup_start_date'  => $ps->toDateString(),
                'pickup_end_date'    => $pe->toDateString(),
                'created_at'         => $now->copy()->subDays(50),
                'updated_at'         => $now,
            ]);

            DB::table('jastip_item_images')->insert(['jastip_item_id' => $itemId, 'image_name' => $image]);

            $variantId = DB::table('jastip_item_variants')->insertGetId([
                'jastip_item_id' => $itemId, 'var_name' => 'Varian', 'var_value' => 'Original',
                'additional_price' => 0, 'stock' => 15, 'min_buy' => 1, 'image_name' => null,
                'created_at' => $now, 'updated_at' => $now,
            ]);

            // Pembelian berbayar oleh veteran.
            $this->paidJastipOrder($veteran->id, $itemId, $variantId, $base + $fee, $now->copy()->subDays(30));

            // Baseline pembeli lain + (untuk yang selesai) ulasan dari mereka.
            foreach ($others as $uid) {
                $this->paidJastipOrder($uid, $itemId, $variantId, $base + $fee, $now->copy()->subDays(35));
                if ($phase === 'finish') {
                    DB::table('user_ratings')->insert([
                        'user_id' => $uid, 'rated_user_id' => $admin->id, 'type' => 'jastiper',
                        'rating_amount' => 5, 'comment' => 'Amanah, barang ori & cepat. Recommended!',
                        'created_at' => $now->copy()->subDays(5), 'updated_at' => $now,
                    ]);
                }
            }

            // Grup jastip untuk yang siap diambil: kartu "ambil barang" menyusul
            // otomatis saat grup dibuka (track_shared_at dibiarkan kosong).
            if ($phase === 'pickup') {
                $conversationId = DB::table('conversations')->insertGetId([
                    'trip_id' => null, 'pergi_bareng_id' => null, 'jastip_item_id' => $itemId,
                    'is_group' => true, 'created_at' => $now, 'updated_at' => $now,
                ]);
                foreach (array_merge([$admin->id, $veteran->id], $others) as $uid) {
                    DB::table('conversation_participants')->insert([
                        'conversation_id' => $conversationId, 'user_id' => $uid,
                        'last_read_at' => $now, 'created_at' => $now, 'updated_at' => $now,
                    ]);
                }
            }
        }
    }

    private function paidJastipOrder(int $buyerId, int $itemId, int $variantId, float $total, Carbon $at): void
    {
        $txId = (string) Str::uuid();
        DB::table('transactions')->insert([
            'id' => $txId, 'user_id' => $buyerId, 'total_amount' => $total,
            'type' => 'jastip', 'payment_method' => 'Midtrans',
            'expired_at' => $at->copy()->addDay(), 'created_at' => $at, 'updated_at' => $at,
        ]);
        $orderId = DB::table('jastip_orders')->insertGetId([
            'transaction_id' => $txId, 'use_shipping' => false, 'shipping_address' => '-',
            'order_status' => 'paid', 'created_at' => $at, 'updated_at' => $at,
        ]);
        DB::table('jastip_order_items')->insert([
            'jastip_order_id' => $orderId, 'jastip_item_id' => $itemId,
            'jastip_item_variant_id' => $variantId, 'quantity' => 1,
            'created_at' => $at, 'updated_at' => $at,
        ]);
    }

    // [start, end, pickupStart, pickupEnd] untuk status jastiper yang diminta.
    private function jastipDates(string $phase, Carbon $now): array
    {
        if ($phase === 'finish') {
            return [
                $now->copy()->subDays(70), $now->copy()->subDays(45),
                $now->copy()->subDays(25), $now->copy()->subDays(8),
            ];
        }
        // pickup -> sedang masa pengambilan
        return [
            $now->copy()->subDays(40), $now->copy()->subDays(18),
            $now->copy()->subDays(2), $now->copy()->addDays(6),
        ];
    }

    private function report(string $tripName, array $pergiNames, array $jastipNames): void
    {
        $line = str_repeat('=', 64);
        $this->command?->info($line);
        $this->command?->info('VeteranUserSeeder: akun "user lama" berhasil dibuat.');
        $this->command?->info('  Username : ' . self::USERNAME . '  (email: ' . self::EMAIL . ')');
        $this->command?->info('  Password : ' . self::PASSWORD);
        $this->command?->info('  Semua item diselenggarakan oleh admin@barengin.com.');
        $this->command?->info('  Trip (selesai, bisa direview):');
        $this->command?->info('    - ' . $tripName);
        $this->command?->info('  Pergi Bareng:');
        $this->command?->info('    - ' . $pergiNames[0] . ' [berlangsung]');
        $this->command?->info('    - ' . $pergiNames[1] . ' [selesai, bisa direview]');
        $this->command?->info('  Jastip:');
        $this->command?->info('    - ' . $jastipNames[0] . ' [siap diambil]');
        $this->command?->info('    - ' . $jastipNames[1] . ' [siap diambil]');
        $this->command?->info('    - ' . $jastipNames[2] . ' [selesai, bisa direview]');
        $this->command?->info($line);
    }
}
