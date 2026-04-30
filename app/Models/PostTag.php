<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostTag extends Model
{
    protected $fillable =[
        'tag_id', 'post_id'
    ];

    public function tag(){
        return $this->belongsTo(Tag::class);
    }

    public function post(){
        return $this->belongsTo(Post::class);
    }
}
