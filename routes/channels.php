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