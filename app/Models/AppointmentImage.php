<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentImage extends Model
{
    protected $fillable = ['pergi_bareng_id', 'appo_img_name'];
    public function pergi_bareng(){
        return $this->belongsTo(PergiBareng::class);
    }
}
