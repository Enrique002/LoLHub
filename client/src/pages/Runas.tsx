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
  Divider,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
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
  const [runaSeleccionada, setRunaSeleccionada] = useState<Runa | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();


  /**
   * Carga las runas desde la API de Data Dragon
   */
  useEffect(() => {
    const cargarRunas = async () => {
      try {
        const url = `${DATA_DRAGON_BASE}/data/es_ES/runesReforged.json`;
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
          <Heading 
            size={{ base: '3xl', md: '4xl' }}
            mb={2}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="tight"
            color="foreground.primary"
          >
            <Box as="span" color="foreground.primary">
              Explora las{' '}
            </Box>
            <Box as="span" color="gold.200">
              Runas
            </Box>
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="foreground.muted" lineHeight="relaxed">
            Explora todas las runas de League of Legends organizadas por árboles
          </Text>
        </Box>

        {/* Búsqueda y Filtros */}
        <VStack spacing={4} align="stretch">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={Search} color="foreground.muted" />
            </InputLeftElement>
            <Input
              placeholder="Buscar runas por nombre o descripción..."
              value={terminoBusqueda}
              onChange={(evento) => setTerminoBusqueda(evento.target.value)}
              variant="outline"
              bg="background.card"
              borderColor="background.muted"
              _focus={{
                borderColor: 'gold.200',
                boxShadow: '0 0 0 1px var(--chakra-colors-gold-200)',
              }}
            />
          </InputGroup>

          {/* Filtros por árbol */}
          <Box>
            <Text fontWeight="bold" mb={3} fontSize="sm" color="foreground.primary" textTransform="uppercase" letterSpacing="wide">
              Filtrar por Árbol
            </Text>
            <Wrap spacing={2}>
              <WrapItem>
                <Button
                  size="sm"
                  variant={arbolSeleccionado === 'todos' ? 'default' : 'outline'}
                  colorScheme="gold"
                  onClick={() => setArbolSeleccionado('todos')}
                  _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.2s"
                >
                  Todos
                </Button>
              </WrapItem>
              {ordenArboles.map((claveArbol) => {
                const arbol = arbolesRunas.find((a) => a.key === claveArbol);
                if (!arbol) return null;
                
                return (
                  <WrapItem key={claveArbol}>
                    <Button
                      size="sm"
                      variant={arbolSeleccionado === claveArbol ? 'default' : 'outline'}
                      colorScheme="gold"
                      onClick={() => setArbolSeleccionado(claveArbol)}
                      _hover={{
                        transform: 'scale(1.05)',
                        boxShadow: 'xl',
                      }}
                      transition="all 0.2s"
                    >
                      {nombresArboles[claveArbol] || claveArbol}
                    </Button>
                  </WrapItem>
                );
              })}
            </Wrap>
          </Box>
        </VStack>

        {/* Árboles de Runas */}
        {arbolesFiltrados.length > 0 ? (
          <VStack spacing={8} align="stretch">
            {arbolesFiltrados.map((arbol) => (
              <Box
                key={arbol.id}
                bg="background.card"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                border="1px"
                borderColor="background.muted"
                transition="all 0.2s"
                _hover={{
                  borderColor: 'gold.200',
                  boxShadow: 'xl',
                }}
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
                    <Heading size="lg" fontWeight="bold" color="foreground.primary">
                      {nombresArboles[arbol.key] || arbol.name}
                    </Heading>
                    <Text fontSize="sm" color="foreground.muted">
                      {arbol.name}
                    </Text>
                  </VStack>
                </HStack>

                <Divider mb={6} borderColor="background.muted" />

                {/* Slots de Runas */}
                <VStack spacing={6} align="stretch">
                  {arbol.slots.map((slot, indiceSlot) => (
                    <Box key={indiceSlot}>
                      <Text
                        fontWeight="bold"
                        mb={3}
                        fontSize="sm"
                        color="foreground.muted"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        {indiceSlot === 0 ? 'Runa Keystone' : `Slot ${indiceSlot}`}
                      </Text>
                      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
                        {slot.runes.map((runa) => (
                          <Card
                            key={runa.id}
                            bg="background.card"
                            border="1px"
                            borderColor="background.muted"
                            cursor="pointer"
                            transition="all 0.2s"
                            onClick={() => {
                              setRunaSeleccionada(runa);
                              onOpen();
                            }}
                            _hover={{
                              transform: 'scale(1.05)',
                              boxShadow: '2xl',
                              borderColor: 'gold.200',
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
                                    color="foreground.primary"
                                    noOfLines={2}
                                  >
                                    {runa.name}
                                  </Text>
                                  <Text
                                    fontSize="xs"
                                    color="foreground.muted"
                                    textAlign="center"
                                    noOfLines={2}
                                  >
                                    {limpiarHTML(runa.shortDesc)}
                                  </Text>
                                </VStack>
                              </CardBody>
                            </Card>
                        ))}
                      </SimpleGrid>
                    </Box>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        ) : (
          <Box textAlign="center" py={12} bg="background.card" borderRadius="lg" boxShadow="md" border="1px" borderColor="background.muted">
            <Text fontSize="lg" color="foreground.muted">
              No se encontraron runas con los filtros seleccionados
            </Text>
          </Box>
        )}
      </VStack>

      {/* Modal de Detalles de Runa */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent
          bg={useColorModeValue('white', 'background.card')}
          borderRadius="lg"
          maxW="600px"
        >
          <ModalHeader
            fontSize="2xl"
            fontWeight="extrabold"
            letterSpacing="tight"
            color="foreground.primary"
          >
            {runaSeleccionada?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {runaSeleccionada && (
              <VStack spacing={6} align="stretch">
                <HStack spacing={4} align="center">
                  <Image
                    src={runaSeleccionada.icon.startsWith('http') ? runaSeleccionada.icon : `https://ddragon.leagueoflegends.com/cdn/img/${runaSeleccionada.icon}`}
                    alt={runaSeleccionada.name}
                    boxSize="80px"
                    borderRadius="md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('ddragon.leagueoflegends.com/cdn/img/')) {
                        target.src = `https://ddragon.leagueoflegends.com/cdn/img/${runaSeleccionada.icon}`;
                      }
                    }}
                  />
                  <VStack align="start" spacing={2} flex={1}>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="foreground.primary"
                    >
                      {runaSeleccionada.name}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="foreground.muted"
                      lineHeight="relaxed"
                    >
                      {limpiarHTML(runaSeleccionada.shortDesc)}
                    </Text>
                  </VStack>
                </HStack>

                <Divider borderColor="background.muted" />

                <Box>
                  <Heading size="sm" mb={3} fontWeight="bold" color="foreground.primary">
                    Descripción Completa
                  </Heading>
                  <Text
                    fontSize="sm"
                    color="foreground.primary"
                    lineHeight="relaxed"
                    whiteSpace="pre-wrap"
                  >
                    {limpiarHTML(runaSeleccionada.longDesc)}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Runas;

