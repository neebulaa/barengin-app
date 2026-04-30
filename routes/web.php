<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GoogleAuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\OnboardingController;



Route::get('/', function(){
    return inertia('Home/Index');
});

Route::get('/prever', function(){
    return 'login';
})->middleware('auth');


    Route::get('/onboarding', [OnboardingController::class, 'onboarding'])->name('onboarding.index');
    Route::post('/onboarding', [OnboardingController::class, 'setupProfile']);
    Route::post('/onboarding/complete', [OnboardingController::class, 'completeOnboarding']);
    

Route::middleware('guest')->group(function(){

    Route::get('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/forgot-password', [AuthController::class, 'sendResetLink'])->middleware('throttle:5,1')->name('password.email');
    Route::get('/reset-password/{token}', [AuthController::class, 'resetPassword'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'updatePassword'])->name('password.update');
    
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'authenticate']);
    Route::get('/sign-up', [AuthController::class, 'signup']);
    Route::post('/sign-up', [AuthController::class, 'register']);


    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])
    ->name('auth.google.redirect');

    Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->name('auth.google.callback');
    
});