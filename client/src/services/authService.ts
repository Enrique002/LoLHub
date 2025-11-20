'use strict';

import api from './api';

/**
 * Módulo de servicio de autenticación
 * Maneja todas las operaciones relacionadas con la autenticación de usuarios
 */

export interface Usuario {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string | null;
  banner_url?: string | null;
  favorite_items?: string[];
  favorite_runes?: string[];
  selected_decoration_key?: string | null;
  selected_decoration?: {
    key: string;
    title: string;
    description?: string | null;
    icon: string;
    color: string;
  } | null;
}

export interface RespuestaAutenticacion {
  success: boolean;
  message: string;
  user: Usuario;
  token: string;
}

export interface CredencialesInicioSesion {
  email: string;
  password: string;
}

export interface DatosRegistro {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Servicio de autenticación
 * Proporciona métodos para login, registro, logout y gestión de tokens
 */
export const servicioAutenticacion = {
  /**
   * Inicia sesión con las credenciales proporcionadas
   * @param {CredencialesInicioSesion} credenciales - Email y contraseña del usuario
   * @returns {Promise<RespuestaAutenticacion>} Respuesta con token y datos del usuario
   */
  async iniciarSesion(credenciales: CredencialesInicioSesion): Promise<RespuestaAutenticacion> {
    const respuesta = await api.post<RespuestaAutenticacion>('/login', credenciales);
    return respuesta.data;
  },

  /**
   * Registra un nuevo usuario
   * @param {DatosRegistro} datos - Datos del nuevo usuario
   * @returns {Promise<RespuestaAutenticacion>} Respuesta con token y datos del usuario
   */
  async registrar(datos: DatosRegistro): Promise<RespuestaAutenticacion> {
    const respuesta = await api.post<RespuestaAutenticacion>('/register', datos);
    return respuesta.data;
  },

  /**
   * Cierra la sesión del usuario actual
   * @returns {Promise<void>}
   */
  async cerrarSesion(): Promise<void> {
    await api.post('/logout');
  },

  /**
   * Obtiene los datos del usuario autenticado
   * @returns {Promise<{success: boolean; user: Usuario}>} Datos del usuario
   */
  async obtenerUsuarioActual(): Promise<{ success: boolean; user: Usuario }> {
    const respuesta = await api.get<{ success: boolean; user: Usuario }>('/me');
    return respuesta.data;
  },

  /**
   * Guarda el token de autenticación en el almacenamiento local
   * @param {string} token - Token de autenticación
   */
  establecerToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  /**
   * Obtiene el token de autenticación del almacenamiento local
   * @returns {string|null} Token de autenticación o null si no existe
   */
  obtenerToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  /**
   * Guarda los datos del usuario en el almacenamiento local
   * @param {Usuario} usuario - Datos del usuario
   */
  establecerUsuario(usuario: Usuario): void {
    localStorage.setItem('user', JSON.stringify(usuario));
  },

  /**
   * Obtiene los datos del usuario del almacenamiento local
   * @returns {Usuario|null} Datos del usuario o null si no existen
   */
  obtenerUsuario(): Usuario | null {
    const usuarioStr = localStorage.getItem('user');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  },

  /**
   * Limpia todos los datos de autenticación del almacenamiento local
   */
  limpiarAutenticacion(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} true si está autenticado, false en caso contrario
   */
  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  },
};

