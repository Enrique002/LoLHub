import React, { useState, useEffect } from 'react'
import {
  Box,
  Image,
  Text,
  VStack,
  Badge,
  HStack,
  useColorModeValue,
  IconButton,
  useToast,
  Icon,
} from '@chakra-ui/react'
import { Star } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'
import { DATA_DRAGON_BASE } from '../config'
import { useAuth } from '../contexts/AuthContext'
import { favoriteService } from '../services/favoriteService'

export interface DatosCampeonFavorito {
  id: string
  name: string
  title: string
  image: {
    full: string
  }
  tags?: string[]
}

interface ChampionCardProps extends DatosCampeonFavorito {
  esFavoritoInicial?: boolean
  onFavoriteChange?: (campeon: DatosCampeonFavorito, esFavorito: boolean) => void
}

const ChampionCard: React.FC<ChampionCardProps> = ({ 
  id, 
  name, 
  title, 
  image, 
  tags = [], 
  esFavoritoInicial = false, 
  onFavoriteChange 
}) => {
  const { estaAutenticado } = useAuth()
  const [isFavorite, setIsFavorite] = useState(esFavoritoInicial)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const cardBg = useColorModeValue('white', 'background.card')
  const hoverBg = useColorModeValue('gray.50', 'background.secondary')
  const borderColor = useColorModeValue('gray.200', 'background.muted')

  useEffect(() => {
    setIsFavorite(esFavoritoInicial)
  }, [esFavoritoInicial])

  /**
   * Maneja el click en el botón de favoritos
   * @param {React.MouseEvent} e - Evento del click
   */
  const manejarClickFavorito = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!estaAutenticado) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para agregar favoritos',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      if (isFavorite) {
        await favoriteService.eliminarFavorito(id)
        setIsFavorite(false)
        toast({
          title: 'Eliminado de favoritos',
          status: 'info',
          duration: 2000,
          isClosable: true,
        })
        onFavoriteChange?.({ id, name, title, image, tags }, false)
      } else {
        await favoriteService.agregarFavorito(id)
        setIsFavorite(true)
        toast({
          title: 'Agregado a favoritos',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        onFavoriteChange?.({ id, name, title, image, tags }, true)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar el favorito',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      as={RouterLink}
      to={`/champions/${id}`}
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      border="1px"
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '2xl',
        borderColor: 'gold.200',
        bg: hoverBg,
      }}
      position="relative"
    >
      <Box position="relative" overflow="hidden">
        <Image
          src={`${DATA_DRAGON_BASE}/img/champion/${image.full}`}
          alt={name}
          width="100%"
          objectFit="cover"
          transition="transform 0.3s"
          _hover={{
            transform: 'scale(1.1)',
          }}
        />
        {estaAutenticado && (
          <IconButton
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            icon={<Icon as={Star} fill={isFavorite ? 'currentColor' : 'none'} />}
            position="absolute"
            top={2}
            left={2}
            size="sm"
            colorScheme={isFavorite ? 'gold' : 'gray'}
            bg={isFavorite ? 'gold.200' : 'blackAlpha.600'}
            color={isFavorite ? 'background.primary' : 'gray.300'}
            _hover={{
              bg: isFavorite ? 'gold.100' : 'blackAlpha.800',
              transform: 'scale(1.1)',
            }}
            onClick={manejarClickFavorito}
            isLoading={isLoading}
            zIndex={10}
            transition="all 0.2s"
          />
        )}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bgGradient="linear(to-t, blackAlpha.700, transparent)"
          p={3}
        >
          <Text fontSize="lg" fontWeight="bold" color="white">
            {name}
          </Text>
        </Box>
      </Box>
      <VStack spacing={2} p={4} align="start">
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'foreground.muted')} noOfLines={1}>
          {title}
        </Text>
        {tags.length > 0 && (
          <HStack spacing={1} flexWrap="wrap">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="gold" fontSize="xs">
                {tag}
              </Badge>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  )
}

export default ChampionCard

