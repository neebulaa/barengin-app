<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jastips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade')->onUpdate('cascade');
            $table->string('origin_city');
            $table->string('destination_city');
            $table->text('pickup_location');
            $table->dateTime('arrival_date');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->boolean('allow_pickup');
            $table->boolean('allow_delivery');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jastips');
    }
};
