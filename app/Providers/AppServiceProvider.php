<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // F-04 - Pengaman berlapis: di lingkungan production, PAKSA debug mati
        // apa pun isi APP_DEBUG. Ini mencegah kebocoran stack trace / path
        // server bila .env produksi salah dikonfigurasi (APP_DEBUG=true).
        // Sumber kebenaran tetap APP_DEBUG=false di .env server produksi.
        if ($this->app->environment('production')) {
            config(['app.debug' => false]);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
