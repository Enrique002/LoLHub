'use strict';

import api from './api';

export interface DatosSugerencia {
  name?: string;
  message: string;
}

export const suggestionService = {
  async enviarSugerencia(datos: DatosSugerencia): Promise<void> {
    await api.post('/suggestions', datos);
  },
};

