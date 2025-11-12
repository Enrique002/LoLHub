@echo off
REM Script para crear la base de datos lol_gg en XAMPP
REM Asegúrate de que MySQL esté corriendo en XAMPP

echo ========================================
echo Creacion de Base de Datos lol_gg
echo ========================================
echo.

REM Ruta de MySQL en XAMPP (ajusta según tu instalación)
set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe
set MYSQL_USER=root
set MYSQL_PASS=

echo Creando base de datos...
"%MYSQL_PATH%" -u %MYSQL_USER% -e "CREATE DATABASE IF NOT EXISTS `lol_gg` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Base de datos 'lol_gg' creada exitosamente
    echo.
    echo Ahora ejecuta las migraciones:
    echo   cd server
    echo   php artisan migrate
    echo.
) else (
    echo.
    echo ✗ Error al crear la base de datos
    echo.
    echo Asegurate de que:
    echo   1. MySQL este corriendo en XAMPP
    echo   2. Las credenciales sean correctas
    echo   3. El usuario tenga permisos para crear bases de datos
    echo.
)

pause

