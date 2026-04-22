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
        Schema::create('shipping_jastips', function(Blueprint $table){
            $table->id();
            $table->foreignId('jastip_orders_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->enum('order_status', ['pickup' ,'delivery']);
            $table->decimal('shipping_cost', 15,2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('');
    }
};
