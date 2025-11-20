'use strict';

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { validarFormularioInicioSesion } from '../utilidades/validacion';

/**
 * Componente de formulario de inicio de sesión
 * Maneja la autenticación de usuarios con validación de datos
 */
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [contrasenya, setContrasenya] = useState('');
  const [mostrarContrasenya, setMostrarContrasenya] = useState(false);
  const [estaCargando, setEstaCargando] = useState(false);
  const { iniciarSesion } = useAuth();
  const toast = useToast();

  /**
   * Maneja el envío del formulario con validación previa
   * @param {React.FormEvent} evento - Evento del formulario
   */
  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    
    // Validar datos antes de enviar
    const validacion = validarFormularioInicioSesion({
      email,
      contrasenya,
    });
    
    if (!validacion.isValid) {
      validacion.errores.forEach((error) => {
        toast({
          title: 'Error de validación',
          description: error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
      return;
    }
    
    setEstaCargando(true);
    try {
      await iniciarSesion({ email, password: contrasenya });
    } catch (error) {
      // El error ya se maneja en el contexto
    } finally {
      setEstaCargando(false);
    }
  };

  const labelColor = useColorModeValue('whiteAlpha.900', 'whiteAlpha.900');
  const helperColor = useColorModeValue('whiteAlpha.700', 'whiteAlpha.600');
  const inputBg = 'rgba(255,255,255,0.05)';

  return (
    <Box w="full">
      <VStack spacing={6} align="flex-start" w="full" color="white">
        <VStack spacing={1} align="flex-start" w="full">
          <Heading color="white">Iniciar Sesión</Heading>
          <Text color={helperColor}>Ingresa tus credenciales para continuar</Text>
        </VStack>

        <form onSubmit={manejarEnvio} style={{ width: '100%' }}>
          <VStack spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel color={labelColor}>Email</FormLabel>
              <Input
                rounded="lg"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                bg={inputBg}
                borderColor="whiteAlpha.300"
                _hover={{ borderColor: 'gold.200' }}
                _focus={{ borderColor: 'gold.200', boxShadow: '0 0 0 1px rgba(250,191,36,0.8)' }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={labelColor}>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  rounded="lg"
                  type={mostrarContrasenya ? 'text' : 'password'}
                  value={contrasenya}
                  onChange={(evento) => setContrasenya(evento.target.value)}
                  bg={inputBg}
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: 'gold.200' }}
                  _focus={{ borderColor: 'gold.200', boxShadow: '0 0 0 1px rgba(250,191,36,0.8)' }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={mostrarContrasenya ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    icon={<Icon as={mostrarContrasenya ? EyeOff : Eye} />}
                    variant="ghost"
                    color="white"
                    onClick={() => setMostrarContrasenya(!mostrarContrasenya)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              rounded="lg"
              colorScheme="yellow"
              w="full"
              type="submit"
              isLoading={estaCargando}
              loadingText="Iniciando sesión..."
            >
              Iniciar Sesión
            </Button>
            <Text fontSize="sm" color={helperColor}>
              ¿No tienes cuenta?{' '}
              <Link as={RouterLink} to="/register" color="gold.200" fontWeight="semibold">
                Regístrate
              </Link>
            </Text>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default LoginForm;

