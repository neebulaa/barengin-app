<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailTrip extends Model
{
    protected $fillable = ['trip_id','activity_order','activity_name', 'activity_start_time', 'activity_end_time', 'description_activity'];
    protected function casts(){
        return [
            'activity_start_time' => 'datetime',
            'activity_start_end' => 'datetime'
        ];
    }

    public function trip(){
        return $this->belongsTo(Trip::class);
    }

    public function image_activities(){
        return $this->hasMany(ImageActivity::class);
    }

    
}
