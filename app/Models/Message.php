<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'reply_to_id',
        'message_text',
        'attachment_path',
        'attachment_type',
        'attachment_name',
        'attachment_size',
        'attachments',
    ];

    protected $casts = [
        'attachments' => 'array',
    ];

    public function conversation(){
        return $this->belongsTo(Conversation::class);
    }

    public function sender(){
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function replyTo(){
        return $this->belongsTo(Message::class, 'reply_to_id');
    }
}
