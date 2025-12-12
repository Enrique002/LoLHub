<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipoIdeal extends Model
{
    /**
     * Nombre de la tabla en la base de datos
     *
     * @var string
     */
    protected $table = 'equipos_ideales';

    /**
     * Atributos que pueden ser asignados masivamente
     *
     * @var array
     */
    protected $fillable = [
        'id_usuario',
        'nombre',
        'campeones',
        'objetos',
        'runas',
        'descripcion',
    ];

    /**
     * Atributos que deben ser convertidos a tipos nativos
     *
     * @var array
     */
    protected $casts = [
        'campeones' => 'array',
        'objetos' => 'array',
        'runas' => 'array',
    ];

    /**
     * Relación con usuario
     *
     * @return BelongsTo
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    /**
     * Relación con comentarios
     *
     * @return HasMany
     */
    public function comentarios(): HasMany
    {
        return $this->hasMany(ComentarioEquipo::class, 'id_equipo');
    }
}

