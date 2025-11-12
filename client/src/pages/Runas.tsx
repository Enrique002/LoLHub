'use strict';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Container,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Card,
  CardBody,
  Tooltip,
  Divider,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { DATA_DRAGON_BASE } from '../config';
import Loading from '../components/Loading';

/**
 * Tipos para las runas
 */
interface Runa {
  id: number;
  key: string;
  icon: string;
  name: string;
  shortDesc: string;
  longDesc: string;
}

interface SlotRuna {
  runes: Runa[];
}

interface ArbolRuna {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: SlotRuna[];
}

interface RespuestaRunas {
  [key: string]: ArbolRuna;
}

/**
 * Mapeo de claves de árboles a nombres en español
 */
const nombresArboles: Record<string, string> = {
  Domination: 'Dominación',
  Precision: 'Precisión',
  Sorcery: 'Brujería',
  Resolve: 'Valor',
  Inspiration: 'Inspiración',
};

/**
 * Orden de los árboles de runas
 */
const ordenArboles = ['Domination', 'Precision', 'Sorcery', 'Resolve', 'Inspiration'];

/**
 * Limpia las etiquetas HTML y entidades HTML de un texto
 */
const limpiarHTML = (texto: string): string => {
  return texto
    .replace(/<[^>]*>/g, '') // Elimina etiquetas HTML
    .replace(/&nbsp;/g, ' ') // Reemplaza &nbsp; con espacio
    .replace(/&lt;/g, '<') // Reemplaza &lt; con <
    .replace(/&gt;/g, '>') // Reemplaza &gt; con >
    .replace(/&amp;/g, '&') // Reemplaza &amp; con &
    .replace(/&quot;/g, '"') // Reemplaza &quot; con "
    .replace(/&#39;/g, "'") // Reemplaza &#39; con '
    .trim();
};

/**
 * Componente de página de Runas
 * Muestra todas las runas organizadas por árboles
 */
const Runas: React.FC = () => {
  const [arbolesRunas, setArbolesRunas] = useState<ArbolRuna[]>([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [arbolSeleccionado, setArbolSeleccionado] = useState<string>('todos');

  const fondoCard = useColorModeValue('white', 'gray.800');
  const fondoHover = useColorModeValue('gray.50', 'gray.700');
  const colorBorde = useColorModeValue('gray.200', 'gray.700');

  /**
   * Carga las runas desde la API de Data Dragon
   */
  useEffect(() => {
    const cargarRunas = async () => {
      try {
        const url = `${DATA_DRAGON_BASE}/data/en_US/runesReforged.json`;
        const respuesta = await axios.get<ArbolRuna[]>(url);
        
        // Ordenar los árboles según el orden especificado
        const arbolesOrdenados = respuesta.data.sort((a, b) => {
          const indiceA = ordenArboles.indexOf(a.key);
          const indiceB = ordenArboles.indexOf(b.key);
          if (indiceA === -1) return 1;
          if (indiceB === -1) return -1;
          return indiceA - indiceB;
        });
        
        setArbolesRunas(arbolesOrdenados);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar runas:', error);
        setCargando(false);
      }
    };

    cargarRunas();
  }, []);

  /**
   * Filtra las runas según el término de búsqueda y el árbol seleccionado
   */
  const arbolesFiltrados = useMemo(() => {
    let arboles = arbolesRunas;

    // Filtrar por árbol seleccionado
    if (arbolSeleccionado !== 'todos') {
      arboles = arboles.filter((arbol) => arbol.key === arbolSeleccionado);
    }

    // Filtrar por término de búsqueda
    if (terminoBusqueda.trim()) {
      const busqueda = terminoBusqueda.toLowerCase();
      arboles = arboles.map((arbol) => {
        const slotsFiltrados = arbol.slots.map((slot) => ({
          ...slot,
          runes: slot.runes.filter(
            (runa) =>
              runa.name.toLowerCase().includes(busqueda) ||
              runa.shortDesc.toLowerCase().includes(busqueda) ||
              runa.longDesc.toLowerCase().includes(busqueda)
          ),
        })).filter((slot) => slot.runes.length > 0);

        return {
          ...arbol,
          slots: slotsFiltrados,
        };
      }).filter((arbol) => arbol.slots.length > 0);
    }

    return arboles;
  }, [arbolesRunas, terminoBusqueda, arbolSeleccionado]);

  if (cargando) {
    return <Loading message="Cargando runas..." />;
  }

  return (
    <Container maxW="1400px">
      <VStack spacing={8} align="stretch">
        {/* Encabezado */}
        <Box>
          <Heading size="xl" mb={2} color={useColorModeValue('gray.800', 'white')}>
            Runas
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="lg">
            Explora todas las runas de League of Legends organizadas por árboles
          </Text>
        </Box>

        {/* Búsqueda y Filtros */}
        <VStack spacing={4} align="stretch">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar runas por nombre o descripción..."
              value={terminoBusqueda}
              onChange={(evento) => setTerminoBusqueda(evento.target.value)}
              bg={useColorModeValue('white', 'gray.800')}
              border="2px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
            />
          </InputGroup>

          {/* Filtros por árbol */}
          <HStack spacing={2} flexWrap="wrap">
            <Badge
              px={3}
              py={1}
              borderRadius="full"
              cursor="pointer"
              colorScheme={arbolSeleccionado === 'todos' ? 'blue' : 'gray'}
              onClick={() => setArbolSeleccionado('todos')}
              _hover={{ transform: 'scale(1.05)' }}
              transition="all 0.2s"
            >
              Todos
            </Badge>
            {ordenArboles.map((claveArbol) => {
              const arbol = arbolesRunas.find((a) => a.key === claveArbol);
              if (!arbol) return null;
              
              return (
                <Badge
                  key={claveArbol}
                  px={3}
                  py={1}
                  borderRadius="full"
                  cursor="pointer"
                  colorScheme={arbolSeleccionado === claveArbol ? 'blue' : 'gray'}
                  onClick={() => setArbolSeleccionado(claveArbol)}
                  _hover={{ transform: 'scale(1.05)' }}
                  transition="all 0.2s"
                >
                  {nombresArboles[claveArbol] || claveArbol}
                </Badge>
              );
            })}
          </HStack>
        </VStack>

        {/* Árboles de Runas */}
        {arbolesFiltrados.length > 0 ? (
          <VStack spacing={8} align="stretch">
            {arbolesFiltrados.map((arbol) => (
              <Box
                key={arbol.id}
                bg={fondoCard}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                border="1px"
                borderColor={colorBorde}
              >
                {/* Encabezado del Árbol */}
                <HStack spacing={4} mb={6} align="center">
                  <Image
                    src={arbol.icon.startsWith('http') ? arbol.icon : `https://ddragon.leagueoflegends.com/cdn/img/${arbol.icon}`}
                    alt={arbol.name}
                    boxSize="48px"
                    borderRadius="md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('ddragon.leagueoflegends.com/cdn/img/')) {
                        target.src = `https://ddragon.leagueoflegends.com/cdn/img/${arbol.icon}`;
                      }
                    }}
                  />
                  <VStack align="start" spacing={0}>
                    <Heading size="lg" color={useColorModeValue('gray.800', 'white')}>
                      {nombresArboles[arbol.key] || arbol.name}
                    </Heading>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                      {arbol.name}
                    </Text>
                  </VStack>
                </HStack>

                <Divider mb={6} borderColor={colorBorde} />

                {/* Slots de Runas */}
                <VStack spacing={6} align="stretch">
                  {arbol.slots.map((slot, indiceSlot) => (
                    <Box key={indiceSlot}>
                      <Text
                        fontWeight="bold"
                        mb={3}
                        fontSize="sm"
                        color={useColorModeValue('gray.600', 'gray.400')}
                        textTransform="uppercase"
                      >
                        {indiceSlot === 0 ? 'Runa Keystone' : `Slot ${indiceSlot}`}
                      </Text>
                      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
                        {slot.runes.map((runa) => (
                          <Tooltip
                            key={runa.id}
                            label={
                              <VStack align="start" spacing={1} maxW="300px">
                                <Text fontWeight="bold">{runa.name}</Text>
                                <Text fontSize="xs" whiteSpace="pre-wrap">
                                  {limpiarHTML(runa.longDesc)}
                                </Text>
                              </VStack>
                            }
                            placement="top"
                            hasArrow
                            bg={useColorModeValue('gray.800', 'gray.200')}
                            color={useColorModeValue('white', 'gray.800')}
                          >
                            <Card
                              bg={fondoCard}
                              border="2px"
                              borderColor={colorBorde}
                              cursor="pointer"
                              transition="all 0.2s"
                              _hover={{
                                transform: 'translateY(-4px)',
                                boxShadow: 'xl',
                                borderColor: 'blue.400',
                                bg: fondoHover,
                              }}
                            >
                              <CardBody p={4}>
                                <VStack spacing={2} align="center">
                                  <Image
                                    src={runa.icon.startsWith('http') ? runa.icon : `https://ddragon.leagueoflegends.com/cdn/img/${runa.icon}`}
                                    alt={runa.name}
                                    boxSize="48px"
                                    borderRadius="md"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      if (!target.src.includes('ddragon.leagueoflegends.com/cdn/img/')) {
                                        target.src = `https://ddragon.leagueoflegends.com/cdn/img/${runa.icon}`;
                                      }
                                    }}
                                  />
                                  <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    textAlign="center"
                                    color={useColorModeValue('gray.800', 'white')}
                                    noOfLines={2}
                                  >
                                    {runa.name}
                                  </Text>
                                  <Text
                                    fontSize="xs"
                                    color={useColorModeValue('gray.600', 'gray.400')}
                                    textAlign="center"
                                    noOfLines={2}
                                  >
                                    {limpiarHTML(runa.shortDesc)}
                                  </Text>
                                </VStack>
                              </CardBody>
                            </Card>
                          </Tooltip>
                        ))}
                      </SimpleGrid>
                    </Box>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        ) : (
          <Box textAlign="center" py={12} bg={fondoCard} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')}>
              No se encontraron runas con los filtros seleccionados
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Runas;

