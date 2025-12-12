<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Build extends Model
{
    /**
     * Atributos que pueden ser asignados masivamente
     *
     * @var array
     */
    protected $fillable = [
        'id_usuario',
        'id_campeon',
        'nombre',
        'objetos',
        'descripcion',
        'es_publica',
    ];

    /**
     * Atributos que deben ser convertidos a tipos nativos
     *
     * @var array
     */
    protected $casts = [
        'objetos' => 'array',
        'es_publica' => 'boolean',
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

    // Alias para compatibilidad
    public function user(): BelongsTo
    {
        return $this->usuario();
    }
}
