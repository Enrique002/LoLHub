'use strict';

import api from './api';

export const missionsService = {
  async obtenerProgreso() {
    const response = await api.get('/missions/progress');
    return response.data;
  },
  async obtenerRanking() {
    const response = await api.get('/missions/ranking');
    return response.data;
  },
};


