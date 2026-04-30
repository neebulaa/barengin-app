<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JastipOrder extends Model
{
    protected $fillable = [
        'transaction_id', 'jastip_item_id', 'jastip_item_variant_id', 'quantity', 'total', 'use_shipping', 'shipping_address', 'order_status'
    ];

    protected function casts()
    {
        return [
            'total' => 'decimal:2'
        ];
    }

    public function jastip_item(){
        return $this->belongsTo(JastipItem::class);
    }

    public function transaction(){
        return $this->belongsTo(Transaction::class);
    }

    public function jastip_item_variant(){
        return $this->belongsTo(JastipItemVariant::class);
    }

    public function jastip_order_fees(){
        return $this->hasMany(JastipOrderFee::class);
    }

    public function shipping_jastips(){
        return $this->hasMany(ShippingJastip::class);
    }
}
