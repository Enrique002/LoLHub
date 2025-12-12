<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Request;
use App\Models\FriendRequest;
use App\Models\FriendMessage;
use App\Models\BlockedUser;
use App\Models\EquipoIdeal;

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
        'avatar_path',
        'banner_path',
        'favorite_items',
        'favorite_runes',
        'selected_decoration_key',
    ];

    /**
     * Atributos añadidos automáticamente a las respuestas JSON
     *
     * @var array<int, string>
     */
    protected $appends = [
        'name',
        'email',
        'avatar_url',
        'banner_url',
        'selected_decoration',
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
            'favorite_items' => 'array',
            'favorite_runes' => 'array',
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

    public function sentFriendRequests(): HasMany
    {
        return $this->hasMany(FriendRequest::class, 'requester_id');
    }

    public function receivedFriendRequests(): HasMany
    {
        return $this->hasMany(FriendRequest::class, 'receiver_id');
    }

    public function sentFriendMessages(): HasMany
    {
        return $this->hasMany(FriendMessage::class, 'sender_id');
    }

    public function receivedFriendMessages(): HasMany
    {
        return $this->hasMany(FriendMessage::class, 'receiver_id');
    }

    public function blockedUsers(): HasMany
    {
        return $this->hasMany(BlockedUser::class, 'blocker_id');
    }

    public function blockedByUsers(): HasMany
    {
        return $this->hasMany(BlockedUser::class, 'blocked_id');
    }

    public function equipoIdeal(): HasMany
    {
        return $this->hasMany(EquipoIdeal::class, 'id_usuario');
    }

    /**
     * Obtiene los IDs de usuarios con amistad aceptada
     *
     * @return array<int, int>
     */
    public function friendIds(): array
    {
        return $this->sentFriendRequests()
            ->where('status', 'accepted')
            ->pluck('receiver_id')
            ->merge(
                $this->receivedFriendRequests()
                    ->where('status', 'accepted')
                    ->pluck('requester_id')
            )
            ->unique()
            ->values()
            ->all();
    }

    /**
     * Verifica si el usuario actual es amigo de otro usuario
     */
    public function isFriendWith(int $userId): bool
    {
        if ($userId === $this->id) {
            return false;
        }

        return FriendRequest::query()
            ->where('status', 'accepted')
            ->where(function ($query) use ($userId): void {
                $query->where(function ($sub) use ($userId): void {
                    $sub->where('requester_id', $this->id)
                        ->where('receiver_id', $userId);
                })->orWhere(function ($sub) use ($userId): void {
                    $sub->where('requester_id', $userId)
                        ->where('receiver_id', $this->id);
                });
            })
            ->exists();
    }

    /**
     * Convertir el modelo a array, agregando alias en inglés para el frontend
     * 
     * @return array
     */
    public function toArray()
    {
        $array = parent::toArray();
        
        return $array;
    }

    /**
     * Accessor para obtener el nombre como 'name' (compatibilidad con frontend)
     * 
     * @return string|null
     */
    public function getNameAttribute()
    {
        return $this->nombre;
    }

    /**
     * Accessor para obtener el correo como 'email' (compatibilidad con frontend)
     * 
     * @return string|null
     */
    public function getEmailAttribute()
    {
        return $this->correo;
    }

    /**
     * Obtener la URL pública del avatar
     *
     * @return string|null
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->avatar_path) {
            return null;
        }

        return $this->publicUrl($this->avatar_path);
    }

    /**
     * Obtener la URL pública del banner
     *
     * @return string|null
     */
    public function getBannerUrlAttribute(): ?string
    {
        if (!$this->banner_path) {
            return null;
        }

        return $this->publicUrl($this->banner_path);
    }

    /**
     * Construye una URL para archivos almacenados en public
     * Genera URLs que funcionen en cualquier máquina usando el request actual
     */
    private function publicUrl(string $path): string
    {
        // Obtener la URL completa del request actual si está disponible
        $request = Request::instance();
        if ($request) {
            // Obtener la URL base completa (incluyendo subcarpetas)
            $root = $request->root();
            // Construir la ruta relativa
            $relativePath = '/storage/' . ltrim($path, '/');
            // Combinar: root ya incluye el protocolo, dominio y ruta base
            return rtrim($root, '/') . $relativePath;
        } else {
            // Si no hay request, usar URL relativa que el navegador resolverá
            return '/storage/' . ltrim($path, '/');
        }
    }

    /**
     * Información de la decoración seleccionada por el usuario
     */
    public function getSelectedDecorationAttribute(): ?array
    {
        $key = $this->selected_decoration_key;

        if (!$key) {
            return null;
        }

        $definition = config("missions.{$key}");

        if (!$definition) {
            return null;
        }

        $reward = $definition['reward'] ?? [];

        return [
            'key' => $key,
            'title' => $reward['title'] ?? ($definition['title'] ?? 'Decoración'),
            'description' => $reward['description'] ?? ($definition['description'] ?? null),
            'icon' => $reward['icon'] ?? 'sparkles',
            'color' => $reward['color'] ?? '#FACC15',
        ];
    }
}
