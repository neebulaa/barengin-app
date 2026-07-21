<?php

namespace Database\Seeders;
use Database\Seeders\PostSeeder;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;
    public function run(): void
    {
        $this->call([
            LanguageSeeder::class,
            TagSeeder::class,
            UsersSeeder::class,
            PostSeeder::class,
            PostTagSeeder::class,
            ChatSeeder::class,
            TripSeeder::class,
            TripFacilitySeeder::class,
            PergiBarengSeeder::class,
            FinancingEstimateSeeder::class,
            TripParticipantSeeder::class,
            JastipCategorySeeder::class,
            JastipCatalogSeeder::class,
            AdminHistorySeeder::class,
            // Contoh data satu-per-status (dipakai untuk mengecek tampilan tiap
            // status di halaman managemen); dijalankan terakhir agar tidak
            // mengganggu urutan id data utama.
            JastipStatusSeeder::class,
            PergiBarengStatusSeeder::class,
            TripStatusSeeder::class,
            // "User lama" yang mengikuti banyak layanan admin (untuk simulasi
            // review & pantau); dijalankan setelah item admin per-status ada.
            VeteranUserSeeder::class,
            // Backfill rincian peserta per kursi untuk SEMUA pesanan trip yang
            // masih kosong; ditaruh terakhir agar mencakup data seeder di atas.
            TripSeatDetailSeeder::class,
            // Samakan grup chat pergi bareng dengan daftar pesertanya - seeder di
            // atas menyisipkan peserta langsung, melewati store()/approve().
            PergiBarengGroupSyncSeeder::class,
            // ActivityLogSeeder dinonaktifkan: log kegiatan kini terisi otomatis dari
            // aktivitas nyata (login, publish trip, hapus data, dll) via ActivityLog::record().
        ]);
    }
}