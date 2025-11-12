# Configuración del Backend

## URL del Backend

Para que el frontend se conecte correctamente al backend, necesitas configurar la variable de entorno `VITE_API_BASE_URL`.

### Opción 1: Usando XAMPP con Apache

Si estás usando Apache de XAMPP, la URL sería:
```
VITE_API_BASE_URL=http://localhost/tfg/server/public/api/v1
```

### Opción 2: Usando php artisan serve

Si estás usando el servidor de desarrollo de Laravel:
```bash
cd server
php artisan serve
```

La URL sería:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Configuración

1. Crea un archivo `.env` en la carpeta `client/` con:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

2. O modifica `client/src/config.ts` directamente si prefieres.

3. Reinicia el servidor de desarrollo de Vite después de cambiar la configuración.

## Verificar que el Backend esté funcionando

Puedes probar que el backend esté funcionando visitando:
- `http://localhost:8000/api/v1/champions` (o la URL que hayas configurado)

Deberías recibir una respuesta JSON con los campeones.

