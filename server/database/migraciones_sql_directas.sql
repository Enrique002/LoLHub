-- Script SQL para crear todas las tablas directamente
-- Usa este script si no puedes ejecutar las migraciones de Laravel
-- Ejecutar desde phpMyAdmin o línea de comandos MySQL

USE `lol_gg`;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `correo_verificado_en` timestamp NULL DEFAULT NULL,
  `contrasenya` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_correo_unique` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tokens de reseteo de contraseña
CREATE TABLE IF NOT EXISTS `tokens_reseteo_contrasenya` (
  `correo` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `creado_en` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de sesiones
CREATE TABLE IF NOT EXISTS `sesiones` (
  `id` varchar(255) NOT NULL,
  `id_usuario` bigint(20) unsigned DEFAULT NULL,
  `direccion_ip` varchar(45) DEFAULT NULL,
  `agente_usuario` text DEFAULT NULL,
  `datos` longtext NOT NULL,
  `ultima_actividad` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sesiones_id_usuario_index` (`id_usuario`),
  KEY `sesiones_ultima_actividad_index` (`ultima_actividad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tokens de acceso personal (Sanctum)
CREATE TABLE IF NOT EXISTS `tokens_acceso_personal` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `habilidades` text DEFAULT NULL,
  `ultimo_uso_en` timestamp NULL DEFAULT NULL,
  `expira_en` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tokens_acceso_personal_token_unique` (`token`),
  KEY `tokens_acceso_personal_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de campeones
CREATE TABLE IF NOT EXISTS `campeones` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_campeon` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `historia` text DEFAULT NULL,
  `etiquetas` json DEFAULT NULL,
  `estadisticas` json DEFAULT NULL,
  `habilidades` json DEFAULT NULL,
  `recomendados` json DEFAULT NULL,
  `url_imagen` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `campeones_id_campeon_unique` (`id_campeon`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de objetos
CREATE TABLE IF NOT EXISTS `objetos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_objeto` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `texto_plano` text DEFAULT NULL,
  `etiquetas` json DEFAULT NULL,
  `estadisticas` json DEFAULT NULL,
  `oro_total` int(11) NOT NULL DEFAULT 0,
  `oro_base` int(11) NOT NULL DEFAULT 0,
  `oro_venta` int(11) NOT NULL DEFAULT 0,
  `comprable` tinyint(1) NOT NULL DEFAULT 1,
  `mapas` json DEFAULT NULL,
  `url_imagen` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `objetos_id_objeto_unique` (`id_objeto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de builds
CREATE TABLE IF NOT EXISTS `builds` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) unsigned NOT NULL,
  `id_campeon` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `objetos` json NOT NULL,
  `descripcion` text DEFAULT NULL,
  `es_publica` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `builds_id_usuario_foreign` (`id_usuario`),
  CONSTRAINT `builds_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de campeones favoritos
CREATE TABLE IF NOT EXISTS `campeones_favoritos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) unsigned NOT NULL,
  `id_campeon` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `campeones_favoritos_id_usuario_id_campeon_unique` (`id_usuario`,`id_campeon`),
  CONSTRAINT `campeones_favoritos_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de cache
CREATE TABLE IF NOT EXISTS `cache` (
  `clave` varchar(255) NOT NULL,
  `valor` mediumtext NOT NULL,
  `expiracion` int(11) NOT NULL,
  PRIMARY KEY (`clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de bloqueos de cache
CREATE TABLE IF NOT EXISTS `bloqueos_cache` (
  `clave` varchar(255) NOT NULL,
  `propietario` varchar(255) NOT NULL,
  `expiracion` int(11) NOT NULL,
  PRIMARY KEY (`clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de trabajos
CREATE TABLE IF NOT EXISTS `trabajos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cola` varchar(255) NOT NULL,
  `datos` longtext NOT NULL,
  `intentos` tinyint(3) unsigned NOT NULL,
  `reservado_en` int(10) unsigned DEFAULT NULL,
  `disponible_en` int(10) unsigned NOT NULL,
  `creado_en` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trabajos_cola_index` (`cola`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de lotes de trabajos
CREATE TABLE IF NOT EXISTS `lotes_trabajos` (
  `id` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `total_trabajos` int(11) NOT NULL,
  `trabajos_pendientes` int(11) NOT NULL,
  `trabajos_fallidos` int(11) NOT NULL,
  `ids_trabajos_fallidos` longtext NOT NULL,
  `opciones` mediumtext DEFAULT NULL,
  `cancelado_en` int(11) DEFAULT NULL,
  `creado_en` int(11) NOT NULL,
  `finalizado_en` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de trabajos fallidos
CREATE TABLE IF NOT EXISTS `trabajos_fallidos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `conexion` text NOT NULL,
  `cola` text NOT NULL,
  `datos` longtext NOT NULL,
  `excepcion` longtext NOT NULL,
  `fallido_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `trabajos_fallidos_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- Tabla de mensajes entre amigos
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

-- Tabla de usuarios bloqueados
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

-- Tabla de sugerencias
CREATE TABLE IF NOT EXISTS `suggestions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Todas las tablas creadas exitosamente' AS mensaje;

