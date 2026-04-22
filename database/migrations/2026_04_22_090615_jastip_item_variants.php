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
        Schema::create('jastip_item_variants', function(Blueprint $table){
            $table->id();
            $table->foreignId('jastip_items_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->string('var_name');
            $table->string('var_value');
            $table->decimal('additioanl_price', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jastip_item_variants');
    }
};
