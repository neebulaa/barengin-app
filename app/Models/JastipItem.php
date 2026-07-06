<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JastipItem extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';

    protected $fillable = [
        'user_id', 'jastip_id', 'name', 'brand', 'category', 'description',
        'max_slot', 'base_price', 'jastip_fee', 'min_buy', 'weight_gram',
        'status', 'start_date', 'end_date',
    ];

    protected function casts()
    {
        return [
            'base_price'  => 'decimal:2',
            'jastip_fee'  => 'decimal:2',
            'weight_gram' => 'decimal:2',
            'start_date'  => 'date',
            'end_date'    => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function jastip()
    {
        return $this->belongsTo(Jastip::class);
    }

    public function jastip_item_images()
    {
        return $this->hasMany(JastipItemImage::class);
    }

    public function jastip_item_variants()
    {
        return $this->hasMany(JastipItemVariant::class);
    }

    public function jastip_order_items()
    {
        return $this->hasMany(JastipOrderItem::class);
    }

    // ── Helpers ──────────────────────────────────────────────

    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    /** Harga total = harga dasar + biaya jastip (belum termasuk varian). */
    public function totalPrice(): float
    {
        return (float) $this->base_price + (float) $this->jastip_fee;
    }
}
