<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JastipItemVariant extends Model
{
    protected $fillable = [
        'jastip_item_id', 'var_name', 'var_value', 'additioanl_price'
    ];

    public function jastip_item(){
        return $this->belongsTo(JastipItem::class);
    }

    public function jastip_orders(){
        return $this->hasMany(JastipOrder::class);
    }
}
