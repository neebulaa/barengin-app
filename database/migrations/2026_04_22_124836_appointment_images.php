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
        Schema::create('appointment_images', function(Blueprint $table){
            $table->id();
            $table->foreignId('pergi_bareng_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->string('appo_img_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_images');
    }
};
