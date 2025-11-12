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
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
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

  return (
    <Box
      w={['full', 'md']}
      p={[8, 10]}
      mt={[20, '10vh']}
      mx="auto"
      border={['none', '1px']}
      borderColor={useColorModeValue('gray.300', 'gray.700')}
      borderRadius={10}
      bg={useColorModeValue('white', 'gray.800')}
    >
      <VStack spacing={4} align="flex-start" w="full">
        <VStack spacing={1} align={[ 'flex-start', 'center' ]} w="full">
          <Heading color={useColorModeValue('gray.800', 'white')}>Iniciar Sesión</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>Ingresa tus credenciales para continuar</Text>
        </VStack>

        <form onSubmit={manejarEnvio}>
          <VStack spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                rounded="md"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  rounded="md"
                  type={mostrarContrasenya ? 'text' : 'password'}
                  value={contrasenya}
                  onChange={(evento) => setContrasenya(evento.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={mostrarContrasenya ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    icon={mostrarContrasenya ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    onClick={() => setMostrarContrasenya(!mostrarContrasenya)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              rounded="md"
              colorScheme="blue"
              w="full"
              type="submit"
              isLoading={estaCargando}
              loadingText="Iniciando sesión..."
            >
              Iniciar Sesión
            </Button>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
              ¿No tienes cuenta?{' '}
              <Link as={RouterLink} to="/register" color="blue.500" _hover={{ color: 'blue.600' }}>
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

