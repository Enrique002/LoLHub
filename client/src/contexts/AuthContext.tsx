'use strict';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { 
  servicioAutenticacion, 
  Usuario, 
  CredencialesInicioSesion, 
  DatosRegistro 
} from '../services/authService';

/**
 * Tipo del contexto de autenticación
 */
interface TipoContextoAutenticacion {
  usuario: Usuario | null;
  cargando: boolean;
  iniciarSesion: (credenciales: CredencialesInicioSesion) => Promise<void>;
  registrar: (datos: DatosRegistro) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  estaAutenticado: boolean;
  actualizarUsuario: (usuarioActualizado: Usuario) => void;
}

const ContextoAutenticacion = createContext<TipoContextoAutenticacion | undefined>(undefined);

/**
 * Hook para acceder al contexto de autenticación
 * @returns {TipoContextoAutenticacion} Contexto de autenticación
 */
export const usarAutenticacion = () => {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error('usarAutenticacion debe usarse dentro de un ProveedorAutenticacion');
  }
  return contexto;
};

interface PropsProveedorAutenticacion {
  children: ReactNode;
}

/**
 * Proveedor de contexto de autenticación
 * Gestiona el estado de autenticación de la aplicación
 */
export const ProveedorAutenticacion: React.FC<PropsProveedorAutenticacion> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const navegar = useNavigate();
  const toast = useToast();

  /**
   * Carga el usuario al iniciar la aplicación
   */
  useEffect(() => {
    const cargarUsuario = async () => {
      const usuarioGuardado = servicioAutenticacion.obtenerUsuario();
      const token = servicioAutenticacion.obtenerToken();

      if (token && usuarioGuardado) {
        try {
          // Verificar que el token sigue siendo válido
          const respuesta = await servicioAutenticacion.obtenerUsuarioActual();
          setUsuario(respuesta.user);
          servicioAutenticacion.establecerUsuario(respuesta.user);
        } catch (error) {
          // Token inválido, limpiar
          servicioAutenticacion.limpiarAutenticacion();
          setUsuario(null);
        }
      }
      setCargando(false);
    };

    cargarUsuario();
  }, []);

  /**
   * Inicia sesión con las credenciales proporcionadas
   * @param {CredencialesInicioSesion} credenciales - Email y contraseña
   */
  const iniciarSesion = async (credenciales: CredencialesInicioSesion) => {
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
    } catch (error: any) {
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

  /**
   * Registra un nuevo usuario
   * @param {DatosRegistro} datos - Datos del nuevo usuario
   */
  const registrar = async (datos: DatosRegistro) => {
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
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      let mensajeError = 'Error al registrar';
      if (error.response?.data?.message) {
        mensajeError = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errores = error.response.data.errors;
        mensajeError = Object.values(errores).flat().join(', ');
      } else if (error.message) {
        mensajeError = error.message;
      } else if (error.code === 'ECONNABORTED') {
        mensajeError = 'La petición tardó demasiado. El servidor puede estar dormido. Intenta de nuevo.';
      } else if (!error.response) {
        mensajeError = 'No se pudo conectar con el servidor. Verifica que el backend esté funcionando.';
      }
      
      toast({
        title: 'Error al registrar',
        description: mensajeError,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  /**
   * Cierra la sesión del usuario actual
   */
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

  const valor: TipoContextoAutenticacion = {
    usuario,
    cargando,
    iniciarSesion,
    registrar,
    cerrarSesion,
    estaAutenticado: !!usuario,
    actualizarUsuario: (usuarioActualizado: Usuario) => {
      servicioAutenticacion.establecerUsuario(usuarioActualizado);
      setUsuario(usuarioActualizado);
    },
  };

  return <ContextoAutenticacion.Provider value={valor}>{children}</ContextoAutenticacion.Provider>;
};

// Exportar también con el nombre anterior para compatibilidad
export const useAuth = usarAutenticacion;
export const AuthProvider = ProveedorAutenticacion;

