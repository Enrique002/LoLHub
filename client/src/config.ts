'use strict';

/**
 * Módulo de configuración
 * Contiene las constantes de configuración de la aplicación
 */

export const VERSION_DATA_DRAGON = '15.21.1';

export const BASE_DATA_DRAGON = `https://ddragon.leagueoflegends.com/cdn/${VERSION_DATA_DRAGON}`;

/**
 * URL base de la API del backend
 * Para Docker: http://localhost:8000/api/v1
 * Para XAMPP con Apache: http://localhost/LoLHub-main/server/public/api/v1
 * O si configuras un VirtualHost: http://lol-gg.local/api/v1
 * Ajusta la ruta según donde tengas el proyecto
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Exportar también con los nombres anteriores para compatibilidad
export const DATA_DRAGON_VERSION = VERSION_DATA_DRAGON;
export const DATA_DRAGON_BASE = BASE_DATA_DRAGON;


