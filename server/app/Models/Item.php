<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    /**
     * Nombre de la tabla en la base de datos
     *
     * @var string
     */
    protected $table = 'objetos';

    /**
     * Atributos que pueden ser asignados masivamente
     *
     * @var array
     */
    protected $fillable = [
        'id_objeto',
        'nombre',
        'descripcion',
        'texto_plano',
        'etiquetas',
        'estadisticas',
        'oro_total',
        'oro_base',
        'oro_venta',
        'comprable',
        'mapas',
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
        'mapas' => 'array',
        'comprable' => 'boolean',
    ];
}
