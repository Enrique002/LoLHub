<?php

/**
 * Script para crear la base de datos y ejecutar las migraciones
 * 
 * Uso:
 * php database/migrate_database.php
 * 
 * O desde la raíz del proyecto:
 * php artisan migrate:fresh
 */

require __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

// Cargar configuración de Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "========================================\n";
echo "Creación de Base de Datos lol_gg\n";
echo "========================================\n\n";

try {
    // Obtener configuración de la base de datos
    $host = env('DB_HOST', '127.0.0.1');
    $port = env('DB_PORT', '3306');
    $username = env('DB_USERNAME', 'root');
    $password = env('DB_PASSWORD', '');
    $database = 'lol_gg';
    
    echo "Conectando a MySQL...\n";
    
    // Conectar sin especificar base de datos para poder crearla
    $pdo = new PDO(
        "mysql:host={$host};port={$port};charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    
    echo "Creando base de datos '{$database}'...\n";
    
    // Crear la base de datos
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    echo "✓ Base de datos '{$database}' creada exitosamente\n\n";
    
    // Actualizar la configuración temporalmente para usar la nueva base de datos
    Config::set('database.connections.mysql.database', $database);
    DB::purge('mysql');
    
    echo "Ejecutando migraciones...\n";
    echo "Ejecuta: php artisan migrate\n";
    echo "O si quieres recrear todas las tablas: php artisan migrate:fresh\n\n";
    
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "\nAsegúrate de que:\n";
    echo "1. MySQL/MariaDB esté corriendo\n";
    echo "2. Las credenciales en .env sean correctas\n";
    echo "3. El usuario tenga permisos para crear bases de datos\n";
    exit(1);
}

echo "========================================\n";
echo "Proceso completado\n";
echo "========================================\n";

