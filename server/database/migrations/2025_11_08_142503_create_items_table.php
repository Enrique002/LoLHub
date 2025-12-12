<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('objetos', function (Blueprint $table) {
            $table->id();
            $table->string('id_objeto')->unique(); // ID de Data Dragon
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->text('texto_plano')->nullable();
            $table->json('etiquetas')->nullable(); // Array de tags
            $table->json('estadisticas')->nullable(); // Estadísticas del objeto
            $table->integer('oro_total')->default(0);
            $table->integer('oro_base')->default(0);
            $table->integer('oro_venta')->default(0);
            $table->boolean('comprable')->default(true);
            $table->json('mapas')->nullable(); // Disponibilidad en mapas
            $table->string('url_imagen')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('objetos');
    }
};
