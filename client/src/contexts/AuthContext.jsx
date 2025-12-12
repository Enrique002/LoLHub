'use strict';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { 
  servicioAutenticacion
} from '../services/authService';

const ContextoAutenticacion = createContext(undefined);

export const usarAutenticacion = () => {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error('usarAutenticacion debe usarse dentro de un ProveedorAutenticacion');
  }
  return contexto;
};

export const ProveedorAutenticacion = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navegar = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const cargarUsuario = async () => {
      const usuarioGuardado = servicioAutenticacion.obtenerUsuario();
      const token = servicioAutenticacion.obtenerToken();

      if (token && usuarioGuardado) {
        try {
          const respuesta = await servicioAutenticacion.obtenerUsuarioActual();
          setUsuario(respuesta.user);
          servicioAutenticacion.establecerUsuario(respuesta.user);
        } catch (error) {
          servicioAutenticacion.limpiarAutenticacion();
          setUsuario(null);
        }
      }
      setCargando(false);
    };

    cargarUsuario();
  }, []);

  const iniciarSesion = async (credenciales) => {
    try {
      const respuesta = await servicioAutenticacion.iniciarSesion(credenciales);
      servicioAutenticacion.establecerToken(respuesta.token);
      servicioAutenticacion.establecerUsuario(respuesta.user);
      setUsuario(respuesta.user);
      
      toast({
        title: 'Inicio de sesión exitoso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navegar('/');
    } catch (error) {
      const mensajeError = error.response?.data?.message || 'Error al iniciar sesión';
      toast({
        title: 'Error al iniciar sesión',
        description: mensajeError,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    }
  };

  const registrar = async (datos) => {
    try {
      const respuesta = await servicioAutenticacion.registrar(datos);
      servicioAutenticacion.establecerToken(respuesta.token);
      servicioAutenticacion.establecerUsuario(respuesta.user);
      setUsuario(respuesta.user);
      
      toast({
        title: 'Registro exitoso',
        description: 'Tu cuenta ha sido creada correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navegar('/');
    } catch (error) {
      const mensajeError = error.response?.data?.message || 'Error al registrar';
      const errores = error.response?.data?.errors;
      
      toast({
        title: 'Error al registrar',
        description: errores ? Object.values(errores).flat().join(', ') : mensajeError,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    }
  };

  const cerrarSesion = async () => {
    try {
      await servicioAutenticacion.cerrarSesion();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      servicioAutenticacion.limpiarAutenticacion();
      setUsuario(null);
      toast({
        title: 'Sesión cerrada',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      navegar('/login');
    }
  };

  const valor = {
    usuario,
    cargando,
    iniciarSesion,
    registrar,
    cerrarSesion,
    estaAutenticado: !!usuario,
    actualizarUsuario: (usuarioActualizado) => {
      servicioAutenticacion.establecerUsuario(usuarioActualizado);
      setUsuario(usuarioActualizado);
    },
  };

  return <ContextoAutenticacion.Provider value={valor}>{children}</ContextoAutenticacion.Provider>;
};

export const useAuth = usarAutenticacion;
export const AuthProvider = ProveedorAutenticacion;
