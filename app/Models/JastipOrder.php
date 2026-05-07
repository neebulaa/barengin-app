<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JastipOrder extends Model
{
    protected $fillable = [
        'transaction_id', 'use_shipping', 'shipping_address', 'order_status'
    ];

    protected function casts()
    {
        return [
            'total' => 'decimal:2'
        ];
    }
    
    public function transaction(){
        return $this->belongsTo(Transaction::class);
    }

    public function jastip_order_fees(){
        return $this->hasMany(JastipOrderFee::class);
    }

    public function shipping_jastips(){
        return $this->hasMany(ShippingJastip::class);
    }

    public function jastip_order_items(){
        return $this->hasMany(JastipOrderItem::class);
    }
}
