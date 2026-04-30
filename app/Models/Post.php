<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable =[
        'user_id', 'content', 'allows_command', 'location', 'like'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id','user_id');
    }

    public function post_tags(){
        return $this->hasMany(Post::class);
    }

    public function post_images(){
        return $this->hasMany(PostImage::class);
    }

    public function post_command(){
        return $this->hasMany(PostCommand::class);
    }

}
