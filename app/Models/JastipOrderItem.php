<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JastipOrderItem extends Model
{
    protected $fillable = ['jastip_order_id', 'jastip_item_id', 'jastip_item_variant_id', 'quantity'];

    public function jastip_item(){
        return $this->belongsTo(JastipItem::class);
    }

    public function jastip_item_variant(){
        return $this->belongsTo(JastipItemVariant::class);
    }

    public function jastip_order(){
        return $this->belongsTo(JastipOrder::class);
    }
}
