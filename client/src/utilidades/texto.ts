'use strict';

/**
 * Módulo de funciones de manipulación de texto
 * Contiene funciones para procesar, transformar y manipular cadenas de texto
 */

/**
 * Convierte un texto a minúsculas
 * @param {string} texto - Texto a convertir
 * @returns {string} Texto en minúsculas
 */
export const convertirAMinusculas = (texto: string): string => {
  return texto.toLowerCase();
};

/**
 * Convierte un texto a mayúsculas
 * @param {string} texto - Texto a convertir
 * @returns {string} Texto en mayúsculas
 */
export const convertirAMayusculas = (texto: string): string => {
  return texto.toUpperCase();
};

/**
 * Elimina espacios en blanco al inicio y final de un texto
 * @param {string} texto - Texto a limpiar
 * @returns {string} Texto sin espacios al inicio y final
 */
export const eliminarEspacios = (texto: string): string => {
  return texto.trim();
};

/**
 * Reemplaza todos los espacios en blanco por un carácter específico
 * @param {string} texto - Texto a procesar
 * @param {string} reemplazo - Carácter de reemplazo (por defecto '_')
 * @returns {string} Texto con espacios reemplazados
 */
export const reemplazarEspacios = (texto: string, reemplazo: string = '_'): string => {
  return texto.replace(/\s+/g, reemplazo);
};

/**
 * Convierte un texto a formato slug (URL amigable)
 * @param {string} texto - Texto a convertir
 * @returns {string} Texto en formato slug
 */
export const convertirASlug = (texto: string): string => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Cuenta el número de palabras en un texto
 * @param {string} texto - Texto a analizar
 * @returns {number} Número de palabras
 */
export const contarPalabras = (texto: string): number => {
  if (!texto || texto.trim().length === 0) return 0;
  return texto.trim().split(/\s+/).length;
};

/**
 * Extrae la primera palabra de un texto
 * @param {string} texto - Texto del que extraer la palabra
 * @returns {string} Primera palabra del texto
 */
export const extraerPrimeraPalabra = (texto: string): string => {
  if (!texto) return '';
  const palabras = texto.trim().split(/\s+/);
  return palabras[0] || '';
};

/**
 * Verifica si un texto contiene una subcadena (búsqueda case-insensitive)
 * @param {string} texto - Texto en el que buscar
 * @param {string} busqueda - Subcadena a buscar
 * @returns {boolean} true si contiene la subcadena, false en caso contrario
 */
export const contieneTexto = (texto: string, busqueda: string): boolean => {
  return texto.toLowerCase().includes(busqueda.toLowerCase());
};

/**
 * Resalta una palabra o frase dentro de un texto
 * @param {string} texto - Texto completo
 * @param {string} termino - Término a resaltar
 * @param {string} etiquetaApertura - Etiqueta HTML de apertura (por defecto '<mark>')
 * @param {string} etiquetaCierre - Etiqueta HTML de cierre (por defecto '</mark>')
 * @returns {string} Texto con el término resaltado
 */
export const resaltarTexto = (
  texto: string, 
  termino: string, 
  etiquetaApertura: string = '<mark>', 
  etiquetaCierre: string = '</mark>'
): string => {
  if (!termino) return texto;
  const expresionRegular = new RegExp(`(${termino})`, 'gi');
  return texto.replace(expresionRegular, `${etiquetaApertura}$1${etiquetaCierre}`);
};

