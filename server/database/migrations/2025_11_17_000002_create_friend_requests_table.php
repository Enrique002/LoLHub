<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('solicitudes_amistad')) {
            Schema::create('solicitudes_amistad', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('requester_id')->constrained('usuarios')->cascadeOnDelete();
                $table->foreignId('receiver_id')->constrained('usuarios')->cascadeOnDelete();
                $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
                $table->timestamp('accepted_at')->nullable();
                $table->timestamps();

                $table->unique(['requester_id', 'receiver_id']);
            });
        }
    }
    public function down(): void
    {
        Schema::dropIfExists('solicitudes_amistad');
    }
};

