<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $fillable = ['name', 'description', 'people_amount', 'start_date', 'end_date', 'rating', 'price'];
    protected function casts(){
        return[
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'rating' => 'decimal:2'
        ];
    }

    public function detail_trips(){
        return $this->hasMany(DetailTrip::class);
    }

    public function facilities(){
        return $this->hasMany(Facilitiy::class);
    }

    public function guide_rating_trips(){
        return $this->hasMany(GuideRatingTrip::class);
    }

    public function trip_orders(){
        return $this->hasMany(TripOrder::class);
    }

}
