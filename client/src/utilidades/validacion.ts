'use strict';

/**
 * Módulo de funciones de validación
 * Contiene funciones para validar datos de formularios y entradas de usuario
 */

/**
 * Valida si un email tiene un formato válido
 * @param {string} email - Email a validar
 * @returns {boolean} true si el email es válido, false en caso contrario
 */
export const validarEmail = (email: string): boolean => {
  const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return expresionRegular.test(email);
};

/**
 * Valida si una contraseña cumple con los requisitos mínimos
 * @param {string} contrasenya - Contraseña a validar
 * @param {number} longitudMinima - Longitud mínima requerida (por defecto 6)
 * @returns {object} Objeto con isValid (boolean) y mensaje (string)
 */
export const validarContrasenya = (contrasenya: string, longitudMinima: number = 6): { isValid: boolean; mensaje: string } => {
  if (!contrasenya) {
    return { isValid: false, mensaje: 'La contraseña es requerida' };
  }
  
  if (contrasenya.length < longitudMinima) {
    return { 
      isValid: false, 
      mensaje: `La contraseña debe tener al menos ${longitudMinima} caracteres` 
    };
  }
  
  return { isValid: true, mensaje: '' };
};

/**
 * Valida si dos contraseñas coinciden
 * @param {string} contrasenya - Primera contraseña
 * @param {string} confirmacionContrasenya - Segunda contraseña para confirmar
 * @returns {object} Objeto con isValid (boolean) y mensaje (string)
 */
export const validarConfirmacionContrasenya = (
  contrasenya: string, 
  confirmacionContrasenya: string
): { isValid: boolean; mensaje: string } => {
  if (contrasenya !== confirmacionContrasenya) {
    return { isValid: false, mensaje: 'Las contraseñas no coinciden' };
  }
  
  return { isValid: true, mensaje: '' };
};

/**
 * Valida si un campo de texto no está vacío
 * @param {string} texto - Texto a validar
 * @param {string} nombreCampo - Nombre del campo para el mensaje de error
 * @returns {object} Objeto con isValid (boolean) y mensaje (string)
 */
export const validarCampoRequerido = (texto: string, nombreCampo: string): { isValid: boolean; mensaje: string } => {
  if (!texto || texto.trim().length === 0) {
    return { isValid: false, mensaje: `${nombreCampo} es requerido` };
  }
  
  return { isValid: true, mensaje: '' };
};

/**
 * Valida si un texto tiene una longitud mínima
 * @param {string} texto - Texto a validar
 * @param {number} longitudMinima - Longitud mínima requerida
 * @param {string} nombreCampo - Nombre del campo para el mensaje de error
 * @returns {object} Objeto con isValid (boolean) y mensaje (string)
 */
export const validarLongitudMinima = (
  texto: string, 
  longitudMinima: number, 
  nombreCampo: string
): { isValid: boolean; mensaje: string } => {
  if (!texto || texto.length < longitudMinima) {
    return { 
      isValid: false, 
      mensaje: `${nombreCampo} debe tener al menos ${longitudMinima} caracteres` 
    };
  }
  
  return { isValid: true, mensaje: '' };
};

/**
 * Valida si un texto tiene una longitud máxima
 * @param {string} texto - Texto a validar
 * @param {number} longitudMaxima - Longitud máxima permitida
 * @param {string} nombreCampo - Nombre del campo para el mensaje de error
 * @returns {object} Objeto con isValid (boolean) y mensaje (string)
 */
export const validarLongitudMaxima = (
  texto: string, 
  longitudMaxima: number, 
  nombreCampo: string
): { isValid: boolean; mensaje: string } => {
  if (texto && texto.length > longitudMaxima) {
    return { 
      isValid: false, 
      mensaje: `${nombreCampo} no puede tener más de ${longitudMaxima} caracteres` 
    };
  }
  
  return { isValid: true, mensaje: '' };
};

/**
 * Valida un formulario completo de registro
 * @param {object} datos - Objeto con los datos del formulario
 * @returns {object} Objeto con isValid (boolean) y errores (array de strings)
 */
export const validarFormularioRegistro = (datos: {
  nombre: string;
  email: string;
  contrasenya: string;
  confirmacionContrasenya: string;
}): { isValid: boolean; errores: string[] } => {
  const errores: string[] = [];
  
  // Validar nombre
  const validacionNombre = validarCampoRequerido(datos.nombre, 'Nombre');
  if (!validacionNombre.isValid) {
    errores.push(validacionNombre.mensaje);
  }
  
  // Validar email
  if (!validarEmail(datos.email)) {
    errores.push('El email no tiene un formato válido');
  }
  
  // Validar contraseña
  const validacionContrasenya = validarContrasenya(datos.contrasenya);
  if (!validacionContrasenya.isValid) {
    errores.push(validacionContrasenya.mensaje);
  }
  
  // Validar confirmación de contraseña
  const validacionConfirmacion = validarConfirmacionContrasenya(
    datos.contrasenya, 
    datos.confirmacionContrasenya
  );
  if (!validacionConfirmacion.isValid) {
    errores.push(validacionConfirmacion.mensaje);
  }
  
  return {
    isValid: errores.length === 0,
    errores,
  };
};

/**
 * Valida un formulario completo de inicio de sesión
 * @param {object} datos - Objeto con los datos del formulario
 * @returns {object} Objeto con isValid (boolean) y errores (array de strings)
 */
export const validarFormularioInicioSesion = (datos: {
  email: string;
  contrasenya: string;
}): { isValid: boolean; errores: string[] } => {
  const errores: string[] = [];
  
  // Validar email
  if (!validarEmail(datos.email)) {
    errores.push('El email no tiene un formato válido');
  }
  
  // Validar contraseña
  const validacionContrasenya = validarCampoRequerido(datos.contrasenya, 'Contraseña');
  if (!validacionContrasenya.isValid) {
    errores.push(validacionContrasenya.mensaje);
  }
  
  return {
    isValid: errores.length === 0,
    errores,
  };
};

