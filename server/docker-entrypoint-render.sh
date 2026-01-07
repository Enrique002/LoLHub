#!/bin/bash
set -e

# En Render, la base de datos ya está disponible a través de variables de entorno
# No necesitamos esperar como en Docker Compose

# Configurar Apache para usar el puerto de Render (PORT es una variable de entorno de Render)
if [ -n "$PORT" ]; then
    # Configurar Apache para escuchar en el puerto de Render
    sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf 2>/dev/null || echo "Listen $PORT" > /etc/apache2/ports.conf
    sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$PORT>/" /etc/apache2/sites-available/000-default.conf
    # Asegurar que el módulo de puertos esté habilitado
    a2enmod rewrite 2>/dev/null || true
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

# Ejecutar migraciones
php artisan migrate --force

# Limpiar caché
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimizar Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ejecutar el comando principal
exec "$@"

