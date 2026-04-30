<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JastiperRating extends Model
{
    protected $fillable = [
        'user_id', 'jastip_id', 'amount_rating', 'comment'
    ];

    protected function casts()
    {
        return [
            'amount_rating' => 'decimal:2'
        ];
    }

    public function user(){
        return $this->belongsTo(User::class, 'user_id','user_id');
    }

    public function jastip(){
        return $this->belongsTo(Jastip::class);
    }
}
