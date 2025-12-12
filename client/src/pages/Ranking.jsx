'use strict';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Tag,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Crown, Sparkles, Shield, ImageIcon, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { missionsService } from '../services/missionsService';

const hexToRgba = (hex, alpha = 1) => {
  const sanitized = hex.replace('#', '');
  if (sanitized.length !== 6) {
    return `rgba(250, 204, 21, ${alpha})`;
  }
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const buildDecorationGlow = (color) => ({
  backgroundImage: `linear-gradient(135deg, ${color}, ${hexToRgba(color, 0.15)})`,
  boxShadow: `0 12px 30px ${hexToRgba(color, 0.45)}`,
});

const Ranking = () => {
  const { estaAutenticado, cargando } = useAuth();
  const navegar = useNavigate();
  const toast = useToast();

  const [entradas, setEntradas] = useState([]);
  const [resumenUsuario, setResumenUsuario] = useState(null);
  const [totalMisiones, setTotalMisiones] = useState(0);
  const [loading, setLoading] = useState(true);

  const iconMap = useMemo(
    () => ({
      crown: Crown,
      sparkles: Sparkles,
      shield: Shield,
      image: ImageIcon,
    }),
    []
  );

  const obtenerDecoracion = (decoracion) => {
    const IconComponent = iconMap[decoracion.icon] ?? Sparkles;
    return (
      <Tag
        key={decoracion.key}
        borderRadius="full"
        px={3}
        py={1}
        bg="transparent"
        borderColor={decoracion.color}
        borderWidth="1px"
        color={decoracion.color}
        fontSize="xs"
      >
        <Flex align="center" gap={1}>
          <Icon as={IconComponent} size={14} />
          <Text fontWeight="semibold">{decoracion.title}</Text>
        </Flex>
      </Tag>
    );
  };

  useEffect(() => {
    if (cargando) {
      return;
    }

    if (!estaAutenticado) {
      navegar('/login');
      return;
    }

    const cargarRanking = async () => {
      try {
        const respuesta = await missionsService.obtenerRanking();
        setEntradas(respuesta.ranking);
        setTotalMisiones(respuesta.total_missions);
        setResumenUsuario(respuesta.you);
      } catch (error) {
        toast({
          title: 'No se pudo cargar el ranking',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    cargarRanking();
  }, [cargando, estaAutenticado, navegar, toast]);

  const renderAvatarDecorado = (user) => {
    const decoracion = user.selected_decoration;
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Box
          borderRadius="full"
          p={decoracion ? 2 : 0}
          bg={decoracion ? 'transparent' : 'background.card'}
          border={decoracion ? '2px solid transparent' : '4px solid background.card'}
          sx={decoracion ? buildDecorationGlow(decoracion.color) : undefined}
        >
          <Avatar size="lg" name={user.name} src={user.avatar_url ?? undefined} />
        </Box>
        {decoracion && (
          <Tag size="sm" variant="subtle" colorScheme="yellow">
            {decoracion.title}
          </Tag>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxW="1200px" py={10}>
        <Stack spacing={6}>
          <Skeleton height="160px" borderRadius="2xl" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} height="120px" borderRadius="xl" />
          ))}
        </Stack>
      </Container>
    );
  }

  if (!estaAutenticado) {
    return null;
  }

  const renderEntrada = (entrada) => {
    const porcentaje = totalMisiones ? Math.round((entrada.completed / totalMisiones) * 100) : 0;
    const IconComponent = entrada.position === 1 ? Crown : Trophy;
    const borderColor =
      entrada.position === 1 ? 'yellow.400' : entrada.position === 2 ? 'gray.400' : entrada.position === 3 ? 'orange.400' : 'background.muted';

    return (
      <Box
        key={entrada.user.id}
        borderWidth="1px"
        borderRadius="xl"
        p={5}
        borderColor={borderColor}
        bg="background.card"
        boxShadow={entrada.position <= 3 ? 'xl' : 'lg'}
      >
        <Flex align={{ base: 'flex-start', md: 'center' }} justify="space-between" gap={4} direction={{ base: 'column', md: 'row' }}>
          <Flex align="center" gap={4}>
            <Tag colorScheme="yellow" borderRadius="full" px={3} py={1} fontWeight="bold">
              #{entrada.position}
            </Tag>
            {renderAvatarDecorado(entrada.user)}
            <Box>
              <Flex align="center" gap={2}>
                <Heading size="md">{entrada.user.name}</Heading>
                {entrada.position <= 3 && <Icon as={IconComponent} color="gold.300" />}
              </Flex>
              <Text color="foreground.muted" fontSize="sm">
                {entrada.user.email}
              </Text>
            </Box>
          </Flex>
          <Tag variant="subtle" colorScheme="yellow" borderRadius="full">
            {entrada.completed}/{totalMisiones} misiones
          </Tag>
        </Flex>
        <Progress mt={4} value={porcentaje} colorScheme="yellow" borderRadius="full" />
        <HStack spacing={2} mt={3} flexWrap="wrap">
          {entrada.decorations.length ? (
            entrada.decorations.map((decoracion) => obtenerDecoracion(decoracion))
          ) : (
            <Text color="foreground.muted" fontSize="sm">
              Sin decoraciones desbloqueadas aún.
            </Text>
          )}
        </HStack>
      </Box>
    );
  };

  return (
    <Container maxW="1200px" py={10}>
      <Stack spacing={8}>
        <Box borderWidth="1px" borderRadius="2xl" p={6} borderColor="background.muted" bg="background.card" boxShadow="2xl">
          <Flex align={{ base: 'flex-start', md: 'center' }} justify="space-between" gap={4} direction={{ base: 'column', md: 'row' }}>
            <Box>
              <Heading size="2xl" mb={1}>
                Ranking de Misiones
              </Heading>
              <Text color="foreground.muted">Compite con la comunidad completando misiones del perfil.</Text>
            </Box>
            <Button colorScheme="yellow" variant="solid" onClick={() => navegar('/perfil')} leftIcon={<Icon as={Sparkles} />}>
              Ir a mi perfil
            </Button>
          </Flex>
          {resumenUsuario && (
            <Box mt={6} borderWidth="1px" borderRadius="xl" p={4} borderColor="yellow.500" bg="yellow.900">
              <Flex align={{ base: 'flex-start', md: 'center' }} justify="space-between" direction={{ base: 'column', md: 'row' }} gap={3}>
                <Flex align="center" gap={3}>
                  <Icon as={Trophy} color="gold.200" />
                  <Box>
                    <Text fontWeight="bold">Tu posición actual</Text>
                    <Text color="foreground.muted">#{resumenUsuario.position} en el tablero</Text>
                  </Box>
                </Flex>
                <Tag colorScheme="blackAlpha" borderRadius="full">
                  {resumenUsuario.completed}/{totalMisiones} misiones completadas
                </Tag>
              </Flex>
              {resumenUsuario.decorations.length > 0 && (
                <HStack spacing={2} mt={3} flexWrap="wrap">
                  {resumenUsuario.decorations.map((decoracion) => obtenerDecoracion(decoracion))}
                </HStack>
              )}
            </Box>
          )}
        </Box>

        {entradas.length ? (
          <>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {entradas.slice(0, 2).map((entrada) => renderEntrada(entrada))}
            </SimpleGrid>
            <Stack spacing={4}>
              {entradas.slice(2).map((entrada) => renderEntrada(entrada))}
            </Stack>
          </>
        ) : (
          <Box borderWidth="1px" borderRadius="xl" p={6} borderColor="background.muted" textAlign="center">
            <Text color="foreground.muted">Todavía no hay jugadores en el ranking. ¡Sé el primero en completar misiones!</Text>
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default Ranking;


