<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('blocked_users')) {
            Schema::create('blocked_users', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('blocker_id')->constrained('usuarios')->cascadeOnDelete();
                $table->foreignId('blocked_id')->constrained('usuarios')->cascadeOnDelete();
                $table->timestamps();

                $table->unique(['blocker_id', 'blocked_id']);
            });
        }
    }
    public function down(): void
    {
        Schema::dropIfExists('blocked_users');
    }
};

