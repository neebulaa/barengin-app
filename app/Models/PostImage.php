<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostImage extends Model
{
    protected $fillable =[
        'post_id', 'img_name'
    ];

    public function post(){
        return $this->belongsTo(Post::class);
    }
}
