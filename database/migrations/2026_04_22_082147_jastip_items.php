<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('jastip_items', function(Blueprint $table){
            $table->id();
            // Pemilik produk jastip (jastiper)
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            // Kaitan opsional ke sesi/trip jastip
            $table->foreignId('jastip_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('brand')->nullable();
            $table->enum('category', ['Fashion', 'Skincare', 'Food', 'Merchandise']);
            $table->text('description')->nullable();
            $table->integer('max_slot');                          // total stok
            $table->decimal('base_price', 15, 2);                 // harga dasar
            $table->decimal('jastip_fee', 15, 2)->default(0);     // biaya jastip
            $table->integer('min_buy')->default(1);               // minimum pembelian
            $table->decimal('weight_gram', 8, 2)->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->date('start_date')->nullable();               // tanggal dijual
            $table->date('end_date')->nullable();                 // tanggal berakhir
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jastip_items');
    }
};
