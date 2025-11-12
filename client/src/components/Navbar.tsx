import React from 'react'
import {
  Box,
  Flex,
  Link,
  Heading,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  HStack,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Avatar,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon, ChevronDownIcon, AtSignIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  const navbarBackground = useColorModeValue('white', 'background.card')
  const textColor = useColorModeValue('gray.800', 'foreground.primary')
  const hoverTextColor = useColorModeValue('gold.300', 'gold.200')
  const activeLinkColor = useColorModeValue('gold.300', 'gold.200')
  const buttonHoverBg = useColorModeValue('gray.100', 'background.secondary')
  const borderColor = useColorModeValue('gray.200', 'background.muted')

  const isActive = (path: string) => location.pathname === path

  const handleLogout = async () => {
    await logout()
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

        <Spacer />

        <HStack spacing={2}>
          <IconButton
            aria-label="Toggle color mode"
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            variant="ghost"
            color={textColor}
            _hover={{ color: hoverTextColor, bg: buttonHoverBg }}
            size="sm"
          />
          {isAuthenticated && user ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
                size="sm"
                color={textColor}
                _hover={{ color: hoverTextColor, bg: buttonHoverBg }}
              >
                <HStack spacing={2}>
                  <Avatar size="xs" name={user.name} />
                  <Text display={{ base: 'none', md: 'block' }}>{user.name}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <Box px={3} py={2}>
                  <Text fontSize="sm" fontWeight="semibold">{user.name}</Text>
                  <Text fontSize="xs" color="gray.500">{user.email}</Text>
                </Box>
                <MenuItem onClick={handleLogout} color="red.500">
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
                leftIcon={<AtSignIcon />}
                _hover={{ transform: 'scale(1.05)' }}
                transition="all 0.2s"
              >
                Registrarse
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}

export default Navbar

