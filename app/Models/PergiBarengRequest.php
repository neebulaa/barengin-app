<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PergiBarengRequest extends Model
{
    protected $fillable = ['pergi_bareng_id', 'user_id', 'quantity'];

    public function pergi_bareng(){
        return $this->belongsTo(PergiBareng::class);
    }

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
