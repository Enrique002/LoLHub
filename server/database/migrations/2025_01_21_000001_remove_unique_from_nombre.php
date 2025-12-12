<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Eliminar cualquier índice único en el campo nombre si existe
        // MySQL no tiene DROP INDEX IF EXISTS, así que usamos un try-catch
        try {
            // Intentar eliminar índices únicos comunes
            Schema::table('usuarios', function (Blueprint $table) {
                // Esto eliminará el índice si existe
                $table->dropUnique(['nombre']);
            });
        } catch (\Exception $e) {
            // Si el índice no existe, ignoramos el error
            // Intentar con otros nombres posibles
            try {
                DB::statement('ALTER TABLE usuarios DROP INDEX IF EXISTS usuarios_nombre_unique');
            } catch (\Exception $e2) {
                // Ignorar si no existe
            }
            try {
                DB::statement('ALTER TABLE usuarios DROP INDEX IF EXISTS nombre_unique');
            } catch (\Exception $e3) {
                // Ignorar si no existe
            }
            try {
                DB::statement('ALTER TABLE usuarios DROP INDEX IF EXISTS nombre');
            } catch (\Exception $e4) {
                // Ignorar si no existe
            }
        }
    }

    public function down(): void
    {
        // No hacemos nada en el down porque no queremos restaurar la restricción única
        // El nombre no debería ser único
    }
};

