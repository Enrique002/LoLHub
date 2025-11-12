<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

/**
 * Proveedor de servicios para Sanctum
 * Configura Sanctum para usar nombres de tablas en español
 */
class SanctumServiceProvider extends ServiceProvider
{
    /**
     * Registra los servicios de la aplicación
     */
    public function register(): void
    {
        //
    }

    /**
     * Inicializa los servicios de la aplicación
     */
    public function boot(): void
    {
        // Configurar Sanctum para usar el modelo personalizado con tabla en español
        Sanctum::usePersonalAccessTokenModel(\App\Models\TokenAccesoPersonal::class);
    }
}

