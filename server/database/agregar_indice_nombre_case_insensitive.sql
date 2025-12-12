-- Script SQL para agregar índice único case-insensitive al campo nombre
-- Esto evita que haya dos usuarios con el mismo nombre sin importar mayúsculas/minúsculas
-- Ejecutar desde phpMyAdmin o línea de comandos MySQL

USE `lol_gg`;

-- PASO 1: Agregar una columna virtual que almacene el nombre en minúsculas
ALTER TABLE `usuarios` 
ADD COLUMN `nombre_lowercase` VARCHAR(255) 
GENERATED ALWAYS AS (LOWER(TRIM(`nombre`))) VIRTUAL;

-- PASO 2: Crear índice único en la columna virtual
CREATE UNIQUE INDEX `usuarios_nombre_lowercase_unique` ON `usuarios`(`nombre_lowercase`);

-- Verificar que el índice se creó correctamente
SHOW INDEX FROM `usuarios` WHERE Column_name = 'nombre_lowercase';

SELECT 'Índice único case-insensitive agregado correctamente' AS mensaje;
SELECT 'Ahora no se pueden registrar dos usuarios con el mismo nombre (ej: Enrique y enrique)' AS mensaje;

