'use strict';

import api from './api';

export const servicioPerfil = {
  /**
   * Obtiene la información del perfil del usuario autenticado
   */
  async obtenerPerfil() {
    const respuesta = await api.get('/profile');
    return respuesta.data;
  },

  /**
   * Actualiza la información del perfil (avatar, banner o favoritos)
   */
  async actualizarPerfil(datos) {
    const config =
      datos instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;

    const respuesta = await api.post('/profile', datos, config);
    return respuesta.data;
  },
};

export const profileService = servicioPerfil;


