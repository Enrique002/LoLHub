import React from 'react'
import {
  Box,
  Flex,
  Link,
  Heading,
  Button,
  IconButton,
  useColorModeValue,
  HStack,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Avatar,
  Icon,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { ChevronDown, AtSign, MessageSquare, Menu as MenuIcon } from 'lucide-react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import SuggestionModal from './SuggestionModal'

const Navbar = () => {
  const location = useLocation()
  const { usuario, estaAutenticado, cerrarSesion, cargando } = useAuth()
  const [estaAbiertoModalSugerencia, setEstaAbiertoModalSugerencia] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const fondoNavbar = useColorModeValue('white', 'background.card')
  const colorTexto = useColorModeValue('gray.800', 'foreground.primary')
  const colorTextoHover = useColorModeValue('gold.300', 'gold.200')
  const colorEnlaceActivo = useColorModeValue('gold.300', 'gold.200')
  const fondoBotonHover = useColorModeValue('gray.100', 'background.secondary')
  const colorBorde = useColorModeValue('gray.200', 'background.muted')

  const estaActivo = (path) => location.pathname === path

  const manejarCerrarSesion = async () => {
    await cerrarSesion()
  }

  return (
    <Box
      bg={fondoNavbar}
      px={4}
      py={3}
      borderBottom="1px"
      borderColor={colorBorde}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
      transition="background-color 0.2s, border-color 0.2s"
    >
      <Flex maxW="1400px" mx="auto" align="center" justify="space-between" gap={4}>
        <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
          <Heading size="md" color={colorTexto} fontWeight="extrabold" letterSpacing="tight">
            <Box as="span" color="gold.200">
              LoL
            </Box>
            <Box as="span" ml={1}>
              Hub
            </Box>
          </Heading>
        </Link>

        <HStack spacing={1} display={{ base: 'none', md: 'flex' }}>
          <Link
            as={RouterLink}
            to="/"
            px={3}
            py={2}
            color={estaActivo('/') ? colorEnlaceActivo : colorTexto}
            fontWeight={estaActivo('/') ? 'semibold' : 'normal'}
            _hover={{ color: colorTextoHover, textDecoration: 'none' }}
            borderBottom={estaActivo('/') ? '2px solid' : '2px solid transparent'}
            borderColor={estaActivo('/') ? colorEnlaceActivo : 'transparent'}
            transition="all 0.2s"
          >
            Inicio
          </Link>
          <Link
            as={RouterLink}
            to="/champions"
            px={3}
            py={2}
          color={estaActivo('/champions') ? colorEnlaceActivo : colorTexto}
          fontWeight={estaActivo('/champions') ? 'semibold' : 'normal'}
          _hover={{ color: colorTextoHover, textDecoration: 'none' }}
          borderBottom={estaActivo('/champions') ? '2px solid' : '2px solid transparent'}
          borderColor={estaActivo('/champions') ? colorEnlaceActivo : 'transparent'}
            transition="all 0.2s"
          >
            Campeones
          </Link>
          <Link
            as={RouterLink}
            to="/items"
            px={3}
            py={2}
          color={estaActivo('/items') ? colorEnlaceActivo : colorTexto}
          fontWeight={estaActivo('/items') ? 'semibold' : 'normal'}
          _hover={{ color: colorTextoHover, textDecoration: 'none' }}
          borderBottom={estaActivo('/items') ? '2px solid' : '2px solid transparent'}
          borderColor={estaActivo('/items') ? colorEnlaceActivo : 'transparent'}
            transition="all 0.2s"
          >
            Objetos
          </Link>
          <Link
            as={RouterLink}
            to="/runas"
            px={3}
            py={2}
          color={estaActivo('/runas') ? colorEnlaceActivo : colorTexto}
          fontWeight={estaActivo('/runas') ? 'semibold' : 'normal'}
          _hover={{ color: colorTextoHover, textDecoration: 'none' }}
          borderBottom={estaActivo('/runas') ? '2px solid' : '2px solid transparent'}
          borderColor={estaActivo('/runas') ? colorEnlaceActivo : 'transparent'}
            transition="all 0.2s"
          >
            Runas
          </Link>
          <Link
            as={RouterLink}
            to="/comunidad"
            px={3}
            py={2}
          color={estaActivo('/comunidad') ? colorEnlaceActivo : colorTexto}
          fontWeight={estaActivo('/comunidad') ? 'semibold' : 'normal'}
          _hover={{ color: colorTextoHover, textDecoration: 'none' }}
          borderBottom={estaActivo('/comunidad') ? '2px solid' : '2px solid transparent'}
          borderColor={estaActivo('/comunidad') ? colorEnlaceActivo : 'transparent'}
            transition="all 0.2s"
          >
            Comunidad
          </Link>
          <Link
            as={RouterLink}
            to="/ranking"
            px={3}
            py={2}
          color={estaActivo('/ranking') ? colorEnlaceActivo : colorTexto}
          fontWeight={estaActivo('/ranking') ? 'semibold' : 'normal'}
          _hover={{ color: colorTextoHover, textDecoration: 'none' }}
          borderBottom={estaActivo('/ranking') ? '2px solid' : '2px solid transparent'}
          borderColor={estaActivo('/ranking') ? colorEnlaceActivo : 'transparent'}
            transition="all 0.2s"
          >
            Ranking
          </Link>
        </HStack>

        <IconButton
          aria-label="Menú"
          icon={<Icon as={MenuIcon} />}
          variant="ghost"
          color={colorTexto}
          _hover={{ color: colorTextoHover, bg: fondoBotonHover }}
          size="sm"
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
        />

        <Spacer />

        <HStack spacing={2}>
          <IconButton
            aria-label="Enviar sugerencia"
            icon={<Icon as={MessageSquare} />}
            variant="ghost"
            color={colorTexto}
            _hover={{ color: colorTextoHover, bg: fondoBotonHover }}
            size="sm"
            onClick={() => setEstaAbiertoModalSugerencia(true)}
          />
          {cargando ? null : estaAutenticado && usuario ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon as={ChevronDown} />}
                variant="ghost"
                size="sm"
                color={colorTexto}
                _hover={{ color: colorTextoHover, bg: fondoBotonHover }}
              >
                <HStack spacing={2}>
                  <Avatar size="xs" name={usuario.name} src={usuario.avatar_url ?? undefined} />
                  <Text display={{ base: 'none', md: 'block' }}>{usuario.name}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <Box px={3} py={2}>
                  <Text fontSize="sm" fontWeight="semibold">{usuario.name}</Text>
                  <Text fontSize="xs" color="gray.500">{usuario.email}</Text>
                </Box>
                <MenuItem as={RouterLink} to="/perfil">
                  Mi Perfil
                </MenuItem>
                <MenuItem onClick={manejarCerrarSesion} color="red.500">
                  Cerrar Sesión
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                size="sm"
                color={colorTexto}
                _hover={{ color: colorTextoHover, bg: fondoBotonHover }}
                display={{ base: 'none', md: 'flex' }}
              >
                Iniciar sesión
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                variant="default"
                size="sm"
                leftIcon={<Icon as={AtSign} />}
                _hover={{ transform: 'scale(1.05)' }}
                transition="all 0.2s"
                display={{ base: 'none', md: 'flex' }}
              >
                Registrarse
              </Button>
            </>
          )}
        </HStack>
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menú</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Link
                as={RouterLink}
                to="/"
                onClick={onClose}
                px={3}
                py={2}
                color={estaActivo('/') ? colorEnlaceActivo : colorTexto}
                fontWeight={estaActivo('/') ? 'semibold' : 'normal'}
                _hover={{ color: colorTextoHover, textDecoration: 'none', bg: fondoBotonHover }}
                borderRadius="md"
              >
                Inicio
              </Link>
              <Link
                as={RouterLink}
                to="/champions"
                onClick={onClose}
                px={3}
                py={2}
                color={estaActivo('/champions') ? colorEnlaceActivo : colorTexto}
                fontWeight={estaActivo('/champions') ? 'semibold' : 'normal'}
                _hover={{ color: colorTextoHover, textDecoration: 'none', bg: fondoBotonHover }}
                borderRadius="md"
              >
                Campeones
              </Link>
              <Link
                as={RouterLink}
                to="/items"
                onClick={onClose}
                px={3}
                py={2}
                color={estaActivo('/items') ? colorEnlaceActivo : colorTexto}
                fontWeight={estaActivo('/items') ? 'semibold' : 'normal'}
                _hover={{ color: colorTextoHover, textDecoration: 'none', bg: fondoBotonHover }}
                borderRadius="md"
              >
                Objetos
              </Link>
              <Link
                as={RouterLink}
                to="/runas"
                onClick={onClose}
                px={3}
                py={2}
                color={estaActivo('/runas') ? colorEnlaceActivo : colorTexto}
                fontWeight={estaActivo('/runas') ? 'semibold' : 'normal'}
                _hover={{ color: colorTextoHover, textDecoration: 'none', bg: fondoBotonHover }}
                borderRadius="md"
              >
                Runas
              </Link>
              <Link
                as={RouterLink}
                to="/comunidad"
                onClick={onClose}
                px={3}
                py={2}
                color={estaActivo('/comunidad') ? colorEnlaceActivo : colorTexto}
                fontWeight={estaActivo('/comunidad') ? 'semibold' : 'normal'}
                _hover={{ color: colorTextoHover, textDecoration: 'none', bg: fondoBotonHover }}
                borderRadius="md"
              >
                Comunidad
              </Link>
              <Link
                as={RouterLink}
                to="/ranking"
                onClick={onClose}
                px={3}
                py={2}
                color={estaActivo('/ranking') ? colorEnlaceActivo : colorTexto}
                fontWeight={estaActivo('/ranking') ? 'semibold' : 'normal'}
                _hover={{ color: colorTextoHover, textDecoration: 'none', bg: fondoBotonHover }}
                borderRadius="md"
              >
                Ranking
              </Link>
              <Button
                leftIcon={<Icon as={MessageSquare} />}
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  setEstaAbiertoModalSugerencia(true);
                  onClose();
                }}
              >
                Sugerencias
              </Button>
              {!cargando && !estaAutenticado && (
                <VStack spacing={2} w="100%">
                  <Button
                    as={RouterLink}
                    to="/login"
                    variant="outline"
                    onClick={onClose}
                    w="100%"
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/register"
                    colorScheme="yellow"
                    onClick={onClose}
                    w="100%"
                  >
                    Registrarse
                  </Button>
                </VStack>
              )}
              {!cargando && estaAutenticado && (
                <VStack spacing={2} w="100%">
                  <Button as={RouterLink} to="/perfil" onClick={onClose} w="100%">
                    Mi Perfil
                  </Button>
                  <Button onClick={manejarCerrarSesion} colorScheme="red" variant="outline" w="100%">
                    Cerrar sesión
                  </Button>
                </VStack>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <SuggestionModal isOpen={estaAbiertoModalSugerencia} onClose={() => setEstaAbiertoModalSugerencia(false)} />
    </Box>
  )
}

export default Navbar

