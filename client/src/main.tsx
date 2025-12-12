'use strict';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { theme } from './theme';
import { ProveedorAutenticacion } from './contexts/AuthContext';

/**
 * Punto de entrada de la aplicación
 * Renderiza la aplicación React en el DOM
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <ProveedorAutenticacion>
          <App />
        </ProveedorAutenticacion>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

