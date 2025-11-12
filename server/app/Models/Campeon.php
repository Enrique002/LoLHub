<?php

namespace App\Models;

use App\Models\Champion;

/**
 * Alias para el modelo Champion
 * Usa el modelo Champion que ya está configurado con la tabla 'campeones'
 */
class Campeon extends Champion
{
    // Este modelo es un alias de Champion
    // La tabla real es 'campeones' y está configurada en Champion
}

