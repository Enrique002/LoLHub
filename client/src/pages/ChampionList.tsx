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

interface Champion {
  id: string
  name: string
  title: string
  image: {
    full: string
  }
  tags?: string[]
}

type RoleFilter = 'Fighter' | 'Tank' | 'Mage' | 'Assassin' | 'Marksman' | 'Support' | 'All'

const ChampionList: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [champions, setChampions] = useState<Champion[]>([])
  const [favoriteChampions, setFavoriteChampions] = useState<Champion[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const roleFromUrl = searchParams.get('role') as RoleFilter | null
  const [selectedRole, setSelectedRole] = useState<RoleFilter>(roleFromUrl && ['Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'].includes(roleFromUrl) ? roleFromUrl : 'All')
  const [loading, setLoading] = useState(true)
  const [loadingFavorites, setLoadingFavorites] = useState(false)

  // Sincronizar el rol de la URL con el estado
  useEffect(() => {
    const roleFromUrl = searchParams.get('role') as RoleFilter | null
    if (roleFromUrl && ['Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'].includes(roleFromUrl)) {
      setSelectedRole(roleFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const response = await axios.get(`${DATA_DRAGON_BASE}/data/es_ES/champion.json`)
        const championsData = Object.values(response.data.data)
        setChampions(championsData as Champion[])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching champions:', error)
        setLoading(false)
      }
    }

    fetchChampions()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites()
    } else {
      setFavoriteChampions([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const fetchFavorites = async () => {
    setLoadingFavorites(true)
    try {
      const favorites = await favoriteService.getFavorites()
      setFavoriteChampions(favorites as Champion[])
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoadingFavorites(false)
    }
  }

  const handleFavoriteChange = () => {
    fetchFavorites()
  }

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

    // Ordenar alfabéticamente
    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [champions, searchTerm, selectedRole])

  const roles: RoleFilter[] = ['All', 'Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support']

  const roleTranslations: Record<RoleFilter, string> = {
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

        {/* Favorites Section */}
        {isAuthenticated && favoriteChampions.length > 0 && (
          <Box mb={8}>
            <HStack spacing={2} mb={4}>
              <Icon as={Star} color="gold.200" boxSize={5} fill="gold.200" />
              <Heading size="lg" fontWeight="bold" color="foreground.primary">
                Mis Favoritos
              </Heading>
            </HStack>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={4} mb={6}>
              {favoriteChampions.map((champion) => (
                <ChampionCard
                  key={champion.id}
                  id={champion.id}
                  name={champion.name}
                  title={champion.title}
                  image={champion.image}
                  tags={champion.tags}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </SimpleGrid>
            <Divider borderColor="background.muted" />
          </Box>
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
                onFavoriteChange={handleFavoriteChange}
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

