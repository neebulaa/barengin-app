<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\OnboardingController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\TripsController;
use App\Http\Controllers\PostController;

Route::get('/', function () {
    return inertia('Home/Index');
})->name('home');

/*
|--------------------------------------------------------------------------
| Guest routes
|--------------------------------------------------------------------------
*/
// Auth
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'authenticate'])->name('login.store');

    Route::get('/register', [AuthController::class, 'signup'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.store');

    // Forgot / Reset password
    Route::get('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLink'])
        ->middleware('throttle:5,1')
        ->name('password.email');

    Route::post('/forgot-password/resend', [AuthController::class, 'sendResetLink'])
        ->middleware('throttle:5,1')
        ->name('password.email.resend');

    Route::get('/reset-password/{token}', [AuthController::class, 'resetPassword'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'updatePassword'])->name('password.update');

    // Google OAuth
    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('auth.google.redirect');
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');
});

/*
|--------------------------------------------------------------------------
| Authenticated routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    // Onboarding
    Route::get('/onboarding', [OnboardingController::class, 'onboarding'])->name('onboarding.index');
    Route::post('/onboarding', [OnboardingController::class, 'setupProfile'])->name('onboarding.store');
    Route::post('/onboarding/complete', [OnboardingController::class, 'completeOnboarding'])->name('onboarding.complete');

    // Logout 
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Forum
    Route::get('/forum', [ForumController::class, 'index'])->name('forum.index');
    Route::get('/forum/posts/{id}', [ForumController::class, 'show'])
        ->whereNumber('id')
        ->name('forum.show');

    Route::post('/forum/posts', [PostController::class, 'store'])->name('forum.posts.store');
    
    Route::post('/forum/posts/{post}/comments', [ForumController::class, 'storeComment'])
        ->name('forum.posts.comments.store');
    Route::post('/forum/comments/{comment}/replies', [ForumController::class, 'storeReply'])
        ->name('forum.comments.replies.store');

    Route::post('/forum/posts/{post}/like', [ForumController::class, 'togglePostLike'])
        ->name('forum.posts.like.toggle');

    Route::post('/forum/comments/{comment}/like', [ForumController::class, 'toggleCommentLike'])
        ->name('forum.comments.like.toggle');
});
   
Route ::get('/pergi-bareng',function(){
    return inertia('PergiBareng/Index');
})->name('pergi-bareng');

Route::get('/leaderboard', function () {
    return inertia('Leaderboard/Index');
})->name('leaderboard');
Route::get('/forum', [ForumController::class, 'index'])->name('forum.index');
Route::get('/forum/posts/{id}', [ForumController::class, 'show'])
    ->whereNumber('id')
    ->name('forum.show');


Route::get('/trip-bareng', [TripsController::class, 'index'])->name('trip-bareng');
Route::get('/trip-bareng/{id}', [TripsController::class, 'show'])->name('trip-bareng.show');
Route::get('/trip-bareng/{id}/checkout', [TripsController::class, 'checkout'])->name('trip-bareng.checkout');
Route::get('/trip-bareng/{id}/payment', [TripsController::class, 'payment'])->name('trip-bareng.payment');
Route::get('/trip-bareng/{id}/success', [\App\Http\Controllers\TripsController::class, 'success'])->name('trip-bareng.success');
