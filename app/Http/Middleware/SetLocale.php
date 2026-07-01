<?php

namespace App\Http\Middleware;

use App\Models\Language;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Menentukan bahasa aktif dari session, divalidasi terhadap daftar bahasa yang
 * aktif di DB. Jatuh ke bahasa default bila tidak valid.
 */
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $active = Language::where('is_active', true)->pluck('code')->all();

            $default = Language::where('is_default', true)->value('code')
                ?? Language::where('is_active', true)->orderBy('sort_order')->value('code')
                ?? config('app.locale', 'id');

            $sessionLocale = $request->session()->get('locale');
            $locale = ($sessionLocale && in_array($sessionLocale, $active, true))
                ? $sessionLocale
                : $default;

            app()->setLocale($locale);
        } catch (\Throwable $e) {
            // Tabel languages belum ada (mis. saat migrasi) -> pakai default config
            app()->setLocale(config('app.locale', 'id'));
        }

        return $next($request);
    }
}
