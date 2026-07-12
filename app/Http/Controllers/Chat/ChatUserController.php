<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\FuzzySearch;
use Illuminate\Http\Request;

class ChatUserController extends Controller
{
    public function index(Request $request){
        $me = $request->user();

        $q = trim((string) $request->query('q', ''));

        $users = User::query()
            ->where('id', '!=', $me->id)
            ->when($q, function ($query) use ($q) {
                FuzzySearch::apply($query, $q, ['full_name', 'username', 'email']);
            })
            ->orderBy('full_name')
            ->limit(50)
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->full_name,
                'username' => $u->username ?? null,
                // Gunakan accessor public_profile_image agar path storage (mis. hasil unggah
                // kamera: "profile-images/xxx.jpg") diubah jadi URL /storage/... yang valid.
                'avatar' => $u->public_profile_image ?? asset('assets/default-profile.png'),
            ]);

        return response()->json([
            'data' => $users,
        ]);
    }
}
