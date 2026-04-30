<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingJastip extends Model
{
    protected $fillable = [
        'jastip_order_id', 'shipping_method', 'shipping_cost'
    ];

    protected function casts()
    {
        return [
            'shipping_cost' => 'decimal:2'
        ];
    }

    public function jastip_order(){
        return $this->belongsTo(JastipOrder::class);
    }
}
