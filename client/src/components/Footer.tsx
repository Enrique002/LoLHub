import React from 'react'
import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  Heading,
  Link,
  Text,
  HStack,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

// Iconos SVG para redes sociales
const TwitterIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
)

const YouTubeIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

const GitHubIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const Footer: React.FC = () => {
  const textColor = useColorModeValue('gray.800', 'foreground.primary')
  const mutedColor = useColorModeValue('gray.600', 'foreground.muted')
  const borderColor = useColorModeValue('gray.200', 'background.muted')

  return (
    <Box as="footer" bg="background.primary" color="foreground.primary" mt={20}>
      <Container maxW="1200px" py={12}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} mb={8}>
          {/* Columna 1: Brand */}
          <VStack align="start" spacing={4}>
            <Heading size="md" fontWeight="extrabold" letterSpacing="tight">
              <Box as="span" color="gold.200">
                LoL
              </Box>
              <Box as="span" ml={1}>
                Hub
              </Box>
            </Heading>
            <Text fontSize="sm" color={mutedColor} lineHeight="relaxed">
              Tu portal definitivo para League of Legends. Descubre, conecta y domina.
            </Text>
          </VStack>

          {/* Columna 2: Enlaces */}
          <VStack align="start" spacing={4}>
            <Heading size="sm" fontWeight="bold" color={textColor}>
              Enlaces
            </Heading>
            <VStack align="start" spacing={2}>
              <Link as={RouterLink} to="/" color={mutedColor} _hover={{ color: 'gold.200' }} fontSize="sm">
                Inicio
              </Link>
              <Link as={RouterLink} to="/champions" color={mutedColor} _hover={{ color: 'gold.200' }} fontSize="sm">
                Campeones
              </Link>
              <Link as={RouterLink} to="/comunidad" color={mutedColor} _hover={{ color: 'gold.200' }} fontSize="sm">
                Comunidad
              </Link>
              <Link as={RouterLink} to="/ranking" color={mutedColor} _hover={{ color: 'gold.200' }} fontSize="sm">
                Ranking
              </Link>
            </VStack>
          </VStack>

          {/* Columna 3: Recursos */}
          <VStack align="start" spacing={4}>
            <Heading size="sm" fontWeight="bold" color={textColor}>
              Recursos
            </Heading>
            <VStack align="start" spacing={2}>
              <Link as={RouterLink} to="/guias" color={mutedColor} _hover={{ color: 'gold.200' }} fontSize="sm">
                Guías
              </Link>
              <Link as={RouterLink} to="/faq" color={mutedColor} _hover={{ color: 'gold.200' }} fontSize="sm">
                FAQ
              </Link>
              <Link as={RouterLink} to="/soporte" color={mutedColor} _hover={{ color: 'gold.200' }} fontSize="sm">
                Soporte
              </Link>
              <Link as={RouterLink} to="/terminos" color={mutedColor} _hover={{ color: 'gold.200' }} fontSize="sm">
                Términos de uso
              </Link>
            </VStack>
          </VStack>

          {/* Columna 4: Síguenos */}
          <VStack align="start" spacing={4}>
            <Heading size="sm" fontWeight="bold" color={textColor}>
              Síguenos
            </Heading>
            <HStack spacing={4}>
              <Link
                href="https://twitter.com"
                isExternal
                color={mutedColor}
                _hover={{ color: 'gold.200', transform: 'scale(1.1)' }}
                transition="all 0.2s"
              >
                <TwitterIcon size={24} />
              </Link>
              <Link
                href="https://youtube.com"
                isExternal
                color={mutedColor}
                _hover={{ color: 'gold.200', transform: 'scale(1.1)' }}
                transition="all 0.2s"
              >
                <YouTubeIcon size={24} />
              </Link>
              <Link
                href="https://github.com"
                isExternal
                color={mutedColor}
                _hover={{ color: 'gold.200', transform: 'scale(1.1)' }}
                transition="all 0.2s"
              >
                <GitHubIcon size={24} />
              </Link>
            </HStack>
          </VStack>
        </SimpleGrid>

        <Divider borderColor={borderColor} mb={6} />

        {/* Copyright */}
        <Text textAlign="center" fontSize="sm" color={mutedColor}>
          © 2025 LoL Hub. Proyecto educativo no oficial. League of Legends y Riot Games son marcas registradas de Riot Games, Inc.
        </Text>
      </Container>
    </Box>
  )
}

export default Footer

