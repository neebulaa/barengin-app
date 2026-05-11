<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForumFollowController extends Controller
{
    public function toggle(Request $request, string $username)
    {
        $authUser = Auth::user();

        $target = User::query()
            ->where('username', $username)
            ->firstOrFail();

        abort_if($authUser->id === $target->id, 403);

        $existing = Follow::query()
            ->where('follower_id', $authUser->id)
            ->where('following_id', $target->id)
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            Follow::create([
                'follower_id' => $authUser->id,
                'following_id' => $target->id,
            ]);
        }

        return back();
    }
}