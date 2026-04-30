<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripOrderFee extends Model
{
    protected $fillable = ['trip_order_id', 'fee_name', 'amount'];
    protected function casts()
    {
        return [
            'amount' => 'decimal:2'
        ];
    }

    public function trip_order(){
        return $this->belongsTo(TripOrder::class);
    }
}
