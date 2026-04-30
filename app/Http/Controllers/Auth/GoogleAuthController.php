<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class GoogleAuthController extends Controller
{
    public function redirect(): SymfonyRedirectResponse
    {
        $url = Socialite::driver('google')->redirect()->getTargetUrl();
        return Inertia::location($url);
    }

    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            return redirect('/login')->with('flash', [
                'type' => 'error',
                'message' => 'Login Google gagal. Silakan coba lagi.',
            ]);
        }

        $googleId = $googleUser->getId();
        $email = $googleUser->getEmail();

        if (!$email) {
            return redirect('/login')->with('flash', [
                'type' => 'error',
                'message' => 'Email Google tidak tersedia. Gunakan akun Google lain.',
            ]);
        }

        // Cari user berdasarkan google_id atau email untuk linking akun
        $user = User::query()
            ->where('google_id', $googleId)
            ->orWhere('email', $email)
            ->first();

        $isNewUser = false;

        if (!$user) {
            $user = User::create([
                'full_name' => $googleUser->getName() ?: 'User',
                'username' => $this->generateUniqueUsername($email),
                'email' => $email,
                'password' => Hash::make(str()->random(32)),
                'google_id' => $googleId,
                'profile_image' => $googleUser->getAvatar(),
                'onboarding_completed' => false,
            ]);

            $isNewUser = true;
        } else {
            // Link akun lama dengan Google jika belum ada
            $user->update([
                'google_id' => $user->google_id ?: $googleId,
                'profile_image' => $user->profile_image ?: $googleUser->getAvatar(),
            ]);
        }

        Auth::login($user, true);

        ActivityLog::create([
            'user_id' => $user->user_id,
            'action' => $isNewUser ? 'user.registered_google' : 'user.login_google',
            'meta' => json_encode([
                'username' => $user->username,
                'email' => $user->email,
            ]),
        ]);

        // Flow onboarding
        if ($isNewUser || !$user->onboarding_completed) {
            return redirect('/onboarding');
        }

        return redirect()->intended('/');
    }

    private function generateUniqueUsername(string $email): string
    {
        $localPart = strtolower(explode('@', $email)[0] ?? 'user');

        $base = preg_replace('/[^a-z0-9_.]/', '_', $localPart);
        $base = preg_replace('/_+/', '_', $base); // collapse underscores
        $base = trim($base, '_.');

        if ($base === '') {
            $base = 'user';
        }

        $maxLength = 20;
        $base = substr($base, 0, $maxLength);

        $username = $base;
        $counter = 1;

        while (User::where('username', $username)->exists()) {
            $suffix = (string) $counter++;
            $username = substr($base, 0, $maxLength - strlen($suffix)) . $suffix;
        }

        return $username;
    }
}