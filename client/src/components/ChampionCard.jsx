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

const ChampionCard = ({ 
  id, 
  name, 
  title, 
  image, 
  tags = [], 
  esFavoritoInicial = false, 
  onFavoriteChange,
  variant = 'default',
}) => {
  const { estaAutenticado } = useAuth()
  const [esFavorito, setEsFavorito] = useState(esFavoritoInicial)
  const [estaCargando, setEstaCargando] = useState(false)
  const toast = useToast()
  const esCompacto = variant === 'compact'
  const fondoCard = useColorModeValue('white', 'background.card')
  const fondoHover = useColorModeValue('gray.50', 'background.secondary')
  const colorBorde = useColorModeValue('gray.200', 'background.muted')

  useEffect(() => {
    setEsFavorito(esFavoritoInicial)
  }, [esFavoritoInicial])

  const manejarClickFavorito = async (e) => {
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

    setEstaCargando(true)
    try {
      if (esFavorito) {
        await favoriteService.eliminarFavorito(id)
        setEsFavorito(false)
        toast({
          title: 'Eliminado de favoritos',
          status: 'info',
          duration: 2000,
          isClosable: true,
        })
        onFavoriteChange?.({ id, name, title, image, tags }, false)
      } else {
        await favoriteService.agregarFavorito(id)
        setEsFavorito(true)
        toast({
          title: 'Agregado a favoritos',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        onFavoriteChange?.({ id, name, title, image, tags }, true)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar el favorito',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setEstaCargando(false)
    }
  }

  return (
    <Box
      as={RouterLink}
      to={`/champions/${id}`}
      bg={fondoCard}
      borderRadius="lg"
      overflow="hidden"
      boxShadow={esCompacto ? 'sm' : 'md'}
      border="1px"
      borderColor={colorBorde}
      transition="all 0.3s"
      _hover={{
        transform: esCompacto ? 'translateY(-4px) scale(1.01)' : 'translateY(-8px) scale(1.02)',
        boxShadow: esCompacto ? 'xl' : '2xl',
        borderColor: 'gold.200',
        bg: fondoHover,
      }}
      position="relative"
      height="100%"
    >
      <Box position="relative" overflow="hidden">
        <Image
          src={`${DATA_DRAGON_BASE}/img/champion/${image?.full || 'default.png'}`}
          alt={name}
          width="100%"
          height={esCompacto ? '200px' : undefined}
          objectFit="cover"
          transition="transform 0.3s"
          _hover={{
            transform: 'scale(1.1)',
          }}
        />
        {estaAutenticado && (
          <IconButton
            aria-label={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            icon={<Icon as={Star} fill={esFavorito ? 'currentColor' : 'none'} />}
            position="absolute"
            top={2}
            left={2}
            size="sm"
            colorScheme={esFavorito ? 'gold' : 'gray'}
            bg={esFavorito ? 'gold.200' : 'blackAlpha.600'}
            color={esFavorito ? 'background.primary' : 'gray.300'}
            _hover={{
              bg: esFavorito ? 'gold.100' : 'blackAlpha.800',
              transform: 'scale(1.1)',
            }}
            onClick={manejarClickFavorito}
            isLoading={estaCargando}
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
          p={esCompacto ? 2 : 3}
        >
          <Text fontSize="lg" fontWeight="bold" color="white">
            {name}
          </Text>
        </Box>
      </Box>
      <VStack spacing={2} p={esCompacto ? 3 : 4} align="start">
        <Text fontSize={esCompacto ? 'xs' : 'sm'} color={useColorModeValue('gray.600', 'foreground.muted')} noOfLines={1}>
          {title}
        </Text>
        {tags.length > 0 && (
          <HStack spacing={1} flexWrap="wrap">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="gold" fontSize={esCompacto ? '2xs' : 'xs'}>
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
