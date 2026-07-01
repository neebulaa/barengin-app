<?php

namespace App\Http\Controllers;

use App\Models\Language;
use Inertia\Inertia;

class AdminLanguageController extends Controller
{
    public function index()
    {
        $languages = Language::orderBy('sort_order')->get();

        return Inertia::render('Admin/Languages', [
            'languages' => $languages,
        ]);
    }

    public function toggle(Language $language)
    {
        // Bahasa default wajib selalu aktif
        if ($language->is_default) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Bahasa default tidak bisa dinonaktifkan.',
            ]);
        }

        // Minimal satu bahasa harus tetap aktif
        if ($language->is_active && Language::where('is_active', true)->count() <= 1) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Minimal satu bahasa harus aktif.',
            ]);
        }

        $language->is_active = ! $language->is_active;
        $language->save();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Bahasa "' . $language->name . '" berhasil ' . ($language->is_active ? 'diaktifkan' : 'dinonaktifkan') . '.',
        ]);
    }
}
