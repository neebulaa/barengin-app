<?php

namespace App\Console\Commands;

use App\Models\Trip;
use Illuminate\Console\Command;

class RefreshTripStatuses extends Command
{
    protected $signature = 'trips:refresh-statuses';

    protected $description = 'Perbarui status trip (terjadwal -> berlangsung -> selesai) berdasarkan tanggal trip';

    public function handle(): int
    {
        $changed = Trip::refreshStatuses();
        $this->info("Status trip diperbarui: {$changed} trip berubah.");

        return self::SUCCESS;
    }
}
