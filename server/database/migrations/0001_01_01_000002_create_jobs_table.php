<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trabajos', function (Blueprint $table) {
            $table->id();
            $table->string('cola')->index();
            $table->longText('datos');
            $table->unsignedTinyInteger('intentos');
            $table->unsignedInteger('reservado_en')->nullable();
            $table->unsignedInteger('disponible_en');
            $table->unsignedInteger('creado_en');
        });

        Schema::create('lotes_trabajos', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nombre');
            $table->integer('total_trabajos');
            $table->integer('trabajos_pendientes');
            $table->integer('trabajos_fallidos');
            $table->longText('ids_trabajos_fallidos');
            $table->mediumText('opciones')->nullable();
            $table->integer('cancelado_en')->nullable();
            $table->integer('creado_en');
            $table->integer('finalizado_en')->nullable();
        });

        Schema::create('trabajos_fallidos', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('conexion');
            $table->text('cola');
            $table->longText('datos');
            $table->longText('excepcion');
            $table->timestamp('fallido_en')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trabajos');
        Schema::dropIfExists('lotes_trabajos');
        Schema::dropIfExists('trabajos_fallidos');
    }
};
