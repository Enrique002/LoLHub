<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

/**
 * Modelo personalizado para tokens de acceso personal
 * Extiende el modelo de Sanctum pero usa nombres de columnas en español
 */
class TokenAccesoPersonal extends SanctumPersonalAccessToken
{
    /**
     * Nombre de la tabla en la base de datos
     *
     * @var string
     */
    protected $table = 'tokens_acceso_personal';

    /**
     * Mapeo de atributos de Sanctum a nombres en español
     * Sanctum usa nombres en inglés, pero la BD usa español
     */
    protected $fillable = [
        'nombre',
        'token',
        'habilidades',
        'ultimo_uso_en',
        'expira_en',
    ];

    /**
     * Mapeo de atributos de Sanctum (inglés) a columnas en español
     * 
     * @var array<string, string>
     */
    protected $attributeMap = [
        'name' => 'nombre',
        'abilities' => 'habilidades',
        'last_used_at' => 'ultimo_uso_en',
        'expires_at' => 'expira_en',
    ];

    /**
     * Casts de atributos
     * 
     * @var array<string, string>
     */
    protected $casts = [
        'habilidades' => 'array',
        'ultimo_uso_en' => 'datetime',
        'expira_en' => 'datetime',
    ];

    /**
     * Mapear atributos de Sanctum a columnas en español
     * 
     * @param  string  $key
     * @return mixed
     */
    public function getAttribute($key)
    {
        // Mapear atributos de Sanctum a columnas en español
        if (isset($this->attributeMap[$key])) {
            $key = $this->attributeMap[$key];
        }

        return parent::getAttribute($key);
    }

    /**
     * Establecer atributos mapeando de inglés a español
     * 
     * @param  string  $key
     * @param  mixed  $value
     * @return mixed
     */
    public function setAttribute($key, $value)
    {
        // Mapear atributos de Sanctum a columnas en español
        if (isset($this->attributeMap[$key])) {
            $key = $this->attributeMap[$key];
        }

        return parent::setAttribute($key, $value);
    }

    /**
     * Rellenar el modelo con atributos, mapeando nombres de Sanctum a español
     * Este método es llamado cuando se usa create() o fill()
     * 
     * @param  array  $attributes
     * @return $this
     */
    public function fill(array $attributes)
    {
        // Mapear atributos de Sanctum a nombres en español antes de rellenar
        $mapeados = [];
        foreach ($attributes as $key => $value) {
            if (isset($this->attributeMap[$key])) {
                $mapeados[$this->attributeMap[$key]] = $value;
            } else {
                $mapeados[$key] = $value;
            }
        }

        return parent::fill($mapeados);
    }

    /**
     * Establecer atributos sin procesar (raw), mapeando nombres
     * Este método es llamado internamente por Eloquent durante create()
     * 
     * @param  array  $attributes
     * @param  bool  $sync
     * @return $this
     */
    public function setRawAttributes(array $attributes, $sync = false)
    {
        // Mapear atributos de Sanctum a nombres en español
        $mapeados = [];
        foreach ($attributes as $key => $value) {
            if (isset($this->attributeMap[$key])) {
                $mapeados[$this->attributeMap[$key]] = $value;
            } else {
                $mapeados[$key] = $value;
            }
        }

        return parent::setRawAttributes($mapeados, $sync);
    }

    /**
     * Obtener el nombre del atributo original de Sanctum
     * 
     * @param  string  $key
     * @return string
     */
    public function getOriginalAttribute($key)
    {
        $reverseMap = array_flip($this->attributeMap);
        return $reverseMap[$key] ?? $key;
    }

    /**
     * Convertir el modelo a un array con nombres de Sanctum para compatibilidad
     * 
     * @return array
     */
    public function toArray()
    {
        $array = parent::toArray();
        $reverseMap = array_flip($this->attributeMap);
        
        // Renombrar claves a nombres de Sanctum
        foreach ($reverseMap as $espanol => $ingles) {
            if (isset($array[$espanol])) {
                $array[$ingles] = $array[$espanol];
                unset($array[$espanol]);
            }
        }

        return $array;
    }
}

