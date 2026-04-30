<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    protected $fillable = [
        'follower_id', 'following_id'
    ];

    public function follower(){
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function following(){
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
