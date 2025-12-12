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
import { Shield, Users, Trophy, ArrowRight, Wand2, Target, Heart, Star, MessageCircle, Sword, Axe, HeartHandshake } from 'lucide-react'
import heroBanner from '../assets/hero-banner.jpg'

const Home = () => {
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
                rightIcon={<Icon as={ArrowRight} />}
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
                  <Icon as={Shield} color="#F0B429" boxSize={8} strokeWidth={2} />
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
                  <Icon as={Users} color="#36C5F0" boxSize={8} strokeWidth={2} />
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
                  <Icon as={Trophy} color="#F0B429" boxSize={8} strokeWidth={2} />
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

          {/* Role Cards */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing={6} mb={8}>
            {/* Asesino */}
            <Box
              as={RouterLink}
              to="/champions?role=Assassin"
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              cursor="pointer"
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
                  <Icon as={Sword} color="#EF4444" boxSize={8} strokeWidth={2} />
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
              as={RouterLink}
              to="/champions?role=Tank"
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              cursor="pointer"
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
                  <Icon as={Shield} color="#36C5F0" boxSize={8} strokeWidth={2} />
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
              as={RouterLink}
              to="/champions?role=Mage"
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              cursor="pointer"
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
                  <Icon as={Wand2} color="#A855F7" boxSize={8} strokeWidth={2} />
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
              as={RouterLink}
              to="/champions?role=Marksman"
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              cursor="pointer"
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
                  <Icon as={Target} color="#F0B429" boxSize={8} strokeWidth={2} />
                </Box>
                <Heading size="md" color={useColorModeValue('gray.800', 'foreground.primary')} textAlign="center">
                  Tirador
                </Heading>
                <Text color={useColorModeValue('gray.600', 'foreground.muted')} fontSize="sm" lineHeight="relaxed" textAlign="center">
                  Daño sostenido a distancia
                </Text>
              </VStack>
            </Box>

            {/* Luchador */}
            <Box
              as={RouterLink}
              to="/champions?role=Fighter"
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              cursor="pointer"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: '#F97316' }}
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
                  <Icon as={Axe} color="#F97316" boxSize={8} strokeWidth={2} />
                </Box>
                <Heading size="md" color={useColorModeValue('gray.800', 'foreground.primary')} textAlign="center">
                  Luchador
                </Heading>
                <Text color={useColorModeValue('gray.600', 'foreground.muted')} fontSize="sm" lineHeight="relaxed" textAlign="center">
                  Combate cuerpo a cuerpo
                </Text>
              </VStack>
            </Box>

            {/* Apoyo */}
            <Box
              as={RouterLink}
              to="/champions?role=Support"
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'background.muted')}
              transition="all 0.2s"
              cursor="pointer"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: '#10B981' }}
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
                  <Icon as={HeartHandshake} color="#10B981" boxSize={8} strokeWidth={2} />
                </Box>
                <Heading size="md" color={useColorModeValue('gray.800', 'foreground.primary')} textAlign="center">
                  Apoyo
                </Heading>
                <Text color={useColorModeValue('gray.600', 'foreground.muted')} fontSize="sm" lineHeight="relaxed" textAlign="center">
                  Protección y utilidad
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
                  <Icon as={Heart} color="white" boxSize={6} strokeWidth={2} fill="white" />
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
                  <Icon as={Star} color="#0F1419" boxSize={6} strokeWidth={2} fill="#0F1419" />
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
                  <Icon as={MessageCircle} color="#0F1419" boxSize={6} strokeWidth={2} />
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
                  <Icon as={Trophy} color="#0F1419" boxSize={6} strokeWidth={2} />
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
