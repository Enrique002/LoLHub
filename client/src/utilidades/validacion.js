'use strict';

export const validarEmail = (email) => {
  const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return expresionRegular.test(email);
};

export const validarContrasenya = (contrasenya) => {
  if (!contrasenya) {
    return { esValida: false, mensaje: 'La contraseña es requerida' };
  }
  
  const longitudMinima = 8;
  
  if (contrasenya.length < longitudMinima) {
    return { 
      esValida: false, 
      mensaje: `La contraseña debe tener al menos ${longitudMinima} caracteres` 
    };
  }
  
  if (!/[A-Z]/.test(contrasenya)) {
    return { 
      esValida: false, 
      mensaje: 'La contraseña debe contener al menos una letra mayúscula' 
    };
  }
  
  if (!/[0-9]/.test(contrasenya)) {
    return { 
      esValida: false, 
      mensaje: 'La contraseña debe contener al menos un número' 
    };
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(contrasenya)) {
    return { 
      esValida: false, 
      mensaje: 'La contraseña debe contener al menos un símbolo' 
    };
  }
  
  return { esValida: true, mensaje: '' };
};

export const validarConfirmacionContrasenya = (
  contrasenya, 
  confirmacionContrasenya
) => {
  if (contrasenya !== confirmacionContrasenya) {
    return { esValida: false, mensaje: 'Las contraseñas no coinciden' };
  }
  
  return { esValida: true, mensaje: '' };
};

export const validarCampoRequerido = (texto, nombreCampo) => {
  if (!texto || texto.trim().length === 0) {
    return { esValida: false, mensaje: `${nombreCampo} es requerido` };
  }
  
  return { esValida: true, mensaje: '' };
};

export const validarLongitudMinima = (
  texto, 
  longitudMinima, 
  nombreCampo
) => {
  if (!texto || texto.length < longitudMinima) {
    return { 
      esValida: false, 
      mensaje: `${nombreCampo} debe tener al menos ${longitudMinima} caracteres` 
    };
  }
  
  return { esValida: true, mensaje: '' };
};

export const validarLongitudMaxima = (
  texto, 
  longitudMaxima, 
  nombreCampo
) => {
  if (texto && texto.length > longitudMaxima) {
    return { 
      esValida: false, 
      mensaje: `${nombreCampo} no puede tener más de ${longitudMaxima} caracteres` 
    };
  }
  
  return { esValida: true, mensaje: '' };
};

export const validarFormularioRegistro = (datos) => {
  const errores = [];
  
  const validacionNombre = validarCampoRequerido(datos.nombre, 'Nombre');
  if (!validacionNombre.esValida) {
    errores.push(validacionNombre.mensaje);
  }
  
  if (!validarEmail(datos.email)) {
    errores.push('El email no tiene un formato válido');
  }
  
  const validacionContrasenya = validarContrasenya(datos.contrasenya);
  if (!validacionContrasenya.esValida) {
    errores.push(validacionContrasenya.mensaje);
  }
  
  const validacionConfirmacion = validarConfirmacionContrasenya(
    datos.contrasenya, 
    datos.confirmacionContrasenya
  );
  if (!validacionConfirmacion.esValida) {
    errores.push(validacionConfirmacion.mensaje);
  }
  
  return {
    esValida: errores.length === 0,
    errores,
  };
};

export const validarFormularioInicioSesion = (datos) => {
  const errores = [];
  
  if (!validarEmail(datos.email)) {
    errores.push('El email no tiene un formato válido');
  }
  
  const validacionContrasenya = validarCampoRequerido(datos.contrasenya, 'Contraseña');
  if (!validacionContrasenya.esValida) {
    errores.push(validacionContrasenya.mensaje);
  }
  
  return {
    esValida: errores.length === 0,
    errores,
  };
};
