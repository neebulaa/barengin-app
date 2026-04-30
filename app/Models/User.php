<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $primaryKey = 'user_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [
        'user_id'
    ];
    

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function guide_ratings(){
        return $this->hasMany(GuideRatingTrip::class);
    }

    public function trip_participants(){
        return $this->hasMany(TripParticipant::class);
    }

    public function pergi_barengs(){
        return $this->hasMany(PergiBareng::class);
    }

    public function pergi_bareng_participants(){
        return $this->hasMany(PergiBarengParticipant::class);
    }

    public function messages(){
        return $this->hasMany(Message::class);
    }

    public function conversation_participants(){
        return $this->hasMany(ConversationParticipant::class);
    }

    public function followers(){ 
        return $this->hasMany(Follow::class);
    }

    public function followings(){
        return $this->hasMany(Follow::class);
    }

    public function posts(){
        return $this->hasMany(Post::class);
    }

    public function post_command_users(){
        return $this->hasMany(PostCommand::class);
    }

    public function post_command_parents(){
        return $this->hasMany(PostCommand::class);
    }

    public function jastips(){
        return $this->hasMany(Jastip::class);
    }

    public function jastiper_ratings(){
        return $this->hasMany(JastiperRating::class);
    }

    public function pergi_bareng_ratings(){
        return $this->hasMany(PergiBarengRating::class);
    }
}
