<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable =[
        'tag_name',
        'tag_key',
    ];

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'post_tags');
    }
}
