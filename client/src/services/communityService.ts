'use strict';

import api from './api';

export type EstadoAmistad = 'none' | 'incoming' | 'outgoing' | 'friend';

export interface UsuarioComunidad {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
  status: EstadoAmistad;
}

export interface SolicitudAmistad {
  id: number;
  requester: {
    id: number;
    name: string;
    email: string;
    avatar_url?: string | null;
  };
  created_at: string;
}

export interface MensajeAmigo {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  read_at?: string | null;
  created_at: string;
}

export interface UsuarioBloqueado {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar_url?: string | null;
  };
  created_at: string;
}

export const servicioComunidad = {
  async obtenerUsuarios(): Promise<UsuarioComunidad[]> {
    const respuesta = await api.get<{ success: boolean; users: UsuarioComunidad[] }>('/community/users');
    return respuesta.data.users;
  },

  async obtenerSolicitudes(): Promise<SolicitudAmistad[]> {
    const respuesta = await api.get<{ success: boolean; requests: SolicitudAmistad[] }>('/community/requests');
    return respuesta.data.requests;
  },

  async enviarSolicitud(receiverId: number): Promise<void> {
    await api.post('/community/requests', { receiver_id: receiverId });
  },

  async aceptarSolicitud(id: number): Promise<void> {
    await api.post(`/community/requests/${id}/accept`);
  },

  async rechazarSolicitud(id: number): Promise<void> {
    await api.post(`/community/requests/${id}/reject`);
  },

  async obtenerMensajes(friendId: number): Promise<MensajeAmigo[]> {
    const respuesta = await api.get<{ success: boolean; messages: MensajeAmigo[] }>(
      `/community/messages/${friendId}`
    );
    return respuesta.data.messages;
  },

  async enviarMensaje(friendId: number, contenido: string): Promise<MensajeAmigo> {
    const respuesta = await api.post<{ success: boolean; message: MensajeAmigo }>(
      '/community/messages',
      {
        receiver_id: friendId,
        message: contenido,
      }
    );
    return respuesta.data.message;
  },

  async eliminarAmigo(friendId: number): Promise<void> {
    await api.delete(`/community/friends/${friendId}`);
  },

  async obtenerUsuariosBloqueados(): Promise<UsuarioBloqueado[]> {
    const respuesta = await api.get<{ success: boolean; blocked_users: UsuarioBloqueado[] }>(
      '/community/blocked'
    );
    return respuesta.data.blocked_users;
  },

  async bloquearUsuario(userId: number): Promise<void> {
    await api.post('/community/block', { user_id: userId });
  },

  async desbloquearUsuario(blockedUserId: number): Promise<void> {
    await api.delete(`/community/block/${blockedUserId}`);
  },
};

export const communityService = servicioComunidad;


