<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campeones_favoritos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('usuarios')->onDelete('cascade');
            $table->string('id_campeon'); // ID del campeón de Data Dragon
            $table->timestamps();
            
            // Evitar duplicados: un usuario no puede tener el mismo campeón favorito dos veces
            $table->unique(['id_usuario', 'id_campeon']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campeones_favoritos');
    }
};
