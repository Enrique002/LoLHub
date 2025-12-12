<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Agregar una columna virtual para almacenar el nombre en minúsculas
        // Esto nos permitirá crear un índice único case-insensitive
        Schema::table('usuarios', function (Blueprint $table) {
            // Agregar columna virtual que almacena el nombre en minúsculas
            $table->string('nombre_lowercase')->virtualAs('LOWER(TRIM(nombre))')->nullable();
        });

        // Crear índice único en la columna virtual
        // Esto asegura que no haya dos usuarios con el mismo nombre (sin importar mayúsculas/minúsculas)
        DB::statement('CREATE UNIQUE INDEX usuarios_nombre_lowercase_unique ON usuarios(nombre_lowercase)');
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            // Eliminar el índice único
            $table->dropUnique(['nombre_lowercase']);
            // Eliminar la columna virtual
            $table->dropColumn('nombre_lowercase');
        });
    }
};

