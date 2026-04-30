<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostCommand extends Model
{
    protected $fillable =[
        'post_id', 'user_id', 'parent_id', 'comment_text', 'like'
    ];

    public function post(){
        return $this->belongsTo(Post::class);
    }

    public function user(){
        return $this->belongsTo(User::class, 'user_id','user_id');
    }

    public function parent(){
        return $this->belongsTo(User::class, 'user_id','user_id');
    }
}
