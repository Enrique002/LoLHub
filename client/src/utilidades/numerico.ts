'use strict';

/**
 * Módulo de funciones numéricas
 * Contiene funciones para operaciones y validaciones numéricas
 */

/**
 * Verifica si un valor es un número válido
 * @param {any} valor - Valor a verificar
 * @returns {boolean} true si es un número válido, false en caso contrario
 */
export const esNumero = (valor: any): boolean => {
  return typeof valor === 'number' && !isNaN(valor) && isFinite(valor);
};

/**
 * Convierte un valor a número, retornando un valor por defecto si falla
 * @param {any} valor - Valor a convertir
 * @param {number} valorPorDefecto - Valor por defecto si la conversión falla (por defecto 0)
 * @returns {number} Número convertido o valor por defecto
 */
export const convertirANumero = (valor: any, valorPorDefecto: number = 0): number => {
  const numero = Number(valor);
  return esNumero(numero) ? numero : valorPorDefecto;
};

/**
 * Verifica si un número está dentro de un rango
 * @param {number} numero - Número a verificar
 * @param {number} minimo - Valor mínimo del rango
 * @param {number} maximo - Valor máximo del rango
 * @returns {boolean} true si está en el rango, false en caso contrario
 */
export const estaEnRango = (numero: number, minimo: number, maximo: number): boolean => {
  return numero >= minimo && numero <= maximo;
};

/**
 * Limita un número a un rango específico
 * @param {number} numero - Número a limitar
 * @param {number} minimo - Valor mínimo permitido
 * @param {number} maximo - Valor máximo permitido
 * @returns {number} Número limitado al rango
 */
export const limitarARango = (numero: number, minimo: number, maximo: number): number => {
  if (numero < minimo) return minimo;
  if (numero > maximo) return maximo;
  return numero;
};

/**
 * Redondea un número a un número específico de decimales
 * @param {number} numero - Número a redondear
 * @param {number} decimales - Número de decimales (por defecto 2)
 * @returns {number} Número redondeado
 */
export const redondear = (numero: number, decimales: number = 2): number => {
  const factor = Math.pow(10, decimales);
  return Math.round(numero * factor) / factor;
};

/**
 * Calcula el porcentaje de un valor respecto a un total
 * @param {number} valor - Valor a calcular
 * @param {number} total - Valor total
 * @param {number} decimales - Número de decimales (por defecto 2)
 * @returns {number} Porcentaje calculado
 */
export const calcularPorcentaje = (valor: number, total: number, decimales: number = 2): number => {
  if (total === 0) return 0;
  return redondear((valor / total) * 100, decimales);
};

/**
 * Genera un número aleatorio dentro de un rango
 * @param {number} minimo - Valor mínimo
 * @param {number} maximo - Valor máximo
 * @returns {number} Número aleatorio en el rango
 */
export const numeroAleatorio = (minimo: number, maximo: number): number => {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
};

/**
 * Formatea un número como moneda en formato español
 * @param {number} cantidad - Cantidad a formatear
 * @param {string} moneda - Código de moneda (por defecto 'EUR')
 * @returns {string} Cantidad formateada como moneda
 */
export const formatearMoneda = (cantidad: number, moneda: string = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: moneda,
  }).format(cantidad);
};

/**
 * Verifica si un número es par
 * @param {number} numero - Número a verificar
 * @returns {boolean} true si es par, false si es impar
 */
export const esPar = (numero: number): boolean => {
  return numero % 2 === 0;
};

/**
 * Verifica si un número es impar
 * @param {number} numero - Número a verificar
 * @returns {boolean} true si es impar, false si es par
 */
export const esImpar = (numero: number): boolean => {
  return numero % 2 !== 0;
};

/**
 * Calcula el valor absoluto de un número
 * @param {number} numero - Número del que obtener el valor absoluto
 * @returns {number} Valor absoluto del número
 */
export const valorAbsoluto = (numero: number): number => {
  return Math.abs(numero);
};

