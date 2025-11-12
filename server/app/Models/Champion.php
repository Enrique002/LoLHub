<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Champion extends Model
{
    /**
     * Nombre de la tabla en la base de datos
     *
     * @var string
     */
    protected $table = 'campeones';

    /**
     * Atributos que pueden ser asignados masivamente
     *
     * @var array
     */
    protected $fillable = [
        'id_campeon',
        'nombre',
        'titulo',
        'historia',
        'etiquetas',
        'estadisticas',
        'habilidades',
        'recomendados',
        'url_imagen',
    ];

    /**
     * Atributos que deben ser convertidos a tipos nativos
     *
     * @var array
     */
    protected $casts = [
        'etiquetas' => 'array',
        'estadisticas' => 'array',
        'habilidades' => 'array',
        'recomendados' => 'array',
    ];
}
