<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'trip_id', 'pergi_bareng_id', 'is_group'
    ];

    public function trip(){
        return $this->belongsTo(Trip::class);
    }

    public function pergi_bareng(){
        return $this->belongsTo(PergiBareng::class);
    }

    public function messages(){
        return $this->hasMany(Message::class);
    }

    public function conversation_participants(){
        return $this->hasMany(ConversationParticipant::class);
    }
}
