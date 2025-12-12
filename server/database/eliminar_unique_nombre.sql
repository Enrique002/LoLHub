-- Script SQL para eliminar la restricción única del campo nombre si existe
-- Ejecutar desde phpMyAdmin o línea de comandos MySQL
-- Esto permite que múltiples usuarios tengan el mismo nombre

USE `lol_gg`;

-- Primero, verificamos qué índices únicos existen en la tabla usuarios
-- Ejecuta esto para ver los índices:
-- SHOW INDEX FROM `usuarios` WHERE Non_unique = 0;

-- Eliminar índices únicos comunes en nombre (ejecuta solo los que correspondan)
-- Si obtienes un error "Unknown key", significa que ese índice no existe y puedes continuar

-- Opción 1: Si el índice se llama 'usuarios_nombre_unique'
SET @index_name = (
    SELECT CONSTRAINT_NAME 
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = 'lol_gg' 
    AND TABLE_NAME = 'usuarios' 
    AND COLUMN_NAME = 'nombre' 
    AND CONSTRAINT_NAME != 'PRIMARY'
    LIMIT 1
);

SET @sql = IF(@index_name IS NOT NULL, 
    CONCAT('ALTER TABLE `usuarios` DROP INDEX `', @index_name, '`'), 
    'SELECT "No se encontró índice único en nombre" AS mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar que solo el correo tenga restricción única
SELECT 'Restricción única de nombre eliminada (si existía)' AS mensaje;
SELECT 'Ahora múltiples usuarios pueden tener el mismo nombre' AS mensaje;
SELECT 'Solo el correo debe tener restricción única' AS nota;

