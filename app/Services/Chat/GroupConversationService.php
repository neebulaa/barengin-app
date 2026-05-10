<?php

namespace App\Services\Chat;

use App\Models\Conversation;
use App\Models\User;

class GroupConversationService{
    public function joinTripConversation(User $user, int $tripId){
        $conversation = Conversation::firstOrCreate([
            'trip_id' => $tripId,
            'pergi_bareng_id' => null,
            'is_group' => true,
        ]);

        if (! $conversation->participants()->where('users.id', $user->id)->exists()) {
            $conversation->participants()->attach($user->id, ['last_read_at' => now()]);
        }

        return $conversation;
    }

    public function joinPergiBarengConversation(User $user, int $perbarId){
        $conversation = Conversation::firstOrCreate([
            'trip_id' => null,
            'pergi_bareng_id' => $perbarId,
            'is_group' => true,
        ]);

        if (! $conversation->participants()->where('users.id', $user->id)->exists()) {
            $conversation->participants()->attach($user->id, ['last_read_at' => now()]);
        }

        return $conversation;
    }
}
