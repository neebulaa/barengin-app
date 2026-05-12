<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Faker\Factory as Faker;

class TripSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('id_ID');

        // 1. Buat 5 User Guider & 10 User Customer
        $guiderIds = [];
        for ($i = 0; $i < 5; $i++) {
            $guiderIds[] = DB::table('users')->insertGetId([
                'full_name' => $faker->name,
                'username' => $faker->unique()->userName,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password'),
                'gender' => $faker->randomElement(['male', 'female']),
                'is_guider' => true,
                'onboarding_completed' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $customerIds = [];
        for ($i = 0; $i < 10; $i++) {
            $customerIds[] = DB::table('users')->insertGetId([
                'full_name' => $faker->name,
                'username' => $faker->unique()->userName,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password'),
                'gender' => $faker->randomElement(['male', 'female']),
                'onboarding_completed' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Buat Data Fasilitas Master
        $facilityIds = [
            DB::table('facilities')->insertGetId(['name' => 'Transportasi AC', 'slug' => 'transportasi-ac', 'created_at' => now()]),
            DB::table('facilities')->insertGetId(['name' => 'Penginapan Hotel', 'slug' => 'penginapan-hotel', 'created_at' => now()]),
            DB::table('facilities')->insertGetId(['name' => 'Makan 3x Sehari', 'slug' => 'makan-3x-sehari', 'created_at' => now()]),
            DB::table('facilities')->insertGetId(['name' => 'Tiket Wisata', 'slug' => 'tiket-wisata', 'created_at' => now()]),
            DB::table('facilities')->insertGetId(['name' => 'Dokumentasi', 'slug' => 'dokumentasi', 'created_at' => now()]),
        ];

        // 3. Looping 10 Kali untuk membuat 10 Trip berserta relasinya
        for ($i = 1; $i <= 10; $i++) {
            
            $startDate = Carbon::parse($faker->dateTimeBetween('+1 month', '+3 months'));
            $endDate = (clone $startDate)->addDays($faker->numberBetween(2, 5));
            $price = $faker->randomElement([1500000, 2500000, 3800000, 4500000, 5000000]);
            $customerId = $faker->randomElement($customerIds);

            // A. Tabel Trips
            $tripId = DB::table('trips')->insertGetId([
                'guider_id' => $faker->randomElement($guiderIds),
                'name' => 'Trip ' . $faker->city . ' ' . $faker->citySuffix,
                'description' => $faker->paragraph(4),
                'people_amount' => $faker->numberBetween(15, 30),
                'start_date' => $startDate,
                'end_date' => $endDate,
                'price' => $price,
                'image' => '/assets/trips/bromo.jpg', // Placeholder gambar
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // B. Pivot Trip_Facilities (Ambil 3 fasilitas acak untuk tiap trip)
            $randomFacilities = $faker->randomElements($facilityIds, 3);
            foreach ($randomFacilities as $facId) {
                DB::table('trip_facilities')->insert([
                    'trip_id' => $tripId,
                    'facility_id' => $facId,
                    'created_at' => now(),
                ]);
            }

            // C. Trip Activities (Itinerary) & Image Activities
            for ($act = 1; $act <= 3; $act++) {
                $actStart = (clone $startDate)->addHours($act * 5);
                $actEnd = (clone $actStart)->addHours(2);

                $activityId = DB::table('trip_activities')->insertGetId([
                    'trip_id' => $tripId,
                    'activity_order' => $act,
                    'activity_name' => $faker->sentence(3),
                    'activity_start_datetime' => $actStart,
                    'activity_end_datetime' => $actEnd,
                    'activity_description' => $faker->paragraph(2),
                    'created_at' => now(),
                ]);

                // 2 Gambar per aktivitas
                DB::table('image_activities')->insert([
                    ['trip_activity_id' => $activityId, 'activity_img_name' => '/assets/trips/bromo1.jpg', 'created_at' => now()],
                    ['trip_activity_id' => $activityId, 'activity_img_name' => '/assets/trips/bromo2.jpg', 'created_at' => now()],
                ]);
            }

            // D. Transactions (UUID)
            $transactionId = Str::uuid()->toString();
            $qty = $faker->numberBetween(1, 3);
            $totalAmount = ($price * $qty) + 10000; // ditambah asumsi fee

            DB::table('transactions')->insert([
                'id' => $transactionId,
                'user_id' => $customerId,
                'total_amount' => $totalAmount,
                'type' => 'trip',
                'payment_method' => $faker->randomElement(['BCA Virtual Account', 'QRIS', 'GoPay']),
                'va_number' => $faker->numerify('###########'),
                'expired_at' => now()->addHours(24),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // E. Trip Orders
            $tripOrderId = DB::table('trip_orders')->insertGetId([
                'transaction_id' => $transactionId,
                'trip_id' => $tripId,
                'user_id' => $customerId,
                'quantity' => $qty,
                'total' => $price * $qty,
                'order_status' => $faker->randomElement(['paid', 'pending']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // F. Trip Order Fees
            DB::table('trip_order_fees')->insert([
                ['trip_order_id' => $tripOrderId, 'fee_name' => 'Biaya Layanan', 'amount' => 5000.00, 'created_at' => now()],
                ['trip_order_id' => $tripOrderId, 'fee_name' => 'Biaya Asuransi Trip', 'amount' => 5000.00, 'created_at' => now()],
            ]);

            // G. Trip Participants (sebanyak $qty)
            for ($p = 1; $p <= $qty; $p++) {
                DB::table('trip_participants')->insert([
                    'trip_id' => $tripId,
                    'full_name' => $faker->name,
                    'paspor' => null,
                    'phone_number' => '+628' . $faker->numerify('##########'),
                    'nik' => $faker->numerify('320#############'),
                    'created_at' => now(),
                ]);
            }
        }
    }
}