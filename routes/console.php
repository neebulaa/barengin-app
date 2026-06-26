<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Perbarui status trip setiap jam (terjadwal -> berlangsung -> selesai).
// Pastikan cron sistem menjalankan `php artisan schedule:run` tiap menit.
Schedule::command('trips:refresh-statuses')->hourly();
