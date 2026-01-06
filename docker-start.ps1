# Script de inicio rápido para Docker en PowerShell (Windows)

Write-Host "=== LoLHub - Inicio con Docker ===" -ForegroundColor Cyan
Write-Host ""

# Verificar si Docker está ejecutándose
Write-Host "Verificando Docker Desktop..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker Desktop está ejecutándose" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: Docker Desktop no está ejecutándose" -ForegroundColor Red
    Write-Host "Por favor, inicia Docker Desktop y vuelve a intentar." -ForegroundColor Yellow
    exit 1
}

# Verificar si existe el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠ Archivo .env no encontrado" -ForegroundColor Yellow
    Write-Host "Creando archivo .env desde la plantilla..." -ForegroundColor Yellow
    
    $envContent = @"
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
"@
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✓ Archivo .env creado" -ForegroundColor Green
}

# Verificar si existe el archivo .env en server
if (-not (Test-Path "server\.env")) {
    Write-Host "⚠ Archivo server\.env no encontrado" -ForegroundColor Yellow
    Write-Host "Copiando .env a server\.env..." -ForegroundColor Yellow
    Copy-Item ".env" "server\.env"
    Write-Host "✓ Archivo server\.env creado" -ForegroundColor Green
}

# Construir y levantar los contenedores
Write-Host ""
Write-Host "Construyendo imágenes Docker..." -ForegroundColor Yellow
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Error al construir las imágenes" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Iniciando contenedores..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Error al iniciar los contenedores" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Contenedores iniciados correctamente ===" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8000/api/v1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para ver los logs: docker-compose logs -f" -ForegroundColor Yellow
Write-Host "Para detener: docker-compose down" -ForegroundColor Yellow
Write-Host ""

