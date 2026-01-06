#!/bin/bash
# Script de inicio rápido para Docker (Linux/Mac)

echo "=== LoLHub - Inicio con Docker ==="
echo ""

# Verificar si Docker está ejecutándose
echo "Verificando Docker..."
if ! docker ps > /dev/null 2>&1; then
    echo "✗ Error: Docker no está ejecutándose"
    echo "Por favor, inicia Docker Desktop y vuelve a intentar."
    exit 1
fi
echo "✓ Docker está ejecutándose"

# Verificar si existe el archivo .env
if [ ! -f .env ]; then
    echo "⚠ Archivo .env no encontrado"
    echo "Creando archivo .env desde la plantilla..."
    
    cat > .env << EOF
APP_NAME=LoLHub
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3307
DB_DATABASE=lolhub
DB_USERNAME=lolhub_user
DB_PASSWORD=lolhub_password
DB_ROOT_PASSWORD=rootpassword

FRONTEND_PORT=3000
BACKEND_PORT=8000
DB_PORT=3307

CORS_ALLOWED_ORIGINS=http://localhost:3000

VITE_API_BASE_URL=http://localhost:8000/api/v1
EOF
    echo "✓ Archivo .env creado"
fi

# Verificar si existe el archivo .env en server
if [ ! -f server/.env ]; then
    echo "⚠ Archivo server/.env no encontrado"
    echo "Copiando .env a server/.env..."
    cp .env server/.env
    echo "✓ Archivo server/.env creado"
fi

# Construir y levantar los contenedores
echo ""
echo "Construyendo imágenes Docker..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "✗ Error al construir las imágenes"
    exit 1
fi

echo ""
echo "Iniciando contenedores..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "✗ Error al iniciar los contenedores"
    exit 1
fi

echo ""
echo "=== Contenedores iniciados correctamente ==="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000/api/v1"
echo ""
echo "Para ver los logs: docker-compose logs -f"
echo "Para detener: docker-compose down"
echo ""

