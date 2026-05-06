<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageActivity extends Model
{
    protected $fillable = ['trip_activity_id','activity_img_name'];
    public function detail_trip(){
        return $this->belongsTo(TripActivity::class);
    }
}
