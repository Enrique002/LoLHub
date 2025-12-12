# Script PowerShell para crear la base de datos lol_gg en XAMPP
# Ejecutar: .\crear_base_datos.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Creacion de Base de Datos lol_gg" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ruta de MySQL en XAMPP (ajusta según tu instalación)
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
$mysqlUser = "root"
$mysqlPass = ""

# Verificar si MySQL está disponible
if (-not (Test-Path $mysqlPath)) {
    Write-Host "✗ Error: No se encuentra MySQL en: $mysqlPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Ajusta la ruta en el script o asegurate de que XAMPP este instalado." -ForegroundColor Yellow
    exit 1
}

Write-Host "Creando base de datos..." -ForegroundColor Yellow

# Crear la base de datos
$sqlCommand = "CREATE DATABASE IF NOT EXISTS `lol_gg` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if ($mysqlPass -eq "") {
    & $mysqlPath -u $mysqlUser -e $sqlCommand
} else {
    & $mysqlPath -u $mysqlUser -p$mysqlPass -e $sqlCommand
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Base de datos 'lol_gg' creada exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ahora ejecuta las migraciones:" -ForegroundColor Cyan
    Write-Host "  cd server" -ForegroundColor White
    Write-Host "  php artisan migrate" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Error al crear la base de datos" -ForegroundColor Red
    Write-Host ""
    Write-Host "Asegurate de que:" -ForegroundColor Yellow
    Write-Host "  1. MySQL este corriendo en XAMPP" -ForegroundColor Yellow
    Write-Host "  2. Las credenciales sean correctas" -ForegroundColor Yellow
    Write-Host "  3. El usuario tenga permisos para crear bases de datos" -ForegroundColor Yellow
    Write-Host ""
}

