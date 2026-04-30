<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


class OnboardingController extends Controller
{
    public function onboarding()
    {
        $user = Auth::user();
        return Inertia::render('Auth/Onboarding', [
            'user' => [
                'full_name' => $user->full_name,
                'phone' => $user->phone,
                'gender' => $user->gender,
                'birth_date' => $user->birth_date,
            ],
        ]);
    }

    private function normalizePhone(?string $phone): ?string
    {
        if (!$phone) {
            return null;
        }

        $phone = preg_replace('/[^\d+]/', '', $phone);
        $phone = preg_replace('/^(?:\+62|62|0)/', '', $phone);
        if (!$phone) {
            return null;
        }
        return '+62' . $phone;
    }

    public function setupProfile(Request $request)
    {
        $validated = $request -> validate([
            'full_name' => ['required', 'string', 'max:50'],
            'phone' => ['nullable', 'regex:/^(?:\+62|62|0)?8\d{8,12}$/'],
            'gender' => ['in:male,female'],
            'birth_date' => ['nullable', 'date', 'before:today'],
        ]);

        $user = Auth::user();
        $phone = $this->normalizePhone($validated['phone'] ?? null);

        if($phone){
            $request->merge(['phone' => $phone]);

            $request->validate([
                'phone' => 'unique:users,phone,' . $user->user_id . ',user_id',
            ]);
        }

        $user->update([
            'full_name' => $validated['full_name'],
            'phone' => $phone,
            'gender' => $validated['gender'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
        ]);

        return redirect('/')->with('flash', [
            'type' => 'success',
            'message' => 'Profil Berhasil diperbarui',
        ]);
    }
    
    public function completeOnboarding()
    {
        $user = Auth::user();

        $user->update([
            'onboarding_completed' => true,
        ]);

        return redirect('/')->with('flash', [
            'type' => 'success',
            'message' => 'Onboarding selesai. Selamat datang!',
        ]);
    }

    public function skipOnboarding()
    {
        $user = Auth::user();

        $user->update([
            'onboarding_completed' => true,
        ]);

        return redirect('/')->with('flash', [
            'type' => 'info',
            'message' => 'Onboarding dilewati.',
        ]);
    }
}

