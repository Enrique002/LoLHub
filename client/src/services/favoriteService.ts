'use strict';

import api from './api';

/**
 * Módulo de servicio de favoritos
 * Maneja todas las operaciones relacionadas con los campeones favoritos
 */

export interface RespuestaFavorito {
  success: boolean;
  message?: string;
  data?: any;
  is_favorite?: boolean;
}

/**
 * Servicio de favoritos
 * Proporciona métodos para gestionar los campeones favoritos del usuario
 */
export const servicioFavoritos = {
  /**
   * Obtiene la lista de campeones favoritos del usuario
   * @returns {Promise<any[]>} Lista de campeones favoritos
   */
  async obtenerFavoritos(): Promise<any[]> {
    const respuesta = await api.get<{ success: boolean; data: any[] }>('/favorites');
    return respuesta.data.data || [];
  },

  /**
   * Agrega un campeón a la lista de favoritos
   * @param {string} idCampeon - ID del campeón a agregar
   * @returns {Promise<RespuestaFavorito>} Respuesta de la operación
   */
  async agregarFavorito(idCampeon: string): Promise<RespuestaFavorito> {
    const respuesta = await api.post<RespuestaFavorito>('/favorites', { champion_id: idCampeon });
    return respuesta.data;
  },

  /**
   * Elimina un campeón de la lista de favoritos
   * @param {string} idCampeon - ID del campeón a eliminar
   * @returns {Promise<RespuestaFavorito>} Respuesta de la operación
   */
  async eliminarFavorito(idCampeon: string): Promise<RespuestaFavorito> {
    const respuesta = await api.delete<RespuestaFavorito>(`/favorites/${idCampeon}`);
    return respuesta.data;
  },

  /**
   * Verifica si un campeón está en la lista de favoritos
   * @param {string} idCampeon - ID del campeón a verificar
   * @returns {Promise<boolean>} true si es favorito, false en caso contrario
   */
  async verificarFavorito(idCampeon: string): Promise<boolean> {
    try {
      const respuesta = await api.get<{ success: boolean; is_favorite: boolean }>(`/favorites/check/${idCampeon}`);
      return respuesta.data.is_favorite;
    } catch (error) {
      return false;
    }
  },
};

// Exportar también con el nombre anterior para compatibilidad
export const favoriteService = {
  ...servicioFavoritos,
  // Alias en inglés para compatibilidad
  checkFavorite: servicioFavoritos.verificarFavorito,
  addFavorite: servicioFavoritos.agregarFavorito,
  removeFavorite: servicioFavoritos.eliminarFavorito,
  getFavorites: servicioFavoritos.obtenerFavoritos,
};

