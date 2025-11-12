<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Nombre de la tabla en la base de datos
     *
     * @var string
     */
    protected $table = 'usuarios';

    /**
     * Atributos que pueden ser asignados masivamente
     *
     * @var list<string>
     */
    protected $fillable = [
        'nombre',
        'correo',
        'contrasenya',
    ];

    /**
     * Atributos que deben ocultarse para la serialización
     *
     * @var list<string>
     */
    protected $hidden = [
        'contrasenya',
        'remember_token',
    ];

    /**
     * Obtener los atributos que deben ser convertidos
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'correo_verificado_en' => 'datetime',
            'contrasenya' => 'hashed',
        ];
    }

    /**
     * Relación con builds
     *
     * @return HasMany
     */
    public function builds(): HasMany
    {
        return $this->hasMany(Build::class, 'id_usuario');
    }

    /**
     * Relación con campeones favoritos
     *
     * @return HasMany
     */
    public function campeonesFavoritos(): HasMany
    {
        return $this->hasMany(CampeonFavorito::class, 'id_usuario');
    }

    // Alias para compatibilidad
    public function favoriteChampions(): HasMany
    {
        return $this->campeonesFavoritos();
    }
}
