<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuideRatingTrip extends Model
{
    protected $fillable = ['user_id', 'trip_id', 'trip_order_id', 'amount_rating', 'comment'];
    protected function casts(){
        return [
            'amount_rating' => 'decimal:2'
        ];
    }

    public function trip(){
        return $this->belongsTo(Trip::class);
    }
    
    public function user(){
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function trip_order(){
        return $this->belongsTo(TripOrder::class);
    }
}
