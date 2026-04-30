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
        Schema::create('pergi_barengs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('initiator_id')->constrained('users', 'user_id')->onDelete('cascade')->onUpdate('cascade');
            $table->string('name');
            $table->text('description');
            $table->dateTime('time_appointment');
            $table->enum('transportation', ['Mobil Pribadi', 'Transportasi Online','Transportasi Umum', 'Sewa Mobil']);
            $table->integer('people_amount');
            $table->string('origin_city');
            $table->string('destination_city');
            $table->text('departure_loc');
            $table->text('destination_loc');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pergi_barengs');
    }
};
