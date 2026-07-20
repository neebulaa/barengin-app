<?php

namespace App\Console\Commands;

use App\Models\Trip;
use App\Services\Chat\GroupConversationService;
use Illuminate\Console\Command;

class SyncTripGroupMembers extends Command
{
    protected $signature = 'trips:sync-group-members {--trip= : Hanya sinkronkan satu trip berdasarkan ID}';

    protected $description = 'Pastikan semua peserta trip berbayar (run aktif) menjadi anggota grup chat trip-nya';

    public function handle(GroupConversationService $service): int
    {
        $trips = Trip::query()
            ->when($this->option('trip'), fn ($q) => $q->where('id', (int) $this->option('trip')))
            ->pluck('id');

        $totalAdded = 0;
        foreach ($trips as $id) {
            $added = $service->syncTripGroupMembers((int) $id);
            $totalAdded += $added;
            if ($added > 0) {
                $this->line("Trip #{$id}: +{$added} anggota ditambahkan.");
            }
        }

        $this->info("Selesai. {$totalAdded} anggota ditambahkan ke {$trips->count()} grup trip.");

        return self::SUCCESS;
    }
}
