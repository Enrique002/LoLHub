-- Script SQL para crear la tabla suggestions
-- Ejecutar desde phpMyAdmin o línea de comandos MySQL

USE `lol_gg`;

CREATE TABLE IF NOT EXISTS `suggestions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Tabla suggestions creada exitosamente' AS mensaje;

