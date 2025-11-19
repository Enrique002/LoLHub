# Instrucciones para Crear la Base de Datos lol_gg

## Opción 1: Usando phpMyAdmin (Más Fácil)

1. Abre tu navegador y ve a: `http://localhost/phpmyadmin`
2. Haz clic en la pestaña "Nueva" o "New" en el menú lateral
3. En "Nombre de la base de datos", escribe: `lol_gg`
4. En "Cotejamiento", selecciona: `utf8mb4_unicode_ci`
5. Haz clic en el botón "Crear" o "Create"
6. ¡Listo! La base de datos está creada

## Opción 2: Usando Línea de Comandos MySQL

### Windows (XAMPP)

Abre la terminal de MySQL desde XAMPP o ejecuta:

```bash
C:\xampp\mysql\bin\mysql.exe -u root
```

Luego ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS `lol_gg` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

O ejecuta el script SQL directamente:

```bash
C:\xampp\mysql\bin\mysql.exe -u root < database\create_database.sql
```

### Linux/Mac

```bash
mysql -u root -p
```

Luego ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS `lol_gg` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

## Opción 3: Usando Scripts Automáticos

### Windows - Script Batch

1. Ajusta la ruta de MySQL en `crear_base_datos.bat` si es necesario
2. Haz doble clic en `crear_base_datos.bat`
3. O ejecuta desde la terminal: `.\crear_base_datos.bat`

### Windows - Script PowerShell

1. Abre PowerShell en la carpeta `server`
2. Ejecuta: `.\crear_base_datos.ps1`
3. Si tienes problemas de permisos, ejecuta: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## Configurar .env

Después de crear la base de datos, asegúrate de que tu archivo `.env` tenga:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lol_gg
DB_USERNAME=root
DB_PASSWORD=
```

## Ejecutar Migraciones

Una vez creada la base de datos, ejecuta las migraciones:

```bash
cd server
php artisan migrate
```

Si quieres recrear todas las tablas desde cero:

```bash
php artisan migrate:fresh
```

## Verificar

Para verificar que todo está correcto:

```bash
php artisan migrate:status
```

## Estructura de Tablas que se Crearán

- `users` - Usuarios
- `password_reset_tokens` - Tokens de reseteo
- `sessions` - Sesiones
- `personal_access_tokens` - Tokens de autenticación
- `champions` - Campeones
- `items` - Objetos
- `builds` - Builds guardadas
- `favorite_champions` - Campeones favoritos
- `cache` - Cache
- `jobs` - Cola de trabajos
- `friend_requests` - Solicitudes de amistad
- `friend_messages` - Mensajes privados entre amigos

## Nuevas tablas para funciones recientes

Si ya creaste la base de datos anteriormente pero necesitas agregar las tablas más nuevas sin recrear todo, puedes ejecutarlas individualmente:

- `database\create_friend_requests_table.sql`
- `database\create_friend_messages_table.sql`

## Solución de Problemas

### Error: "Access denied"
- Verifica que MySQL esté corriendo en XAMPP
- Verifica las credenciales en `.env`
- Asegúrate de que el usuario tenga permisos

### Error: "Base de datos ya existe"
- La base de datos ya está creada, puedes continuar con las migraciones
- O elimínala primero desde phpMyAdmin o con: `DROP DATABASE lol_gg;`

### Error: "Table already exists"
- Ejecuta `php artisan migrate:fresh` para recrear todas las tablas
- O ejecuta `php artisan migrate:rollback` y luego `php artisan migrate`

