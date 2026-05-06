<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripActivity extends Model
{
    protected $fillable = ['trip_id','activity_order','activity_name', 'activity_start_datetime', 'activity_end_datetime', 'activity_description'];
    protected function casts(){
        return [
            'activity_start_datetime' => 'datetime',
            'activity_end_datetime' => 'datetime'
        ];
    }

    public function trip(){
        return $this->belongsTo(Trip::class);
    }

    public function image_activities(){
        return $this->hasMany(ImageActivity::class);
    }

    
}
