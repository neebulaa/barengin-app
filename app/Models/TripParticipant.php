<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripParticipant extends Model
{
    protected $fillable = ['trip_order_id', 'user_id', 'full_name', 'paspor', 'phone_number', 'nik'];

    public function trip_order(){
        return $this->belongsTo(TripOrder::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
