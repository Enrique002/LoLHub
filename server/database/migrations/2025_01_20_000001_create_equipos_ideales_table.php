<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipos_ideales', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('id_usuario')->constrained('usuarios')->cascadeOnDelete();
            $table->string('nombre');
            $table->json('campeones'); // Array de IDs de campeones (máximo 5)
            $table->json('objetos')->nullable(); // Objetos por campeón (opcional)
            $table->json('runas')->nullable(); // Runas por campeón (opcional)
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipos_ideales');
    }
};

