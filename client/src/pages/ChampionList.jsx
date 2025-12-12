import React, { useState, useEffect, useMemo } from 'react'
import {
  SimpleGrid,
  Box,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  HStack,
  Button,
  Wrap,
  WrapItem,
  Text,
  Heading,
  Container,
  Divider,
  Icon,
} from '@chakra-ui/react'
import { Search, Star } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { DATA_DRAGON_BASE } from '../config'
import ChampionCard from '../components/ChampionCard'
import Loading from '../components/Loading'
import { useAuth } from '../contexts/AuthContext'
import { favoriteService } from '../services/favoriteService'

const ChampionList = () => {
  const { estaAutenticado } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [champions, setChampions] = useState([])
  const [campeonesFavoritos, setCampeonesFavoritos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const roleFromUrl = searchParams.get('role')
  const [selectedRole, setSelectedRole] = useState(roleFromUrl && ['Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'].includes(roleFromUrl) ? roleFromUrl : 'All')
  const [loading, setLoading] = useState(true)
  const [cargandoFavoritos, setCargandoFavoritos] = useState(false)
  const [favoritosInicializados, setFavoritosInicializados] = useState(false)

  // Sincronizar el rol de la URL con el estado
  useEffect(() => {
    const roleFromUrl = searchParams.get('role')
    if (roleFromUrl && ['Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'].includes(roleFromUrl)) {
      setSelectedRole(roleFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const response = await axios.get(`${DATA_DRAGON_BASE}/data/es_ES/champion.json`)
        const championsData = Object.values(response.data?.data || {})
        setChampions(championsData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching champions:', error)
        setLoading(false)
      }
    }

    fetchChampions()
  }, [])

  useEffect(() => {
    if (estaAutenticado) {
      obtenerFavoritos(true)
    } else {
      setCampeonesFavoritos([])
      setFavoritosInicializados(false)
    }
  }, [estaAutenticado])

  /**
   * Obtiene la lista de campeones favoritos del usuario
   */
  const obtenerFavoritos = async (mostrarIndicador = false) => {
    if (mostrarIndicador) {
      setCargandoFavoritos(true)
    }
    try {
      const favoritos = await favoriteService.obtenerFavoritos()
      setCampeonesFavoritos(favoritos)
    } catch (error) {
      console.error('Error obteniendo favoritos:', error)
    } finally {
      if (mostrarIndicador) {
        setCargandoFavoritos(false)
      }
      setFavoritosInicializados(true)
    }
  }

  /**
   * Maneja los cambios en los favoritos
   */
  const manejarCambioFavorito = (campeon, esFavorito) => {
    setCampeonesFavoritos((prev) => {
      if (esFavorito) {
        if (prev.some((fav) => fav.id === campeon.id)) {
          return prev
        }
        return [...prev, campeon]
      }
      return prev.filter((fav) => fav.id !== campeon.id)
    })

    // Sincronizar con el backend en segundo plano
    obtenerFavoritos()
  }

  const idsFavoritos = useMemo(() => new Set(campeonesFavoritos.map((fav) => fav.id)), [campeonesFavoritos])

  /**
   * Filtra los campeones según la búsqueda y el rol seleccionado
   * Excluye los campeones que ya están en favoritos para evitar duplicados
   */
  const filteredChampions = useMemo(() => {
    let filtered = champions

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((champion) =>
        champion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        champion.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por rol
    if (selectedRole !== 'All') {
      filtered = filtered.filter((champion) =>
        champion.tags?.includes(selectedRole)
      )
    }

    // Excluir campeones que ya están en favoritos (opcional, para que no aparezcan duplicados)
    // Si quieres que aparezcan en ambas secciones, comenta estas líneas
    filtered = filtered.filter((champion) => !idsFavoritos.has(champion.id))

    // Ordenar alfabéticamente
    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [champions, searchTerm, selectedRole, idsFavoritos])

  const roles = ['All', 'Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support']

  const roleTranslations = {
    All: 'Todos',
    Fighter: 'Luchador',
    Tank: 'Tanque',
    Mage: 'Mago',
    Assassin: 'Asesino',
    Marksman: 'Tirador',
    Support: 'Apoyo',
  }

  if (loading) {
    return <Loading message="Cargando campeones..." />
  }

  return (
    <Container maxW="1400px">
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading 
            size={{ base: '3xl', md: '4xl' }}
            mb={2}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="tight"
            color="foreground.primary"
          >
            <Box as="span" color="foreground.primary">
              Explora los{' '}
            </Box>
            <Box as="span" color="gold.200">
              Campeones
            </Box>
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="foreground.muted" lineHeight="relaxed">
            Más de 160 campeones únicos esperan. Encuentra tu estilo de juego perfecto.
          </Text>
        </Box>

        {/* Sección de Campeones Favoritos */}
        {estaAutenticado && (
          <Box 
            mb={8} 
            p={6} 
            bg="background.card" 
            borderRadius="xl" 
            boxShadow="lg" 
            border="2px" 
            borderColor={campeonesFavoritos.length > 0 ? "gold.200" : "background.muted"}
            transition="all 0.3s"
          >
            <HStack spacing={3} mb={4} align="center">
              <Icon as={Star} color="gold.200" boxSize={6} fill="gold.200" />
              <Heading size="lg" fontWeight="bold" color="foreground.primary">
                Campeones Favoritos
              </Heading>
              {campeonesFavoritos.length > 0 && (
                <Text fontSize="sm" color="foreground.muted" fontWeight="medium">
                  ({campeonesFavoritos.length})
                </Text>
              )}
            </HStack>
            
            {!favoritosInicializados && cargandoFavoritos ? (
              <Box textAlign="center" py={8}>
                <Text color="foreground.muted">Cargando favoritos...</Text>
              </Box>
            ) : campeonesFavoritos.length > 0 ? (
              <>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={4}>
                  {campeonesFavoritos.map((champion) => (
                    <ChampionCard
                      key={champion.id}
                      id={champion.id}
                      name={champion.name}
                      title={champion.title}
                      image={champion.image}
                      tags={champion.tags}
                      esFavoritoInicial
                      onFavoriteChange={manejarCambioFavorito}
                    />
                  ))}
                </SimpleGrid>
              </>
            ) : (
              <Box textAlign="center" py={8} bg="background.secondary" borderRadius="md" border="1px dashed" borderColor="background.muted">
                <Icon as={Star} boxSize={8} color="foreground.muted" mb={3} />
                <Text color="foreground.muted" fontSize="md" fontWeight="medium">
                  Aún no tienes campeones favoritos
                </Text>
                <Text color="foreground.muted" fontSize="sm" mt={2}>
                  Haz clic en la estrella de cualquier campeón para agregarlo a favoritos
                </Text>
              </Box>
            )}
          </Box>
        )}

        {/* Separador visual */}
        {estaAutenticado && campeonesFavoritos.length > 0 && (
          <Divider borderColor="background.muted" borderWidth="2px" my={4} />
        )}

        {/* Search and Filters */}
        <VStack spacing={4} align="stretch">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={Search} color="foreground.muted" />
            </InputLeftElement>
            <Input
              placeholder="Buscar campeones por nombre o título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outline"
              bg="background.card"
              borderColor="background.muted"
              _focus={{
                borderColor: 'gold.200',
                boxShadow: '0 0 0 1px var(--chakra-colors-gold-200)',
              }}
            />
          </InputGroup>

          <Box>
            <Text fontWeight="bold" mb={3} fontSize="sm" color="foreground.primary" textTransform="uppercase" letterSpacing="wide">
              Filtrar por Rol
            </Text>
            <Wrap spacing={2}>
              {roles.map((role) => (
                <WrapItem key={role}>
                  <Button
                    size="sm"
                    variant={selectedRole === role ? 'default' : 'outline'}
                    colorScheme="gold"
                    onClick={() => {
                      setSelectedRole(role)
                      if (role === 'All') {
                        searchParams.delete('role')
                      } else {
                        searchParams.set('role', role)
                      }
                      setSearchParams(searchParams)
                    }}
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: 'xl',
                    }}
                    transition="all 0.2s"
                  >
                    {roleTranslations[role]}
                  </Button>
                </WrapItem>
              ))}
            </Wrap>
          </Box>

          <Text fontSize="sm" color="foreground.muted">
            Mostrando {filteredChampions.length} de {champions.length} campeones
          </Text>
        </VStack>

        {/* Champions Grid */}
        {filteredChampions.length > 0 ? (
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={4}>
            {filteredChampions.map((champion) => (
              <ChampionCard
                key={champion.id}
                id={champion.id}
                name={champion.name}
                title={champion.title}
                image={champion.image}
                tags={champion.tags}
                esFavoritoInicial={idsFavoritos.has(champion.id)}
                  onFavoriteChange={manejarCambioFavorito}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={12} bg="background.card" borderRadius="lg" boxShadow="md" border="1px" borderColor="background.muted">
            <Text fontSize="lg" color="foreground.muted">
              No se encontraron campeones con los filtros seleccionados
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  )
}

export default ChampionList

