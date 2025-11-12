'use strict';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Image,
  Text,
  Heading,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  useColorModeValue,
  Container,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Grid,
} from '@chakra-ui/react';
import axios from 'axios';
import { DATA_DRAGON_BASE } from '../config';
import Loading from '../components/Loading';
import ModalVideoHabilidad from '../components/ModalVideoHabilidad';
import { construirUrlVideoHabilidad } from '../utilidades/videosHabilidades';

interface ChampionDetail {
  id: string
  name: string
  title: string
  image: {
    full: string
  }
  lore: string
  spells: Array<{
    id: string
    name: string
    description: string
    image: {
      full: string
    }
    cooldown?: number[]
    cost?: number[]
  }>
  tags: string[]
  stats: {
    hp: number
    hpperlevel: number
    mp: number
    mpperlevel: number
    movespeed: number
    armor: number
    armorperlevel: number
    spellblock: number
    spellblockperlevel: number
    attackrange: number
    hpregen: number
    hpregenperlevel: number
    mpregen: number
    mpregenperlevel: number
    crit: number
    critperlevel: number
    attackdamage: number
    attackdamageperlevel: number
    attackspeedperlevel: number
    attackspeed: number
  }
  recommended: Array<{
    type: string
    blocks: Array<{
      type: string
      items: Array<{
        id: string
        count: number
      }>
    }>
  }>
}

interface ChampionResponse {
  data: {
    [key: string]: ChampionDetail
  }
}

/**
 * Componente de detalle del campeón
 * Muestra información completa del campeón incluyendo habilidades, estadísticas y objetos recomendados
 */
const ChampionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campeon, setCampeon] = useState<ChampionDetail | null>(null);
  const [cargando, setCargando] = useState(true);
  const [habilidadSeleccionada, setHabilidadSeleccionada] = useState<{
    urlVideo: string;
    nombre: string;
  } | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  /**
   * Carga los detalles del campeón desde la API
   */
  useEffect(() => {
    const cargarDetallesCampeon = async () => {
      try {
        const respuesta = await axios.get<ChampionResponse>(
          `${DATA_DRAGON_BASE}/data/en_US/champion/${id}.json`
        );
        if (id && respuesta.data.data[id]) {
          setCampeon(respuesta.data.data[id]);
        }
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar detalles del campeón:', error);
        setCargando(false);
      }
    };

    if (id) {
      cargarDetallesCampeon();
    }
  }, [id]);

  /**
   * Maneja el clic en una habilidad para mostrar su video
   * @param {number} indice - Índice de la habilidad
   * @param {string} nombreHabilidad - Nombre de la habilidad
   */
  const manejarClicHabilidad = (indice: number, nombreHabilidad: string) => {
    if (!id) return;
    
    const urlVideo = construirUrlVideoHabilidad(id, indice);
    
    if (urlVideo) {
      setHabilidadSeleccionada({
        urlVideo,
        nombre: nombreHabilidad,
      });
      setMostrarModal(true);
    }
  };

  /**
   * Cierra el modal de video
   */
  const cerrarModal = () => {
    setMostrarModal(false);
    setHabilidadSeleccionada(null);
  };

  const fondoCard = useColorModeValue('white', 'gray.800');
  const fondoStat = useColorModeValue('gray.50', 'gray.700');

  if (cargando) {
    return <Loading message="Cargando información del campeón..." />;
  }

  if (!campeon) {
    return (
      <Container maxW="1200px" py={8}>
        <Text fontSize="xl" color="red.500">
          No se pudo cargar la información del campeón
        </Text>
      </Container>
    );
  }

  const roleTranslations: Record<string, string> = {
    Fighter: 'Luchador',
    Tank: 'Tanque',
    Mage: 'Mago',
    Assassin: 'Asesino',
    Marksman: 'Tirador',
    Support: 'Apoyo',
  }


  return (
    <>
      <Container maxW="1400px">
        <VStack spacing={8} align="stretch">
          {/* Sección de Encabezado */}
          <Box
            bg={fondoCard}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            position="relative"
            overflow="hidden"
          >
            <HStack spacing={6} align="start" flexWrap="wrap">
              <Image
                src={`${DATA_DRAGON_BASE}/img/champion/${campeon.image.full}`}
                alt={campeon.name}
                borderRadius="lg"
                boxSize={{ base: '150px', md: '200px' }}
                objectFit="cover"
                border="4px"
                borderColor="blue.400"
              />
              <VStack align="start" spacing={3} flex={1}>
                <Heading size="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                  {campeon.name}
                </Heading>
                <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')} fontStyle="italic">
                  {campeon.title}
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  {campeon.tags.map((tag) => (
                    <Badge key={tag} colorScheme="blue" fontSize="md" px={3} py={1}>
                      {roleTranslations[tag] || tag}
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            </HStack>
          </Box>

          {/* Sección de Estadísticas */}
          <Box bg={fondoCard} p={6} borderRadius="lg" boxShadow="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
            <Heading size="lg" mb={6} color={useColorModeValue('gray.800', 'white')}>
              Estadísticas Base
            </Heading>
            <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4}>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Vida</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats.hp}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats.hpperlevel} por nivel</StatHelpText>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Daño de Ataque</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats.attackdamage.toFixed(1)}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats.attackdamageperlevel} por nivel</StatHelpText>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Armadura</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats.armor}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats.armorperlevel} por nivel</StatHelpText>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Resistencia Mágica</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats.spellblock}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats.spellblockperlevel} por nivel</StatHelpText>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Velocidad de Movimiento</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats.movespeed}</StatNumber>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Rango de Ataque</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats.attackrange}</StatNumber>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Velocidad de Ataque</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats.attackspeed.toFixed(2)}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats.attackspeedperlevel}% por nivel</StatHelpText>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Regeneración de Vida</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats.hpregen.toFixed(1)}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats.hpregenperlevel} por nivel</StatHelpText>
              </Stat>
            </Grid>
          </Box>

        <Tabs colorScheme="blue" variant="enclosed">
          <TabList>
            <Tab fontWeight="semibold">Habilidades</Tab>
            <Tab fontWeight="semibold">Historia</Tab>
            <Tab fontWeight="semibold">Objetos Recomendados</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                {campeon.spells.map((habilidad, indice) => {
                  const urlVideo = id ? construirUrlVideoHabilidad(id, indice) : null;
                  const tieneVideo = urlVideo !== null;
                  
                  return (
                    <Card 
                      key={habilidad.id} 
                      bg={fondoCard} 
                      boxShadow="md"
                      cursor={tieneVideo ? 'pointer' : 'default'}
                      transition="all 0.2s"
                      _hover={tieneVideo ? {
                        transform: 'translateY(-4px)',
                        boxShadow: 'xl',
                        borderColor: 'blue.400',
                      } : {}}
                      border={tieneVideo ? '2px' : '1px'}
                      borderColor={tieneVideo ? 'blue.300' : useColorModeValue('gray.200', 'gray.700')}
                      onClick={() => tieneVideo && manejarClicHabilidad(indice, habilidad.name)}
                    >
                      <CardBody>
                        <HStack spacing={4} align="start">
                          <Box
                            position="relative"
                            borderRadius="md"
                            overflow="hidden"
                            flexShrink={0}
                          >
                            <Image
                              src={`${DATA_DRAGON_BASE}/img/spell/${habilidad.image.full}`}
                              alt={habilidad.name}
                              boxSize="64px"
                              border="2px"
                              borderColor="blue.400"
                              borderRadius="md"
                            />
                            {indice === 0 && (
                              <Badge
                                position="absolute"
                                top={1}
                                right={1}
                                colorScheme="yellow"
                                fontSize="xs"
                              >
                                P
                              </Badge>
                            )}
                            {indice > 0 && (
                              <Badge
                                position="absolute"
                                top={1}
                                right={1}
                                colorScheme="blue"
                                fontSize="xs"
                              >
                                {indice}
                              </Badge>
                            )}
                          </Box>
                          <VStack align="start" spacing={2} flex={1}>
                            <HStack spacing={2} align="center">
                              <Heading size="md" color={useColorModeValue('gray.800', 'white')}>
                                {habilidad.name}
                              </Heading>
                              {tieneVideo && (
                                <Badge colorScheme="green" fontSize="xs">
                                  Ver video
                                </Badge>
                              )}
                            </HStack>
                            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} noOfLines={4}>
                              {habilidad.description.replace(/<[^>]*>/g, '')}
                            </Text>
                            {habilidad.cooldown && (
                              <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
                                Enfriamiento: {habilidad.cooldown.join(' / ')}s
                              </Text>
                            )}
                            {habilidad.cost && (
                              <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
                                Costo: {habilidad.cost.join(' / ')}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  );
                })}
              </SimpleGrid>
            </TabPanel>

            <TabPanel px={0}>
              <Box bg={fondoCard} p={6} borderRadius="lg" boxShadow="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <Text fontSize="lg" lineHeight="tall" whiteSpace="pre-wrap" color={useColorModeValue('gray.700', 'gray.300')}>
                  {campeon.lore}
                </Text>
              </Box>
            </TabPanel>

            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                {campeon.recommended.length > 0 ? (
                  campeon.recommended.map((recomendacion, indice) => (
                    <Box key={indice} bg={fondoCard} p={6} borderRadius="lg" boxShadow="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                      <Heading size="md" mb={4} color="blue.500">
                        {recomendacion.type}
                      </Heading>
                      <Divider mb={4} borderColor={useColorModeValue('gray.200', 'gray.700')} />
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {recomendacion.blocks.map((bloque, indiceBloque) => (
                          <Box key={indiceBloque}>
                            <Text fontWeight="bold" mb={3} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} textTransform="uppercase">
                              {bloque.type}
                            </Text>
                            <SimpleGrid columns={6} spacing={2}>
                              {bloque.items.map((objeto) => (
                                <Box
                                  key={objeto.id}
                                  bg={fondoStat}
                                  p={2}
                                  borderRadius="md"
                                  textAlign="center"
                                  minH="60px"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  border="2px"
                                  borderColor="transparent"
                                  _hover={{
                                    borderColor: 'blue.400',
                                    transform: 'scale(1.1)',
                                  }}
                                  transition="all 0.2s"
                                >
                                  <VStack spacing={0}>
                                    <Text fontSize="xs" fontWeight="bold">
                                      {objeto.id}
                                    </Text>
                                    {objeto.count > 1 && (
                                      <Text fontSize="xs" color="blue.500">
                                        x{objeto.count}
                                      </Text>
                                    )}
                                  </VStack>
                                </Box>
                              ))}
                            </SimpleGrid>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Box>
                  ))
                ) : (
                  <Box bg={fondoCard} p={6} borderRadius="lg" boxShadow="md" textAlign="center" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>No hay objetos recomendados disponibles</Text>
                  </Box>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>

    {/* Modal de Video de Habilidad */}
    {habilidadSeleccionada && (
      <ModalVideoHabilidad
        estaAbierto={mostrarModal}
        onCerrar={cerrarModal}
        urlVideo={habilidadSeleccionada.urlVideo}
        nombreHabilidad={habilidadSeleccionada.nombre}
      />
    )}
    </>
  );
};

export default ChampionDetail

