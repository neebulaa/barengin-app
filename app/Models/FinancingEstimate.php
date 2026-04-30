<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancingEstimate extends Model
{
    protected $fillable = ['pergi_bareng_id', 'name'];
    public function pergi_bareng(){
        return $this->belongsTo(PergiBareng::class);
    }
}
