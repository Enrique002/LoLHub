<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

/**
 * Modelo personalizado para tokens de acceso personal
 * Extiende el modelo de Sanctum pero usa la tabla en español
 */
class TokenAccesoPersonal extends SanctumPersonalAccessToken
{
    /**
     * Nombre de la tabla en la base de datos
     *
     * @var string
     */
    protected $table = 'tokens_acceso_personal';
}

