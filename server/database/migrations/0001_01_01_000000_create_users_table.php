<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('correo')->unique();
            $table->timestamp('correo_verificado_en')->nullable();
            $table->string('contrasenya');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('tokens_reseteo_contrasenya', function (Blueprint $table) {
            $table->string('correo')->primary();
            $table->string('token');
            $table->timestamp('creado_en')->nullable();
        });

        Schema::create('sesiones', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('id_usuario')->nullable()->index();
            $table->string('direccion_ip', 45)->nullable();
            $table->text('agente_usuario')->nullable();
            $table->longText('datos');
            $table->integer('ultima_actividad')->index();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
        Schema::dropIfExists('tokens_reseteo_contrasenya');
        Schema::dropIfExists('sesiones');
    }
};
