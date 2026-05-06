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
        Schema::create('trip_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('transaction_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('trip_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->integer('quantity');
            $table->decimal('total');
            $table->enum('order_status', ['paid','panding', 'unpaid']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trip_orders');
    }
};
