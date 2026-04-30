<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PergiBareng extends Model
{
    protected $fillable = ['initiator_id', 'name', 'description', 'time_appointment', 'transportation', 'people_amount', 'origin_city', 'destination_city', 'departure_loc', 'destination_loc'];

    protected function casts(){
        return [
            'time_appointment'=> 'datetime'
        ];
    }

    public function initiator(){
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function pergi_bareng_participants(){
        return $this->hasMany(PergiBarengParticipant::class);
    }

    public function financing_estimate(){
        return $this->hasMany(FinancingEstimate::class);
    }

    public function appointment_images(){
        return $this->hasMany(AppointmentImage::class);
    }

    public function conversations(){
        return $this->hasOne(Conversation::class);
    }

    public function pergi_bareng_ratings(){
        return $this->hasMany(PergiBarengRating::class);
    }
    
}
