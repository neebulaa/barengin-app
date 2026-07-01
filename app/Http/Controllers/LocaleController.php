<?php

namespace App\Http\Controllers;

use App\Models\Language;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    /**
     * Ganti bahasa aktif (disimpan di session). Hanya menerima bahasa yang aktif.
     */
    public function update(Request $request, string $code)
    {
        $isActive = Language::where('is_active', true)->where('code', $code)->exists();

        if ($isActive) {
            $request->session()->put('locale', $code);
        }

        return back();
    }
}
