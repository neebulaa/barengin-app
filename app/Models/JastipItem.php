<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JastipItem extends Model
{
    protected $fillable = [
        'jastips_id', 'name', 'category', 'description', 'max_slot', 'base_price', 'min_buy', 'weight_gram'
    ];

    public function jastip(){
        return $this->belongsTo(Jastip::class);
    }

    public function jastip_item_images(){
        return $this->hasMany(JastipItemImage::class);
    }

    public function jastip_item_variants(){
        return $this->hasMany(JastipItemVariant::class);
    }

    public function jastip_orders(){
        return $this->hasMany(JastipOrder::class);
    }
}
