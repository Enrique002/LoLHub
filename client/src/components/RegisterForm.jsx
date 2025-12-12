'use strict';

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validarFormularioRegistro } from '../utilidades/validacion';

const RegisterForm = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenya, setContrasenya] = useState('');
  const [confirmacionContrasenya, setConfirmacionContrasenya] = useState('');
  const [mostrarContrasenya, setMostrarContrasenya] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [estaCargando, setEstaCargando] = useState(false);
  const toast = useToast();
  const { registrar } = useAuth();

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    
    const validacion = validarFormularioRegistro({
      nombre,
      email,
      contrasenya,
      confirmacionContrasenya,
    });
    
    if (!validacion.esValida) {
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
    } finally {
      setEstaCargando(false);
    }
  };

  const labelColor = useColorModeValue('whiteAlpha.900', 'whiteAlpha.900');
  const helperColor = useColorModeValue('whiteAlpha.700', 'whiteAlpha.600');
  const inputBg = 'rgba(255,255,255,0.05)';

  return (
    <Box w="full" color="white">
      <VStack spacing={6} align="flex-start" w="full">
        <VStack spacing={1} align="flex-start" w="full">
          <Heading color="white">Crear cuenta</Heading>
          <Text color={helperColor}>Regístrate para continuar</Text>
        </VStack>

        <form onSubmit={manejarEnvio} style={{ width: '100%' }}>
          <VStack spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel color={labelColor}>Nombre</FormLabel>
              <Input
                rounded="lg"
                type="text"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                bg={inputBg}
                borderColor="whiteAlpha.300"
                _hover={{ borderColor: 'gold.200' }}
                _focus={{ borderColor: 'gold.200', boxShadow: '0 0 0 1px rgba(250,191,36,0.8)' }}
              />
            </FormControl>

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
              <FormHelperText color={helperColor} fontSize="xs" mt={1}>
                Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo
              </FormHelperText>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={labelColor}>Confirmar contraseña</FormLabel>
              <InputGroup>
                <Input
                  rounded="lg"
                  type={mostrarConfirmacion ? 'text' : 'password'}
                  value={confirmacionContrasenya}
                  onChange={(evento) => setConfirmacionContrasenya(evento.target.value)}
                  bg={inputBg}
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: 'gold.200' }}
                  _focus={{ borderColor: 'gold.200', boxShadow: '0 0 0 1px rgba(250,191,36,0.8)' }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={mostrarConfirmacion ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    icon={<Icon as={mostrarConfirmacion ? EyeOff : Eye} />}
                    variant="ghost"
                    color="white"
                    onClick={() => setMostrarConfirmacion(!mostrarConfirmacion)}
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
