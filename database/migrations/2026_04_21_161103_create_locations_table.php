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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();

            // Provider info
            $table->string('provider')->default('osm'); // 'osm'
            $table->string('provider_place_id'); // e.g. "osm:relation:12345"

            // UI / address
            $table->string('name')->nullable(); // short name if any
            $table->text('display_name')->nullable(); // full label from Nominatim

            // Geometry
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();

            // optional breakdown
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('country_code', 2)->nullable();

            // cached counter (optional but matches your plan)
            $table->unsignedInteger('posts_count')->default(0);

            $table->timestamps();

            $table->unique(['provider', 'provider_place_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
