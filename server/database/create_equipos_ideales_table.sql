-- Script SQL para crear las tablas de equipos ideales y comentarios
-- Ejecutar desde phpMyAdmin o línea de comandos MySQL

USE `lol_gg`;

-- Tabla de equipos ideales
CREATE TABLE IF NOT EXISTS `equipos_ideales` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) unsigned NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `campeones` json NOT NULL,
  `objetos` json DEFAULT NULL,
  `runas` json DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipos_ideales_id_usuario_unique` (`id_usuario`),
  CONSTRAINT `equipos_ideales_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de comentarios en equipos
CREATE TABLE IF NOT EXISTS `comentarios_equipos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_equipo` bigint(20) unsigned NOT NULL,
  `id_usuario` bigint(20) unsigned NOT NULL,
  `comentario` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comentarios_equipos_id_equipo_foreign` (`id_equipo`),
  KEY `comentarios_equipos_id_usuario_foreign` (`id_usuario`),
  CONSTRAINT `comentarios_equipos_id_equipo_foreign` FOREIGN KEY (`id_equipo`) REFERENCES `equipos_ideales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comentarios_equipos_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Tablas de equipos ideales creadas exitosamente' AS mensaje;

