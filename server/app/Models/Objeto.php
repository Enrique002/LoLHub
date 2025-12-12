<?php

namespace App\Models;

use App\Models\Item;

/**
 * Alias para el modelo Item
 * Usa el modelo Item que ya está configurado con la tabla 'objetos'
 */
class Objeto extends Item
{
    // Este modelo es un alias de Item
    // La tabla real es 'objetos' y está configurada en Item
}

