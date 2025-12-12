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
  DrawerFooter,
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

const Navbar: React.FC = () => {
  const location = useLocation()
  const { usuario, estaAutenticado, cerrarSesion, cargando } = useAuth()
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const navbarBackground = useColorModeValue('white', 'background.card')
  const textColor = useColorModeValue('gray.800', 'foreground.primary')
  const hoverTextColor = useColorModeValue('gold.300', 'gold.200')
  const activeLinkColor = useColorModeValue('gold.300', 'gold.200')
  const buttonHoverBg = useColorModeValue('gray.100', 'background.secondary')
  const borderColor = useColorModeValue('gray.200', 'background.muted')

  const isActive = (path: string) => location.pathname === path

  const manejarCerrarSesion = async () => {
    await cerrarSesion()
  }

  return (
    <Box
      bg={navbarBackground}
      px={4}
      py={3}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
      transition="background-color 0.2s, border-color 0.2s"
    >
      <Flex maxW="1400px" mx="auto" align="center" justify="space-between" gap={4}>
        <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
          <Heading size="md" color={textColor} fontWeight="extrabold" letterSpacing="tight">
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
            color={isActive('/') ? activeLinkColor : textColor}
            fontWeight={isActive('/') ? 'semibold' : 'normal'}
            _hover={{ color: hoverTextColor, textDecoration: 'none' }}
            borderBottom={isActive('/') ? '2px solid' : '2px solid transparent'}
            borderColor={isActive('/') ? activeLinkColor : 'transparent'}
            transition="all 0.2s"
          >
            Inicio
          </Link>
          <Link
            as={RouterLink}
            to="/champions"
            px={3}
            py={2}
            color={isActive('/champions') ? activeLinkColor : textColor}
            fontWeight={isActive('/champions') ? 'semibold' : 'normal'}
            _hover={{ color: hoverTextColor, textDecoration: 'none' }}
            borderBottom={isActive('/champions') ? '2px solid' : '2px solid transparent'}
            borderColor={isActive('/champions') ? activeLinkColor : 'transparent'}
            transition="all 0.2s"
          >
            Campeones
          </Link>
          <Link
            as={RouterLink}
            to="/items"
            px={3}
            py={2}
            color={isActive('/items') ? activeLinkColor : textColor}
            fontWeight={isActive('/items') ? 'semibold' : 'normal'}
            _hover={{ color: hoverTextColor, textDecoration: 'none' }}
            borderBottom={isActive('/items') ? '2px solid' : '2px solid transparent'}
            borderColor={isActive('/items') ? activeLinkColor : 'transparent'}
            transition="all 0.2s"
          >
            Objetos
          </Link>
          <Link
            as={RouterLink}
            to="/runas"
            px={3}
            py={2}
            color={isActive('/runas') ? activeLinkColor : textColor}
            fontWeight={isActive('/runas') ? 'semibold' : 'normal'}
            _hover={{ color: hoverTextColor, textDecoration: 'none' }}
            borderBottom={isActive('/runas') ? '2px solid' : '2px solid transparent'}
            borderColor={isActive('/runas') ? activeLinkColor : 'transparent'}
            transition="all 0.2s"
          >
            Runas
          </Link>
          <Link
            as={RouterLink}
            to="/comunidad"
            px={3}
            py={2}
            color={isActive('/comunidad') ? activeLinkColor : textColor}
            fontWeight={isActive('/comunidad') ? 'semibold' : 'normal'}
            _hover={{ color: hoverTextColor, textDecoration: 'none' }}
            borderBottom={isActive('/comunidad') ? '2px solid' : '2px solid transparent'}
            borderColor={isActive('/comunidad') ? activeLinkColor : 'transparent'}
            transition="all 0.2s"
          >
            Comunidad
          </Link>
          <Link
            as={RouterLink}
            to="/ranking"
            px={3}
            py={2}
            color={isActive('/ranking') ? activeLinkColor : textColor}
            fontWeight={isActive('/ranking') ? 'semibold' : 'normal'}
            _hover={{ color: hoverTextColor, textDecoration: 'none' }}
            borderBottom={isActive('/ranking') ? '2px solid' : '2px solid transparent'}
            borderColor={isActive('/ranking') ? activeLinkColor : 'transparent'}
            transition="all 0.2s"
          >
            Ranking
          </Link>
        </HStack>

        <IconButton
          aria-label="Menú"
          icon={<Icon as={MenuIcon} />}
          variant="ghost"
          color={textColor}
          _hover={{ color: hoverTextColor, bg: buttonHoverBg }}
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
            color={textColor}
            _hover={{ color: hoverTextColor, bg: buttonHoverBg }}
            size="sm"
            onClick={() => setIsSuggestionModalOpen(true)}
          />
          {cargando ? null : estaAutenticado && usuario ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon as={ChevronDown} />}
                variant="ghost"
                size="sm"
                color={textColor}
                _hover={{ color: hoverTextColor, bg: buttonHoverBg }}
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
                color={textColor}
                _hover={{ color: hoverTextColor, bg: buttonHoverBg }}
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
                color={isActive('/') ? activeLinkColor : textColor}
                fontWeight={isActive('/') ? 'semibold' : 'normal'}
                _hover={{ color: hoverTextColor, textDecoration: 'none', bg: buttonHoverBg }}
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
                color={isActive('/champions') ? activeLinkColor : textColor}
                fontWeight={isActive('/champions') ? 'semibold' : 'normal'}
                _hover={{ color: hoverTextColor, textDecoration: 'none', bg: buttonHoverBg }}
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
                color={isActive('/items') ? activeLinkColor : textColor}
                fontWeight={isActive('/items') ? 'semibold' : 'normal'}
                _hover={{ color: hoverTextColor, textDecoration: 'none', bg: buttonHoverBg }}
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
                color={isActive('/runas') ? activeLinkColor : textColor}
                fontWeight={isActive('/runas') ? 'semibold' : 'normal'}
                _hover={{ color: hoverTextColor, textDecoration: 'none', bg: buttonHoverBg }}
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
                color={isActive('/comunidad') ? activeLinkColor : textColor}
                fontWeight={isActive('/comunidad') ? 'semibold' : 'normal'}
                _hover={{ color: hoverTextColor, textDecoration: 'none', bg: buttonHoverBg }}
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
                color={isActive('/ranking') ? activeLinkColor : textColor}
                fontWeight={isActive('/ranking') ? 'semibold' : 'normal'}
                _hover={{ color: hoverTextColor, textDecoration: 'none', bg: buttonHoverBg }}
                borderRadius="md"
              >
                Ranking
              </Link>
              <Button
                leftIcon={<Icon as={MessageSquare} />}
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  setIsSuggestionModalOpen(true);
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

      <SuggestionModal isOpen={isSuggestionModalOpen} onClose={() => setIsSuggestionModalOpen(false)} />
    </Box>
  )
}

export default Navbar

