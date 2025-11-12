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
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import { validarFormularioRegistro } from '../utilidades/validacion';

/**
 * Componente de formulario de registro
 * Maneja el registro de nuevos usuarios con validación completa de datos
 */
const RegisterForm: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenya, setContrasenya] = useState('');
  const [confirmacionContrasenya, setConfirmacionContrasenya] = useState('');
  const [mostrarContrasenya, setMostrarContrasenya] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [estaCargando, setEstaCargando] = useState(false);
  const toast = useToast();
  const { registrar } = useAuth();

  /**
   * Maneja el envío del formulario con validación previa
   * @param {React.FormEvent} evento - Evento del formulario
   */
  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    
    // Validar datos antes de enviar
    const validacion = validarFormularioRegistro({
      nombre,
      email,
      contrasenya,
      confirmacionContrasenya,
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
      await registrar({
        name: nombre,
        email,
        password: contrasenya,
        password_confirmation: confirmacionContrasenya,
      });
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
          <Heading color={useColorModeValue('gray.800', 'white')}>Crear cuenta</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>Regístrate para continuar</Text>
        </VStack>

        <form onSubmit={manejarEnvio}>
          <VStack spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                rounded="md"
                type="text"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
              />
            </FormControl>

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

            <FormControl isRequired>
              <FormLabel>Confirmar contraseña</FormLabel>
              <InputGroup>
                <Input
                  rounded="md"
                  type={mostrarConfirmacion ? 'text' : 'password'}
                  value={confirmacionContrasenya}
                  onChange={(evento) => setConfirmacionContrasenya(evento.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={mostrarConfirmacion ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    icon={mostrarConfirmacion ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    onClick={() => setMostrarConfirmacion(!mostrarConfirmacion)}
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
              loadingText="Registrando..."
            >
              Registrarse
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default RegisterForm;


