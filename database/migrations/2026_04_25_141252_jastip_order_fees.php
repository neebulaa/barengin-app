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
        Schema::create('jastip_orders_fees', function(Blueprint $table){
            $table->id();
            $table->foreignId('jastip_order_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->string('fee_name');
            $table->decimal('amount', 15,2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jastip_orders_fees');
    }
};
