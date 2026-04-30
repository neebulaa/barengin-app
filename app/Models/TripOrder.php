<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripOrder extends Model
{
    protected $fillable = ['transaction_id', 'trip_id', 'quantity','total', 'order_status'];

    public function transaction(){
        return $this->belongsTo(Transaction::class);
    }

    public function trip(){
        return $this->belongsTo(Trip::class);
    }

    public function trip_order_fees(){
        return $this->hasMany(TripOrderFee::class);
    }

    public function trip_participants(){
        return $this->hasMany(TripParticipant::class);
    }

    public function guide_rating_trip(){
        return $this->hasOne(GuideRatingTrip::class);
    }
}
