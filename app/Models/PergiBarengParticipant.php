<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PergiBarengParticipant extends Model
{
    protected $fillable = ['pergi_bareng_id', 'full_name', 'full_name', 'paspor', 'phone_number', 'nik'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function pergi_bareng(){
        return $this->belongsTo(PergiBareng::class ,'pergi_bareng_id');
    }
}