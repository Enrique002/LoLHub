<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campeones', function (Blueprint $table) {
            $table->id();
            $table->string('id_campeon')->unique(); // ID de Data Dragon (ej: "Aatrox")
            $table->string('nombre');
            $table->string('titulo');
            $table->text('historia')->nullable();
            $table->json('etiquetas')->nullable(); // Array de roles
            $table->json('estadisticas')->nullable(); // Estadísticas del campeón
            $table->json('habilidades')->nullable(); // Habilidades
            $table->json('recomendados')->nullable(); // Objetos recomendados
            $table->string('url_imagen')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campeones');
    }
};
