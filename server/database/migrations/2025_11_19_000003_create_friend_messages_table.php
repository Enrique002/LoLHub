<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('mensajes_amistad')) {
            Schema::create('mensajes_amistad', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('sender_id')->constrained('usuarios')->cascadeOnDelete();
                $table->foreignId('receiver_id')->constrained('usuarios')->cascadeOnDelete();
                $table->text('message');
                $table->timestamp('read_at')->nullable();
                $table->timestamps();

                $table->index(['sender_id', 'receiver_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('mensajes_amistad');
    }
};

