'use strict';

import api from './api';

export const servicioComunidad = {
  async obtenerUsuarios() {
    const respuesta = await api.get('/community/users');
    return respuesta.data.users;
  },

  async obtenerSolicitudes() {
    const respuesta = await api.get('/community/requests');
    return respuesta.data.requests;
  },

  async enviarSolicitud(receiverId) {
    await api.post('/community/requests', { receiver_id: receiverId });
  },

  async aceptarSolicitud(id) {
    await api.post(`/community/requests/${id}/accept`);
  },

  async rechazarSolicitud(id) {
    await api.post(`/community/requests/${id}/reject`);
  },

  async obtenerMensajes(friendId) {
    const respuesta = await api.get(`/community/messages/${friendId}`);
    return respuesta.data.messages;
  },

  async enviarMensaje(friendId, contenido) {
    const respuesta = await api.post('/community/messages', {
      receiver_id: friendId,
      message: contenido,
    });
    return respuesta.data.message;
  },

  async eliminarAmigo(friendId) {
    await api.delete(`/community/friends/${friendId}`);
  },

  async obtenerUsuariosBloqueados() {
    const respuesta = await api.get('/community/blocked');
    return respuesta.data.blocked_users;
  },

  async bloquearUsuario(userId) {
    await api.post('/community/block', { user_id: userId });
  },

  async desbloquearUsuario(blockedUserId) {
    await api.delete(`/community/block/${blockedUserId}`);
  },

  // Equipos ideales
  async obtenerEquipoIdeal() {
    const respuesta = await api.get('/community/ideal-team');
    return respuesta.data.team;
  },

  async obtenerEquiposAmigos() {
    const respuesta = await api.get('/community/ideal-teams/friends');
    return respuesta.data.teams;
  },

  async obtenerEquipoAmigo(friendId) {
    const respuesta = await api.get(`/community/ideal-teams/friend/${friendId}`);
    return respuesta.data.team;
  },

  async guardarEquipoIdeal(datos) {
    const respuesta = await api.post('/community/ideal-team', datos);
    return respuesta.data.team;
  },

  async eliminarEquipoIdeal() {
    await api.delete('/community/ideal-team');
  },

  async agregarComentario(teamId, comentario) {
    const respuesta = await api.post(`/community/ideal-teams/${teamId}/comments`, { comentario });
    return respuesta.data.comment;
  },

  async eliminarComentario(commentId) {
    await api.delete(`/community/team-comments/${commentId}`);
  },

  async obtenerComentarios(teamId, page = 1, perPage = 5) {
    const respuesta = await api.get(`/community/ideal-teams/${teamId}/comments`, {
      params: { page, per_page: perPage },
    });
    return respuesta.data;
  },
};

export const communityService = servicioComunidad;


