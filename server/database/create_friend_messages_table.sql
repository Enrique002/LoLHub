-- Script SQL para crear la tabla friend_messages
-- Ejecutar desde phpMyAdmin o línea de comandos MySQL

USE `lol_gg`;

CREATE TABLE IF NOT EXISTS `friend_messages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` bigint(20) unsigned NOT NULL,
  `receiver_id` bigint(20) unsigned NOT NULL,
  `message` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `friend_messages_sender_receiver_index` (`sender_id`,`receiver_id`),
  CONSTRAINT `friend_messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `friend_messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Tabla friend_messages creada exitosamente' AS mensaje;

