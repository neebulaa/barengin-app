<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JastipOrderFee extends Model
{
    protected $fillable = [
        'jastip_order_id', 'fee_name', 'amount'
    ];

    protected function casts()
    {
        return [
            'amount' => 'decimal:2'
        ];
    }

    public function jastip_order(){
        return $this->belongsTo(JastipOrder::class);
    }
}
