<?php

namespace App\Http\Controllers\Chat;

use App\Events\ConversationRead;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatReadController extends Controller
{
    public function markAsRead(Request $request, Conversation $conversation)
    {
        $user = Auth::user();

        abort_unless(
            $conversation->participants()->where('users.id', $user->id)->exists(),
            403
        );

        $conversation->participants()->updateExistingPivot($user->id, [
            'last_read_at' => now(),
        ]);

        broadcast(new ConversationRead($conversation, $user, now()->toISOString()))->toOthers();

        return response()->json(['ok' => true]);
    }
}