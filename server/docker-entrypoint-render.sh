#!/bin/bash
set -e

# En Render, la base de datos ya está disponible a través de variables de entorno
# No necesitamos esperar como en Docker Compose

# Configurar Apache para usar el puerto de Render (PORT es una variable de entorno de Render)
if [ -n "$PORT" ] && [ "$PORT" != "80" ]; then
    # Configurar Apache para escuchar en el puerto de Render
    if [ -f /etc/apache2/ports.conf ]; then
        sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf
    else
        echo "Listen $PORT" > /etc/apache2/ports.conf
    fi
    # Actualizar VirtualHost
    if [ -f /etc/apache2/sites-available/000-default.conf ]; then
        sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$PORT>/" /etc/apache2/sites-available/000-default.conf
    fi
fi

# Generar clave de aplicación si no existe
if [ ! -f .env ]; then
    echo "APP_NAME=${APP_NAME:-LoLHub}" > .env
    echo "APP_ENV=${APP_ENV:-production}" >> .env
    echo "APP_KEY=" >> .env
    echo "APP_DEBUG=${APP_DEBUG:-false}" >> .env
    echo "APP_URL=${APP_URL:-}" >> .env
    echo "DB_CONNECTION=${DB_CONNECTION:-pgsql}" >> .env
    echo "DB_HOST=${DB_HOST}" >> .env
    echo "DB_PORT=${DB_PORT:-5432}" >> .env
    echo "DB_DATABASE=${DB_DATABASE}" >> .env
    echo "DB_USERNAME=${DB_USERNAME}" >> .env
    echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
    php artisan key:generate
fi

# Ejecutar migraciones (solo si la base de datos está disponible)
if [ -n "$DB_HOST" ]; then
    php artisan migrate --force || echo "Migraciones fallaron, continuando..."
fi

# Limpiar caché
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Optimizar Laravel (solo si no hay errores)
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Ejecutar el comando principal
exec "$@"

