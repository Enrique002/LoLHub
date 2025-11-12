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
} from '@chakra-ui/react'
import { SearchIcon, StarIcon } from '@chakra-ui/icons'
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
  const [champions, setChampions] = useState<Champion[]>([])
  const [favoriteChampions, setFavoriteChampions] = useState<Champion[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<RoleFilter>('All')
  const [loading, setLoading] = useState(true)
  const [loadingFavorites, setLoadingFavorites] = useState(false)

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const response = await axios.get(`${DATA_DRAGON_BASE}/data/en_US/champion.json`)
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
          <Heading size="xl" mb={2} color={useColorModeValue('gray.800', 'white')}>
            Campeones
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="lg">
            Explora todos los campeones de League of Legends
          </Text>
        </Box>

        {/* Favorites Section */}
        {isAuthenticated && favoriteChampions.length > 0 && (
          <Box mb={8}>
            <HStack spacing={2} mb={4}>
              <StarIcon color="yellow.400" boxSize={5} />
              <Heading size="lg" color={useColorModeValue('gray.800', 'white')}>
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
            <Divider borderColor={useColorModeValue('gray.300', 'gray.700')} />
          </Box>
        )}

        {/* Search and Filters */}
        <VStack spacing={4} align="stretch">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar campeones por nombre o título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={useColorModeValue('white', 'gray.800')}
              border="2px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
            />
          </InputGroup>

          <Box>
            <Text fontWeight="semibold" mb={3} fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')}>
              Filtrar por Rol:
            </Text>
            <Wrap spacing={2}>
              {roles.map((role) => (
                <WrapItem key={role}>
                  <Button
                    size="sm"
                    variant={selectedRole === role ? 'solid' : 'outline'}
                    colorScheme={selectedRole === role ? 'blue' : 'gray'}
                    onClick={() => setSelectedRole(role)}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.2s"
                  >
                    {roleTranslations[role]}
                  </Button>
                </WrapItem>
              ))}
            </Wrap>
          </Box>

          <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
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
          <Box textAlign="center" py={12}>
            <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')}>
              No se encontraron campeones con los filtros seleccionados
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  )
}

export default ChampionList

