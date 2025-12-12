-- Script SQL para crear la base de datos lol_gg
-- Ejecutar este script como usuario root o con permisos de creación de bases de datos

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `lol_gg` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE `lol_gg`;

-- Mostrar mensaje de confirmación
SELECT 'Base de datos lol_gg creada exitosamente' AS mensaje;

