-- Script SQL para crear la tabla blocked_users
-- Ejecutar desde phpMyAdmin o línea de comandos MySQL

USE `lol_gg`;

CREATE TABLE IF NOT EXISTS `blocked_users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `blocker_id` bigint(20) unsigned NOT NULL,
  `blocked_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blocked_users_blocker_id_blocked_id_unique` (`blocker_id`,`blocked_id`),
  KEY `blocked_users_blocked_id_foreign` (`blocked_id`),
  CONSTRAINT `blocked_users_blocker_id_foreign` FOREIGN KEY (`blocker_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `blocked_users_blocked_id_foreign` FOREIGN KEY (`blocked_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Tabla blocked_users creada exitosamente' AS mensaje;

