<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            // Banyak lampiran per pesan (gambar/PDF). Kolom lama attachment_* tetap
            // ada demi kompatibilitas pesan lama; pesan baru memakai kolom ini.
            $table->json('attachments')->nullable()->after('attachment_size');
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn('attachments');
        });
    }
};
