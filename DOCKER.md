# Guía de Docker para LoLHub

Esta guía te ayudará a ejecutar el proyecto LoLHub usando Docker Desktop.

## Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose
- Al menos 4GB de RAM disponibles
- Puertos 3000, 8000 y 3306 disponibles

## Configuración Inicial

### 1. Crear archivo de variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Configuración de la aplicación
APP_NAME=LoLHub
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://localhost:8000

# Configuración de base de datos
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3307
DB_DATABASE=lolhub
DB_USERNAME=lolhub_user
DB_PASSWORD=lolhub_password
DB_ROOT_PASSWORD=rootpassword

# Configuración de puertos
FRONTEND_PORT=3000
BACKEND_PORT=8000
DB_PORT=3307

# Configuración de CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# URL de la API para el frontend
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 2. Crear archivo .env en el servidor

También necesitas crear un archivo `.env` en la carpeta `server/` con la misma configuración (o copiar el de la raíz).

## Comandos Docker

### Construir y ejecutar los contenedores

```bash
# Construir las imágenes
docker-compose build

# Iniciar todos los servicios
docker-compose up -d

# Ver los logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Detener los contenedores

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Esto elimina la base de datos)
docker-compose down -v
```

### Reconstruir los contenedores

```bash
# Reconstruir sin caché
docker-compose build --no-cache

# Reconstruir y reiniciar
docker-compose up -d --build
```

## Acceso a la Aplicación

Una vez que los contenedores estén ejecutándose:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/v1
- **Base de datos MySQL**: localhost:3307 (puerto 3307 para evitar conflicto con XAMPP)

## Comandos Útiles

### Acceder a los contenedores

```bash
# Acceder al contenedor del backend
docker-compose exec backend bash

# Acceder al contenedor del frontend
docker-compose exec frontend sh

# Acceder a MySQL
docker-compose exec db mysql -u lolhub_user -p lolhub
```

### Ejecutar comandos de Laravel

```bash
# Ejecutar migraciones
docker-compose exec backend php artisan migrate

# Limpiar caché
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear

# Generar clave de aplicación
docker-compose exec backend php artisan key:generate
```

### Ver el estado de los contenedores

```bash
# Ver contenedores en ejecución
docker-compose ps

# Ver uso de recursos
docker stats
```

## Solución de Problemas

### El backend no se conecta a la base de datos

1. Verifica que el contenedor de la base de datos esté ejecutándose:
   ```bash
   docker-compose ps
   ```

2. Verifica los logs de la base de datos:
   ```bash
   docker-compose logs db
   ```

3. Asegúrate de que las credenciales en `.env` coincidan con las del `docker-compose.yml`

### El frontend no se conecta al backend

1. Verifica que la variable `VITE_API_BASE_URL` en `.env` apunte a `http://localhost:8000/api/v1`

2. Si estás usando Docker Desktop en Windows/Mac, puede que necesites usar `host.docker.internal` en lugar de `localhost` en algunos casos.

### Error de permisos en el backend

```bash
# Ejecutar dentro del contenedor
docker-compose exec backend chown -R www-data:www-data /var/www/html/storage
docker-compose exec backend chmod -R 775 /var/www/html/storage
```

### Reconstruir desde cero

Si tienes problemas persistentes, puedes reconstruir todo desde cero:

```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker-compose rm -f

# Reconstruir
docker-compose build --no-cache
docker-compose up -d
```

## Estructura de Servicios

- **db**: Base de datos MySQL 8.0
- **backend**: Servidor Laravel con PHP 8.2 y Apache
- **frontend**: Aplicación React/Vite servida con Nginx

## Volúmenes Persistentes

Los siguientes volúmenes se crean automáticamente para persistir datos:

- `db_data`: Datos de la base de datos MySQL
- `backend_storage`: Archivos de almacenamiento de Laravel
- `backend_cache`: Caché de Laravel

## Desarrollo vs Producción

Para desarrollo, puedes modificar el `docker-compose.yml` para usar volúmenes montados en lugar de copiar archivos:

```yaml
volumes:
  - ./server:/var/www/html
  - ./client:/app
```

Esto permitirá que los cambios se reflejen inmediatamente sin reconstruir los contenedores.

## Notas Adicionales

- La primera vez que ejecutes `docker-compose up`, puede tardar varios minutos mientras descarga las imágenes y construye los contenedores.
- El backend ejecutará automáticamente las migraciones al iniciar.
- La clave de aplicación de Laravel se generará automáticamente si no existe.

