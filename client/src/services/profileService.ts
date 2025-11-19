'use strict';

import api from './api';
import { Usuario } from './authService';

export interface RespuestaPerfil {
  success: boolean;
  user: Usuario;
}

export const servicioPerfil = {
  /**
   * Obtiene la información del perfil del usuario autenticado
   */
  async obtenerPerfil(): Promise<RespuestaPerfil> {
    const respuesta = await api.get<RespuestaPerfil>('/profile');
    return respuesta.data;
  },

  /**
   * Actualiza la información del perfil (avatar, banner o favoritos)
   */
  async actualizarPerfil(
    datos: FormData | Record<string, unknown>
  ): Promise<RespuestaPerfil> {
    const config =
      datos instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;

    const respuesta = await api.post<RespuestaPerfil>('/profile', datos, config);
    return respuesta.data;
  },
};

export const profileService = servicioPerfil;


