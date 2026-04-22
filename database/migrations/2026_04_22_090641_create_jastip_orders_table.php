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
        Schema::create('jastip_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('transactions_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('jastip_items_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('jastip_item_variants_id')->constrained();
            $table->integer('quantity');
            $table->decimal('total', 15,2);
            $table->boolean('use_shipping');
            $table->text('shipping_address');
            $table->enum('order_status', ['paid','pending' ,'unpaid']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jastip_orders');
    }
};
