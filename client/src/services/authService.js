'use strict';

import api from './api';

export const servicioAutenticacion = {
  async iniciarSesion(credenciales) {
    const respuesta = await api.post('/login', credenciales);
    return respuesta.data;
  },

  async registrar(datos) {
    const respuesta = await api.post('/register', datos);
    return respuesta.data;
  },

  async cerrarSesion() {
    await api.post('/logout');
  },

  async obtenerUsuarioActual() {
    const respuesta = await api.get('/me');
    return respuesta.data;
  },

  establecerToken(token) {
    localStorage.setItem('auth_token', token);
  },

  obtenerToken() {
    return localStorage.getItem('auth_token');
  },

  establecerUsuario(usuario) {
    localStorage.setItem('user', JSON.stringify(usuario));
  },

  obtenerUsuario() {
    const usuarioStr = localStorage.getItem('user');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  },

  limpiarAutenticacion() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  estaAutenticado() {
    return !!this.obtenerToken();
  },
};
