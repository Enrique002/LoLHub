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
  Icon,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Twitter, Github, Instagram, MessageCircle } from 'lucide-react'

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
            <VStack align="start" spacing={3}>
              <Link
                href="https://x.com/enrique0o"
                isExternal
                color={mutedColor}
                _hover={{ color: 'gold.200' }}
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={Twitter} boxSize={5} />
                @enrique0o
              </Link>
              <Link
                href="https://github.com/Enrique002"
                isExternal
                color={mutedColor}
                _hover={{ color: 'gold.200' }}
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={Github} boxSize={5} />
                @Enrique002
              </Link>
              <Link
                href="https://www.instagram.com/2002_enrique/"
                isExternal
                color={mutedColor}
                _hover={{ color: 'gold.200' }}
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={Instagram} boxSize={5} />
                @2002_enrique
              </Link>
              <Link
                href="https://www.tiktok.com/@riquirin"
                isExternal
                color={mutedColor}
                _hover={{ color: 'gold.200' }}
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={MessageCircle} boxSize={5} />
                @riquirin
              </Link>
            </VStack>
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

