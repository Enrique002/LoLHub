# Migraciones de Base de Datos - LoL.GG

Este documento explica cómo crear la base de datos y ejecutar las migraciones para el proyecto LoL.GG.

## Requisitos Previos

- MySQL o MariaDB instalado y corriendo
- PHP con extensiones PDO y MySQL
- Composer instalado
- Variables de entorno configuradas en `.env`

## Configuración de .env

Asegúrate de tener estas variables en tu archivo `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lol_gg
DB_USERNAME=root
DB_PASSWORD=
```

## Método 1: Crear Base de Datos Manualmente (Recomendado)

### Opción A: Usando MySQL Command Line

```bash
mysql -u root -p
```

Luego ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS `lol_gg` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

O ejecuta el script SQL directamente:

```bash
mysql -u root -p < database/create_database.sql
```

### Opción B: Usando phpMyAdmin

1. Abre phpMyAdmin (normalmente en `http://localhost/phpmyadmin`)
2. Haz clic en "Nueva" o "New"
3. Nombre de la base de datos: `lol_gg`
4. Cotejamiento: `utf8mb4_unicode_ci`
5. Haz clic en "Crear"

## Método 2: Usar el Script PHP

```bash
cd server
php database/migrate_database.php
```

Este script creará la base de datos automáticamente.

## Ejecutar las Migraciones

Una vez creada la base de datos, ejecuta las migraciones:

```bash
cd server
php artisan migrate
```

Si quieres recrear todas las tablas desde cero:

```bash
php artisan migrate:fresh
```

## Estructura de las Tablas

Las migraciones crearán las siguientes tablas:

1. **users** - Usuarios del sistema
2. **password_reset_tokens** - Tokens para resetear contraseñas
3. **sessions** - Sesiones de usuario
4. **personal_access_tokens** - Tokens de autenticación (Sanctum)
5. **champions** - Información de campeones
6. **items** - Información de objetos
7. **builds** - Builds guardadas por usuarios
8. **favorite_champions** - Campeones favoritos de usuarios
9. **cache** - Cache del sistema
10. **jobs** - Cola de trabajos

## Verificar las Migraciones

Para ver el estado de las migraciones:

```bash
php artisan migrate:status
```

## Rollback de Migraciones

Si necesitas revertir las migraciones:

```bash
php artisan migrate:rollback
```

Para revertir todas las migraciones:

```bash
php artisan migrate:reset
```

## Solución de Problemas

### Error: "Access denied for user"

- Verifica las credenciales en `.env`
- Asegúrate de que el usuario tenga permisos para crear bases de datos

### Error: "Base de datos ya existe"

- La base de datos ya está creada, puedes continuar con las migraciones
- O elimínala primero: `DROP DATABASE lol_gg;`

### Error: "Table already exists"

- Ejecuta `php artisan migrate:fresh` para recrear todas las tablas
- O ejecuta `php artisan migrate:rollback` y luego `php artisan migrate`

## Notas Importantes

- Las migraciones usan `utf8mb4` para soportar emojis y caracteres especiales
- Todas las tablas tienen timestamps (`created_at`, `updated_at`)
- Las relaciones foreign key están configuradas con `onDelete('cascade')`

