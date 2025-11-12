# Backend - LoL.GG API

Backend desarrollado con Laravel 12 para la aplicación LoL.GG.

## Configuración

### Requisitos
- PHP 8.1+
- MySQL (XAMPP)
- Composer

### Instalación

1. Las dependencias ya están instaladas
2. La base de datos `lol_gg` debe estar creada en MySQL
3. El archivo `.env` está configurado para MySQL

### Estructura de la Base de Datos

- **users**: Usuarios del sistema
- **champions**: Información de campeones (sincronización con Data Dragon)
- **items**: Información de objetos (sincronización con Data Dragon)
- **builds**: Builds guardadas por usuarios
- **personal_access_tokens**: Tokens de autenticación (Sanctum)

## API Endpoints

### Autenticación
- `POST /api/v1/register` - Registrar nuevo usuario
- `POST /api/v1/login` - Iniciar sesión
- `POST /api/v1/logout` - Cerrar sesión (requiere autenticación)
- `GET /api/v1/me` - Obtener usuario actual (requiere autenticación)

### Campeones
- `GET /api/v1/champions` - Listar todos los campeones
- `GET /api/v1/champions/{id}` - Obtener detalles de un campeón

### Objetos
- `GET /api/v1/items` - Listar todos los objetos
- `GET /api/v1/items/{id}` - Obtener detalles de un objeto

## Configuración de Apache (XAMPP)

Para que Laravel funcione correctamente con Apache, asegúrate de:

1. Configurar el DocumentRoot de Apache apuntando a `server/public`
2. Habilitar mod_rewrite en Apache
3. Crear un archivo `.htaccess` en `server/public` (ya incluido por Laravel)

### Ejemplo de configuración de VirtualHost:

```apache
<VirtualHost *:80>
    ServerName lol-gg.local
    DocumentRoot "C:/xampp/htdocs/tfg/server/public"
    
    <Directory "C:/xampp/htdocs/tfg/server/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## CORS

CORS está configurado para permitir solicitudes desde:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternativo)

## Autenticación

La API usa Laravel Sanctum para autenticación basada en tokens.

Para usar endpoints protegidos, incluye el header:
```
Authorization: Bearer {token}
```

## Sincronización con Data Dragon

Los controladores intentan obtener datos de la base de datos primero. Si no hay datos, obtienen información directamente de Data Dragon de Riot Games.

Versión actual de Data Dragon: `15.21.1`
