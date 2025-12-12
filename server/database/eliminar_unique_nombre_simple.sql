-- Script SQL SIMPLE para eliminar la restricción única del campo nombre
-- Ejecutar desde phpMyAdmin o línea de comandos MySQL
-- Esto permite que múltiples usuarios tengan el mismo nombre

USE `lol_gg`;

-- PASO 1: Ver qué índices únicos existen (ejecuta esto primero para ver el nombre del índice)
-- SHOW INDEX FROM `usuarios` WHERE Non_unique = 0;

-- PASO 2: Ejecuta uno de estos comandos según el nombre del índice que encontraste
-- (Si obtienes error "Unknown key", prueba el siguiente)

-- Opción más común:
ALTER TABLE `usuarios` DROP INDEX `usuarios_nombre_unique`;

-- Si el anterior no funciona, prueba estos:
-- ALTER TABLE `usuarios` DROP INDEX `nombre_unique`;
-- ALTER TABLE `usuarios` DROP INDEX `nombre`;

-- Verificar resultado
SHOW INDEX FROM `usuarios` WHERE Non_unique = 0;

SELECT 'Restricción única de nombre eliminada' AS mensaje;
SELECT 'Ahora múltiples usuarios pueden tener el mismo nombre' AS mensaje;

