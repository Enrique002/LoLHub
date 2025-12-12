<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comentarios_equipos', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('id_equipo')->constrained('equipos_ideales')->cascadeOnDelete();
            $table->foreignId('id_usuario')->constrained('usuarios')->cascadeOnDelete();
            $table->text('comentario');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comentarios_equipos');
    }
};

