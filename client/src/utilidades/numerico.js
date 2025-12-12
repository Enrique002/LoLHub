'use strict';

export const esNumero = (valor: any): boolean => {
  return typeof valor === 'number' && !isNaN(valor) && isFinite(valor);
};

export const convertirANumero = (valor: any, valorPorDefecto: number = 0): number => {
  const numero = Number(valor);
  return esNumero(numero) ? numero : valorPorDefecto;
};

export const estaEnRango = (numero: number, minimo: number, maximo: number): boolean => {
  return numero >= minimo && numero <= maximo;
};

export const limitarARango = (numero: number, minimo: number, maximo: number): number => {
  if (numero < minimo) return minimo;
  if (numero > maximo) return maximo;
  return numero;
};

export const redondear = (numero: number, decimales: number = 2): number => {
  const factor = Math.pow(10, decimales);
  return Math.round(numero * factor) / factor;
};

export const calcularPorcentaje = (valor: number, total: number, decimales: number = 2): number => {
  if (total === 0) return 0;
  return redondear((valor / total) * 100, decimales);
};

export const numeroAleatorio = (minimo: number, maximo: number): number => {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
};

export const formatearMoneda = (cantidad: number, moneda: string = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: moneda,
  }).format(cantidad);
};

export const esPar = (numero: number): boolean => {
  return numero % 2 === 0;
};

export const esImpar = (numero: number): boolean => {
  return numero % 2 !== 0;
};

export const valorAbsoluto = (numero: number): number => {
  return Math.abs(numero);
};
