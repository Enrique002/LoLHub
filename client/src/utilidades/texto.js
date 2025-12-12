'use strict';

export const convertirAMinusculas = (texto) => {
  return texto.toLowerCase();
};

export const convertirAMayusculas = (texto) => {
  return texto.toUpperCase();
};

export const eliminarEspacios = (texto) => {
  return texto.trim();
};

export const reemplazarEspacios = (texto, reemplazo = '_') => {
  return texto.replace(/\s+/g, reemplazo);
};

export const convertirASlug = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const contarPalabras = (texto) => {
  if (!texto || texto.trim().length === 0) return 0;
  return texto.trim().split(/\s+/).length;
};

export const extraerPrimeraPalabra = (texto) => {
  if (!texto) return '';
  const palabras = texto.trim().split(/\s+/);
  return palabras[0] || '';
};

export const contieneTexto = (texto, busqueda) => {
  return texto.toLowerCase().includes(busqueda.toLowerCase());
};

export const resaltarTexto = (
  texto, 
  termino, 
  etiquetaApertura = '<mark>', 
  etiquetaCierre = '</mark>'
) => {
  if (!termino) return texto;
  const expresionRegular = new RegExp(`(${termino})`, 'gi');
  return texto.replace(expresionRegular, `${etiquetaApertura}$1${etiquetaCierre}`);
};
