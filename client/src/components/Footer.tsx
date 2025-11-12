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
import { Twitter, Youtube, Github } from 'lucide-react'

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
                <Icon as={Twitter} boxSize={6} strokeWidth={2} />
              </Link>
              <Link
                href="https://youtube.com"
                isExternal
                color={mutedColor}
                _hover={{ color: 'gold.200', transform: 'scale(1.1)' }}
                transition="all 0.2s"
              >
                <Icon as={Youtube} boxSize={6} strokeWidth={2} />
              </Link>
              <Link
                href="https://github.com"
                isExternal
                color={mutedColor}
                _hover={{ color: 'gold.200', transform: 'scale(1.1)' }}
                transition="all 0.2s"
              >
                <Icon as={Github} boxSize={6} strokeWidth={2} />
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

