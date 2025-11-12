import React from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Container,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import heroBanner from '../assets/hero-banner.jpg'

// Iconos SVG personalizados
const ShieldIcon = ({ color, size = 32 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const UsersIcon = ({ color, size = 32 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const TrophyIcon = ({ color, size = 32 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
)

const Home: React.FC = () => {
  const cardBg = useColorModeValue('white', 'background.card')

  return (
    <Box>
      {/* Hero Section - Full Width */}
      <Box
        backgroundImage={`url(${heroBanner})`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        color="foreground.primary"
        py={{ base: 20, md: 32 }}
        position="relative"
        overflow="visible"
        minH={{ base: '500px', md: '700px' }}
        w="100%"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(15, 20, 25, 0.5) 0%, rgba(26, 31, 41, 0.4) 50%, rgba(15, 20, 25, 0.5) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        _after={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(240, 180, 41, 0.03) 0%, rgba(54, 197, 240, 0.03) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Fade out gradient at bottom */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="200px"
          background="linear-gradient(to bottom, transparent 0%, rgba(15, 20, 25, 0.3) 30%, rgba(15, 20, 25, 0.6) 60%, rgba(15, 20, 25, 0.9) 85%, rgba(15, 20, 25, 1) 100%)"
          pointerEvents="none"
          zIndex={0}
        />
        <Container maxW="1200px" position="relative" zIndex={1}>
          <VStack spacing={8} align="center" textAlign="center" mb={12}>
            <Heading
              size={{ base: '4xl', md: '6xl' }}
              fontWeight="extrabold"
              lineHeight="tight"
              letterSpacing="tight"
            >
              <Box as="span" color="gold.200" className="glow-gold">
                LoL
              </Box>
              <Box as="span" color="foreground.primary" ml={2}>
                Hub
              </Box>
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="800px" color="foreground.primary" lineHeight="relaxed">
              Tu portal definitivo para{' '}
              <Box as="span" color="magic.400" fontWeight="semibold">
                League of Legends
              </Box>
              . Descubre campeones, conecta con jugadores y domina la Grieta del Invocador.
            </Text>
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                as={RouterLink}
                to="/champions"
                size="lg"
                variant="default"
                rightIcon={<ArrowForwardIcon />}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Comenzar Ahora
              </Button>
              <Button
                as={RouterLink}
                to="/champions"
                size="lg"
                variant="outline"
                borderColor="gold.200"
                color="foreground.primary"
                _hover={{
                  bg: 'gold.200',
                  color: 'background.primary',
                  borderColor: 'gold.200',
                }}
              >
                Explorar campeones
              </Button>
            </HStack>
          </VStack>

          {/* Features Section - Top 3 Cards Over Banner */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} position="relative" zIndex={2}>
            <Box
              bg="rgba(26, 31, 41, 0.4)"
              backdropFilter="blur(16px)"
              p={6}
              borderRadius="lg"
              boxShadow="xl"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.15)"
              transition="all 0.2s"
              maxW="320px"
              mx="auto"
              _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl', borderColor: 'rgba(240, 180, 41, 0.5)' }}
            >
              <VStack spacing={4} align="center" textAlign="center">
                <Box>
                  <ShieldIcon color="#F0B429" size={32} />
                </Box>
                <Heading size="md" color="foreground.primary">
                  Perfiles Épicos
                </Heading>
                <Text color="foreground.muted" lineHeight="relaxed">
                  Personaliza tu perfil con tus campeones favoritos
                </Text>
              </VStack>
            </Box>
            <Box
              bg="rgba(26, 31, 41, 0.4)"
              backdropFilter="blur(16px)"
              p={6}
              borderRadius="lg"
              boxShadow="xl"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.15)"
              transition="all 0.2s"
              maxW="320px"
              mx="auto"
              _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl', borderColor: 'rgba(54, 197, 240, 0.5)' }}
            >
              <VStack spacing={4} align="center" textAlign="center">
                <Box>
                  <UsersIcon color="#36C5F0" size={32} />
                </Box>
                <Heading size="md" color="foreground.primary">
                  Comunidad Activa
                </Heading>
                <Text color="foreground.muted" lineHeight="relaxed">
                  Conecta con jugadores y forma equipos
                </Text>
              </VStack>
            </Box>
            <Box
              bg="rgba(26, 31, 41, 0.4)"
              backdropFilter="blur(16px)"
              p={6}
              borderRadius="lg"
              boxShadow="xl"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.15)"
              transition="all 0.2s"
              maxW="320px"
              mx="auto"
              _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl', borderColor: 'rgba(240, 180, 41, 0.5)' }}
            >
              <VStack spacing={4} align="center" textAlign="center">
                <Box>
                  <TrophyIcon color="#F0B429" size={32} />
                </Box>
                <Heading size="md" color="foreground.primary">
                  Sistema de Puntos
                </Heading>
                <Text color="foreground.muted" lineHeight="relaxed">
                  Gana puntos y desbloquea contenido exclusivo
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Container maxW="1200px" px={{ base: 4, md: 6 }} py={12}>
        {/* Explora los Campeones Section */}
        <VStack spacing={8} mb={16} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading
              size={{ base: '3xl', md: '4xl' }}
              fontWeight="extrabold"
              letterSpacing="tight"
              lineHeight="tight"
            >
              <Box as="span" color="foreground.primary">
                Explora los{' '}
              </Box>
              <Box as="span" color="gold.200">
                Campeones
              </Box>
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="foreground.muted" maxW="600px">
              Más de 160 campeones únicos esperan. Encuentra tu estilo de juego perfecto.
            </Text>
          </VStack>

          {/* Role Cards - Only 4 cards as per design */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={8}>
            {/* Asesino */}
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: '#EF4444' }}
            >
              <VStack spacing={4} align="center">
                <Box
                  bg={useColorModeValue('gray.100', '#2C2E3B')}
                  borderRadius="full"
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="64px"
                  h="64px"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L8 8h8l-4-6z" />
                    <path d="M12 8v14" />
                    <path d="M8 8h8" />
                    <circle cx="12" cy="6" r="1" fill="#EF4444" />
                  </svg>
                </Box>
                <Heading size="md" color={useColorModeValue('gray.800', 'foreground.primary')} textAlign="center">
                  Asesino
                </Heading>
                <Text color={useColorModeValue('gray.600', 'foreground.muted')} fontSize="sm" lineHeight="relaxed" textAlign="center">
                  Daño explosivo y movilidad
                </Text>
              </VStack>
            </Box>

            {/* Tanque */}
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: 'magic.400' }}
            >
              <VStack spacing={4} align="center">
                <Box
                  bg={useColorModeValue('gray.100', '#2C2E3B')}
                  borderRadius="full"
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="64px"
                  h="64px"
                >
                  <ShieldIcon color="#36C5F0" size={32} />
                </Box>
                <Heading size="md" color={useColorModeValue('gray.800', 'foreground.primary')} textAlign="center">
                  Tanque
                </Heading>
                <Text color={useColorModeValue('gray.600', 'foreground.muted')} fontSize="sm" lineHeight="relaxed" textAlign="center">
                  Resistencia y control
                </Text>
              </VStack>
            </Box>

            {/* Mago */}
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: '#A855F7' }}
            >
              <VStack spacing={4} align="center">
                <Box
                  bg={useColorModeValue('gray.100', '#2C2E3B')}
                  borderRadius="full"
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="64px"
                  h="64px"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v8M12 14v8" />
                    <path d="M12 10L8 14l4 4 4-4-4-4z" />
                    <path d="M5 3l2 2M19 3l-2 2M5 21l2-2M19 21l-2-2" />
                    <circle cx="3" cy="3" r="1.5" fill="#A855F7" />
                    <circle cx="21" cy="3" r="1.5" fill="#A855F7" />
                    <circle cx="3" cy="21" r="1.5" fill="#A855F7" />
                    <circle cx="21" cy="21" r="1.5" fill="#A855F7" />
                  </svg>
                </Box>
                <Heading size="md" color={useColorModeValue('gray.800', 'foreground.primary')} textAlign="center">
                  Mago
                </Heading>
                <Text color={useColorModeValue('gray.600', 'foreground.muted')} fontSize="sm" lineHeight="relaxed" textAlign="center">
                  Poder mágico devastador
                </Text>
              </VStack>
            </Box>

            {/* Tirador */}
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: 'gold.200' }}
            >
              <VStack spacing={4} align="center">
                <Box
                  bg={useColorModeValue('gray.100', '#2C2E3B')}
                  borderRadius="full"
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="64px"
                  h="64px"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F0B429" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </Box>
                <Heading size="md" color={useColorModeValue('gray.800', 'foreground.primary')} textAlign="center">
                  Tirador
                </Heading>
                <Text color={useColorModeValue('gray.600', 'foreground.muted')} fontSize="sm" lineHeight="relaxed" textAlign="center">
                  Daño sostenido a distancia
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* CTA Button */}
          <Box textAlign="center">
            <Button
              as={RouterLink}
              to="/champions"
              size="xl"
              variant="hero"
              fontSize="md"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Ver Todos Los Campeones
            </Button>
          </Box>
        </VStack>

        {/* Características Épicas Section */}
        <VStack spacing={8} mb={16} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading
              size={{ base: '3xl', md: '4xl' }}
              fontWeight="extrabold"
              letterSpacing="tight"
              lineHeight="tight"
            >
              <Box as="span" color="foreground.primary">
                Características{' '}
              </Box>
              <Box as="span" color="magic.400" className="glow-blue">
                Épicas
              </Box>
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="foreground.muted" maxW="700px">
              LoL Hub ofrece herramientas poderosas para mejorar tu experiencia
            </Text>
          </VStack>

          {/* Epic Features Grid 2x2 */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Lista de Favoritos */}
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            >
              <HStack spacing={4} align="start">
                <Box
                  bgGradient="linear(to-br, #EC4899, #EF4444)"
                  p={3}
                  borderRadius="md"
                  minW="48px"
                  minH="48px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </Box>
                <VStack align="start" spacing={2} flex={1}>
                  <Heading size="md" color={useColorModeValue('gray.800', 'foreground.primary')}>
                    Lista de Favoritos
                  </Heading>
                  <Text color={useColorModeValue('gray.600', 'foreground.muted')} fontSize="sm" lineHeight="relaxed">
                    Guarda y organiza tus campeones favoritos para acceder rápidamente a su información.
                  </Text>
                </VStack>
              </HStack>
            </Box>

            {/* Banners Personalizados */}
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            >
              <HStack spacing={4} align="start">
                <Box bg="gold.200" p={3} borderRadius="md" minW="48px" minH="48px" display="flex" alignItems="center" justifyContent="center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F1419" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </Box>
                <VStack align="start" spacing={2} flex={1}>
                  <Heading size="md" color={useColorModeValue('gray.800', 'foreground.primary')}>
                    Banners Personalizados
                  </Heading>
                  <Text color={useColorModeValue('gray.600', 'foreground.muted')} fontSize="sm" lineHeight="relaxed">
                    Desbloquea banners exclusivos ganando puntos por tu actividad en la plataforma.
                  </Text>
                </VStack>
              </HStack>
            </Box>

            {/* Chat en Tiempo Real */}
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            >
              <HStack spacing={4} align="start">
                <Box bg="magic.400" p={3} borderRadius="md" minW="48px" minH="48px" display="flex" alignItems="center" justifyContent="center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F1419" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </Box>
                <VStack align="start" spacing={2} flex={1}>
                  <Heading size="md" color={useColorModeValue('gray.800', 'foreground.primary')}>
                    Chat en Tiempo Real
                  </Heading>
                  <Text color={useColorModeValue('gray.600', 'foreground.muted')} fontSize="sm" lineHeight="relaxed">
                    Conecta con otros jugadores, forma equipos y comparte estrategias.
                  </Text>
                </VStack>
              </HStack>
            </Box>

            {/* Top 10 Ranking */}
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            >
              <HStack spacing={4} align="start">
                <Box bg="#A855F7" p={3} borderRadius="md" minW="48px" minH="48px" display="flex" alignItems="center" justifyContent="center">
                  <TrophyIcon color="#0F1419" size={24} />
                </Box>
                <VStack align="start" spacing={2} flex={1}>
                  <Heading size="md" color={useColorModeValue('gray.800', 'foreground.primary')}>
                    Top 10 Ranking
                  </Heading>
                  <Text color={useColorModeValue('gray.600', 'foreground.muted')} fontSize="sm" lineHeight="relaxed">
                    Compite por el primer lugar en nuestra tabla de clasificación de usuarios más activos.
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

export default Home
