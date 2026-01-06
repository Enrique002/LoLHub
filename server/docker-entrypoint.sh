#!/bin/bash
set -e

# Esperar a que la base de datos esté lista
echo "Esperando a que la base de datos esté lista..."
while ! nc -z db 3306; do
  sleep 1
done
echo "Base de datos lista!"

# Generar clave de aplicación si no existe
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        echo "APP_NAME=LoLHub" > .env
        echo "APP_ENV=production" >> .env
        echo "APP_KEY=" >> .env
        echo "APP_DEBUG=false" >> .env
        echo "APP_URL=http://localhost:8000" >> .env
        echo "DB_CONNECTION=mysql" >> .env
        echo "DB_HOST=db" >> .env
        echo "DB_PORT=3306" >> .env
        echo "DB_DATABASE=${DB_DATABASE:-lolhub}" >> .env
        echo "DB_USERNAME=${DB_USERNAME:-lolhub_user}" >> .env
        echo "DB_PASSWORD=${DB_PASSWORD:-lolhub_password}" >> .env
    fi
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

