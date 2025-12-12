<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComentarioEquipo extends Model
{
    /**
     * Nombre de la tabla en la base de datos
     *
     * @var string
     */
    protected $table = 'comentarios_equipos';

    /**
     * Atributos que pueden ser asignados masivamente
     *
     * @var array
     */
    protected $fillable = [
        'id_equipo',
        'id_usuario',
        'comentario',
    ];

    /**
     * Relación con equipo
     *
     * @return BelongsTo
     */
    public function equipo(): BelongsTo
    {
        return $this->belongsTo(EquipoIdeal::class, 'id_equipo');
    }

    /**
     * Relación con usuario
     *
     * @return BelongsTo
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}

