<?php

namespace Database\Seeders;

use App\Models\PergiBareng;
use App\Services\Chat\GroupConversationService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

// Pastikan tiap pergi bareng berpeserta punya grup chat berisi penyelenggara &
// seluruh pesertanya.
//
// Di aplikasi nyata ini sudah otomatis: store() membuat grup sejak perjalanan
// dibuat, dan approve() melampirkan peserta yang disetujui. Tapi beberapa seeder
// menyisipkan langsung ke pergi_bareng_participants sehingga melewati kedua jalur
// itu - hasilnya peserta hasil seed tidak pernah muncul di grup.
//
// Ditaruh sebagai satu langkah penyapu (bukan ditempel di tiap seeder) supaya
// seeder baru yang menambah peserta pun ikut tercakup tanpa perlu diingat.
class PergiBarengGroupSyncSeeder extends Seeder
{
    public function run(): void
    {
        $service = new GroupConversationService();

        $tripIds = DB::table('pergi_bareng_participants')
            ->distinct()
            ->pluck('pergi_bareng_id');

        $groups = 0;
        $attached = 0;

        foreach ($tripIds as $tripId) {
            if (! PergiBareng::whereKey($tripId)->exists()) {
                continue;
            }

            $added = $service->syncPergiBarengGroupMembers((int) $tripId);

            if ($added > 0) {
                $groups++;
                $attached += $added;
            }
        }

        $this->command?->info("PergiBarengGroupSyncSeeder: {$attached} peserta dimasukkan ke {$groups} grup pergi bareng.");
    }
}
