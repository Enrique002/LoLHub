'use strict';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { theme } from './theme';
import { ProveedorAutenticacion } from './contexts/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
ReactDOM.createRoot(rootElement).render(
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

