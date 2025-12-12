'use strict';

import api from './api';

/**
 * Módulo de servicio de favoritos
 * Maneja todas las operaciones relacionadas con los campeones favoritos
 */

/**
 * Servicio de favoritos
 * Proporciona métodos para gestionar los campeones favoritos del usuario
 */
export const servicioFavoritos = {
  /**
   * Obtiene la lista de campeones favoritos del usuario
   * @returns {Promise<any[]>} Lista de campeones favoritos
   */
  async obtenerFavoritos() {
    const respuesta = await api.get('/favorites');
    return respuesta.data?.data || [];
  },

  /**
   * Agrega un campeón a la lista de favoritos
   * @param {string} idCampeon - ID del campeón a agregar
   * @returns {Promise<RespuestaFavorito>} Respuesta de la operación
   */
  async agregarFavorito(idCampeon) {
    const respuesta = await api.post('/favorites', { champion_id: idCampeon });
    return respuesta.data;
  },

  /**
   * Elimina un campeón de la lista de favoritos
   * @param {string} idCampeon - ID del campeón a eliminar
   * @returns {Promise<RespuestaFavorito>} Respuesta de la operación
   */
  async eliminarFavorito(idCampeon) {
    const respuesta = await api.delete(`/favorites/${idCampeon}`);
    return respuesta.data;
  },

  /**
   * Verifica si un campeón está en la lista de favoritos
   * @param {string} idCampeon - ID del campeón a verificar
   * @returns {Promise<boolean>} true si es favorito, false en caso contrario
   */
  async verificarFavorito(idCampeon) {
    try {
      const respuesta = await api.get(`/favorites/check/${idCampeon}`);
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

