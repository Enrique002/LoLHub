'use strict';

import axios from 'axios';
import { API_BASE_URL } from '../config';

/**
 * Módulo de configuración de API
 * Crea y configura la instancia de axios para las peticiones HTTP
 */

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interceptor para agregar el token de autenticación a las peticiones
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para manejar errores de respuesta
 * Redirige al login si el token es inválido o ha expirado
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log del error para debugging
    console.error('API Error:', error);
    
    // Si no hay respuesta del servidor (timeout, CORS, etc.)
    if (!error.response) {
      console.error('No response from server:', error.message);
      return Promise.reject({
        ...error,
        message: 'No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.',
      });
    }
    
    // Si el token es inválido o ha expirado
    if (error.response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;

