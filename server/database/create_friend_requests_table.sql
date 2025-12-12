-- Script SQL para crear la tabla friend_requests
-- Ejecutar desde phpMyAdmin o línea de comandos MySQL

USE `lol_gg`;

-- Tabla de solicitudes de amistad
CREATE TABLE IF NOT EXISTS `friend_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `requester_id` bigint(20) unsigned NOT NULL,
  `receiver_id` bigint(20) unsigned NOT NULL,
  `status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  `accepted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `friend_requests_requester_id_receiver_id_unique` (`requester_id`,`receiver_id`),
  KEY `friend_requests_receiver_id_foreign` (`receiver_id`),
  CONSTRAINT `friend_requests_requester_id_foreign` FOREIGN KEY (`requester_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `friend_requests_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Tabla friend_requests creada exitosamente' AS mensaje;

