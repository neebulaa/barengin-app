<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('online', function ($user) {
    return [
        'id' => $user->id,
        'name' => $user->full_name,
        'avatar' => $user->public_profile_image,
    ];
});

Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = Conversation::find($conversationId);
    if (! $conversation) return false;

    return $conversation->participants()->where('users.id', $user->id)->exists();
});