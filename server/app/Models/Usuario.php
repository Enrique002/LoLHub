<?php

namespace App\Models;

use App\Models\User;

/**
 * Alias para el modelo User
 * Usa el modelo User que ya está configurado con la tabla 'usuarios'
 */
class Usuario extends User
{
    // Este modelo es un alias de User
    // La tabla real es 'usuarios' y está configurada en User
}

