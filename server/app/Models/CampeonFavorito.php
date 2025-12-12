<?php

namespace App\Models;

use App\Models\FavoriteChampion;

/**
 * Alias para el modelo FavoriteChampion
 * Usa el modelo FavoriteChampion que ya está configurado con la tabla 'campeones_favoritos'
 */
class CampeonFavorito extends FavoriteChampion
{
    // Este modelo es un alias de FavoriteChampion
    // La tabla real es 'campeones_favoritos' y está configurada en FavoriteChampion
}

