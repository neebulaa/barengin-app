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
        Schema::create('jastip_item_images', function(Blueprint $table){
            $table->id();
            $table->foreignId('jastip_item_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->string('image_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jastip_item_images');
    }
};
