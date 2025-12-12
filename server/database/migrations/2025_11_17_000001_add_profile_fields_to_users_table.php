<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table): void {
            $table->string('avatar_path')->nullable()->after('remember_token');
            $table->string('banner_path')->nullable()->after('avatar_path');
            $table->json('favorite_items')->nullable()->after('banner_path');
            $table->json('favorite_runes')->nullable()->after('favorite_items');
        });
    }
    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table): void {
            $table->dropColumn(['avatar_path', 'banner_path', 'favorite_items', 'favorite_runes']);
        });
    }
};

