<?php
/**
 * Archivo para manejar peticiones OPTIONS (preflight CORS)
 * Este archivo responde directamente a las peticiones OPTIONS sin pasar por Laravel
 */

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, X-XSRF-TOKEN');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Si no es OPTIONS, pasar a Laravel
require __DIR__.'/index.php';

