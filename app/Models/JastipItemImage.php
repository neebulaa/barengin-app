<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JastipItemImage extends Model
{
    protected $fillable = [
        'jastip_item_id', 'image_name'
    ];

    public function jastip_item(){
        return $this->belongsTo(JastipItem::class);
    }
}
