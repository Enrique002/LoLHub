'use strict';

import api from './api';

export const suggestionService = {
  async enviarSugerencia(datos) {
    await api.post('/suggestions', datos);
  },
};

