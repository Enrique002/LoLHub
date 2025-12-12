'use strict';

import React, { useState, useEffect, useMemo } from 'react';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { DATA_DRAGON_BASE } from '../config';
import Loading from '../components/Loading';
import ModalVideoHabilidad from '../components/ModalVideoHabilidad';
import { construirUrlVideoHabilidad } from '../utilidades/videosHabilidades';

/**
 * Componente de detalle del campeón
 * Muestra información completa del campeón incluyendo habilidades, estadísticas y objetos recomendados
 */
const ChampionDetail = () => {
  const { id } = useParams();
  const [campeon, setCampeon] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [items, setItems] = useState(new Map());
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const { isOpen: isItemModalOpen, onOpen: onItemModalOpen, onClose: onItemModalClose } = useDisclosure();
  const [habilidadSeleccionada, setHabilidadSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  /**
   * Carga los detalles del campeón desde la API
   */
  useEffect(() => {
    const cargarDetallesCampeon = async () => {
      try {
        const respuesta = await axios.get(
          `${DATA_DRAGON_BASE}/data/es_ES/champion/${id}.json`
        );
        if (id && respuesta.data?.data?.[id]) {
          setCampeon(respuesta.data.data[id]);
        } else {
          setCampeon(null);
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
   * Carga los datos de items para poder mostrar sus imágenes y detalles
   */
  useEffect(() => {
    const cargarItems = async () => {
      try {
        const respuesta = await axios.get(
          `${DATA_DRAGON_BASE}/data/es_ES/item.json`
        );
        const map = respuesta.data?.data || {};
        const itemsMap = new Map();
        
        Object.entries(map).forEach(([itemId, item]) => {
          if (item.image?.full) {
            itemsMap.set(itemId, {
              id: itemId,
              name: item.name,
              price: item.gold?.total ?? 0,
              image: `${DATA_DRAGON_BASE}/img/item/${item.image?.full || 'default.png'}`,
              plaintext: item.plaintext,
              description: item.description,
              stats: item.stats ?? {},
              maps: item.maps ?? {},
            });
          }
        });
        
        setItems(itemsMap);
      } catch (error) {
        console.error('Error al cargar items:', error);
      }
    };

    cargarItems();
  }, []);

  /**
   * Genera builds recomendadas basadas en el rol del campeón
   * Como la API de Data Dragon no incluye recommended, creamos builds genéricas por rol
   */
  const recomendacionesSR = useMemo(() => {
    if (!campeon || items.size === 0) {
      return [];
    }
    
    // Si hay recomendaciones de la API, usarlas
    if (campeon.recommended && Array.isArray(campeon.recommended) && campeon.recommended.length > 0) {
      return campeon.recommended
        .map(rec => {
          if (!rec.blocks || !Array.isArray(rec.blocks) || rec.blocks.length === 0) {
            return null;
          }
          
          const blocksProcesados = rec.blocks
            .map(block => {
              if (!block.items || !Array.isArray(block.items) || block.items.length === 0) {
                return null;
              }
              return { ...block, items: block.items };
            })
            .filter(block => block !== null && block.items.length > 0);
          
          if (blocksProcesados.length === 0) {
            return null;
          }
          
          return { ...rec, blocks: blocksProcesados };
        })
        .filter(rec => rec !== null);
    }
    
    // Si no hay recomendaciones, generar builds basadas en el rol
    const roles = campeon.tags || [];
    if (roles.length === 0) {
      return [];
    }
    
    // Mapeo de roles a items populares
    // Usamos nombres de items comunes que luego buscaremos por nombre en el mapa de items
    const buildsPorRol = {
      Fighter: {
        type: 'Build de Luchador',
        blocks: [
          { type: 'Inicio', itemNames: ['Daga', 'Poción de Vida'] },
          { type: 'Objetos Principales', itemNames: ['Hidra Profana', 'Hidra Titánica', 'Hidra Rápida'] },
          { type: 'Botas', itemNames: ['Botas de Mercurio'] },
          { type: 'Objetos Defensivos', itemNames: ['Coraza del Muerto', 'Cota de Espinas'] },
        ]
      },
      Tank: {
        type: 'Build de Tanque',
        blocks: [
          { type: 'Inicio', itemNames: ['Daga', 'Poción de Vida'] },
          { type: 'Objetos Principales', itemNames: ['Coraza del Muerto', 'Cota de Espinas', 'Corazón de Hielo'] },
          { type: 'Botas', itemNames: ['Botas de Armadura'] },
          { type: 'Objetos Defensivos', itemNames: ['Visión del Abismo', 'Gargola de Piedra'] },
        ]
      },
      Mage: {
        type: 'Build de Mago',
        blocks: [
          { type: 'Inicio', itemNames: ['Anillo de Doran', 'Poción de Vida'] },
          { type: 'Objetos Principales', itemNames: ['Llamada del Verdugo', 'Sombrero Mortífero de Rabadon', 'Cetro Abisal'] },
          { type: 'Botas', itemNames: ['Botas del Hechicero'] },
          { type: 'Objetos Mágicos', itemNames: ['Báculo del Vacío', 'Reloj de Arena de Zhonya'] },
        ]
      },
      Assassin: {
        type: 'Build de Asesino',
        blocks: [
          { type: 'Inicio', itemNames: ['Espada Larga', 'Poción de Vida'] },
          { type: 'Objetos Principales', itemNames: ['Hidra Profana', 'Hidra Rápida', 'Hidra Titánica'] },
          { type: 'Botas', itemNames: ['Botas de Mercurio'] },
          { type: 'Objetos de Letalidad', itemNames: ['Último Suspiro', 'Oportunidad'] },
        ]
      },
      Marksman: {
        type: 'Build de Tirador',
        blocks: [
          { type: 'Inicio', itemNames: ['Daga', 'Poción de Vida'] },
          { type: 'Objetos Principales', itemNames: ['Infinito', 'Filo Fantasma', 'Cañón de Fuego Rápido'] },
          { type: 'Botas', itemNames: ['Botas de Mercurio'] },
          { type: 'Objetos de Crítico', itemNames: ['Filo de la Tormenta', 'Guantelete de Fuego'] },
        ]
      },
      Support: {
        type: 'Build de Apoyo',
        blocks: [
          { type: 'Inicio', itemNames: ['Relicario de Escudo', 'Poción de Vida'] },
          { type: 'Objetos Principales', itemNames: ['Relicario de Escudo de Hierro', 'Visión del Abismo', 'Gargola de Piedra'] },
          { type: 'Botas', itemNames: ['Botas de Movimiento'] },
          { type: 'Objetos de Apoyo', itemNames: ['Redención', 'Locket del Solari de Hierro'] },
        ]
      },
    };
    
    // Función para buscar items por nombre (parcial)
    const buscarItemPorNombre = (nombre) => {
      for (const [itemId, itemData] of items.entries()) {
        if (itemData.name.toLowerCase().includes(nombre.toLowerCase()) || 
            nombre.toLowerCase().includes(itemData.name.toLowerCase())) {
          return itemId;
        }
      }
      return null;
    };
    
    // Filtrar items que existen y están disponibles en SR
    const buildsFiltradas = roles.map(rol => {
      const build = buildsPorRol[rol];
      if (!build) return null;
      
      const blocksFiltrados = build.blocks.map(block => {
        const itemsEncontrados = block.itemNames
          .map(itemName => {
            const itemId = buscarItemPorNombre(itemName);
            if (!itemId) return null;
            
            const itemData = items.get(itemId);
            if (!itemData) return null;
            
            // Verificar que esté disponible en SR (mapa 11)
            if (itemData.maps && Object.keys(itemData.maps).length > 0) {
              if (itemData.maps['11'] === false) return null;
            }
            
            return { id: itemId, count: 1 };
          })
          .filter(item => item !== null);
        
        return { type: block.type, items: itemsEncontrados };
      }).filter(block => block.items.length > 0);
      
      if (blocksFiltrados.length === 0) return null;
      
      return { type: build.type, blocks: blocksFiltrados };
    }).filter(build => build !== null);
    
    return buildsFiltradas;
  }, [campeon, items]);

  /**
   * Maneja el clic en una habilidad para mostrar su video
   * @param {number} indice - Índice de la habilidad
   * @param {string} nombreHabilidad - Nombre de la habilidad
   */
  const manejarClicHabilidad = (indice, nombreHabilidad) => {
    if (!id) return;
    
    const urlVideo = construirUrlVideoHabilidad(id, indice, campeon?.key);
    
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

  const roleTranslations = {
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
                src={`${DATA_DRAGON_BASE}/img/champion/${campeon.image?.full || 'default.png'}`}
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
                  {(campeon.tags || []).map((tag) => (
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
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats?.hp ?? 0}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats?.hpperlevel ?? 0} por nivel</StatHelpText>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Daño de Ataque</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{(campeon.stats?.attackdamage ?? 0).toFixed(1)}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats?.attackdamageperlevel ?? 0} por nivel</StatHelpText>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Armadura</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats?.armor ?? 0}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats?.armorperlevel ?? 0} por nivel</StatHelpText>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Resistencia Mágica</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats?.spellblock ?? 0}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats?.spellblockperlevel ?? 0} por nivel</StatHelpText>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Velocidad de Movimiento</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats?.movespeed ?? 0}</StatNumber>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Rango de Ataque</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{campeon.stats?.attackrange ?? 0}</StatNumber>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Velocidad de Ataque</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{(campeon.stats?.attackspeed ?? 0).toFixed(2)}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats?.attackspeedperlevel ?? 0}% por nivel</StatHelpText>
              </Stat>
              <Stat bg={fondoStat} p={4} borderRadius="md" border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <StatLabel color={useColorModeValue('gray.600', 'gray.300')}>Regeneración de Vida</StatLabel>
                <StatNumber fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>{(campeon.stats?.hpregen ?? 0).toFixed(1)}</StatNumber>
                <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>+{campeon.stats?.hpregenperlevel ?? 0} por nivel</StatHelpText>
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
                {(campeon.spells || []).map((habilidad, indice) => {
                  const urlVideo = id ? construirUrlVideoHabilidad(id, indice, campeon?.key) : null;
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
                              src={`${DATA_DRAGON_BASE}/img/spell/${habilidad.image?.full || 'default.png'}`}
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
                              {(habilidad.description || '').replace(/<[^>]*>/g, '')}
                            </Text>
                            {habilidad.cooldown && Array.isArray(habilidad.cooldown) && (
                              <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
                                Enfriamiento: {habilidad.cooldown.join(' / ')}s
                              </Text>
                            )}
                            {habilidad.cost && Array.isArray(habilidad.cost) && (
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
                {recomendacionesSR.length > 0 ? (
                  recomendacionesSR.map((recomendacion, indice) => (
                    <Box 
                      key={indice} 
                      bg={useColorModeValue('white', 'background.card')} 
                      p={6} 
                      borderRadius="lg" 
                      boxShadow="md" 
                      border="1px" 
                      borderColor={useColorModeValue('gray.200', 'background.muted')}
                    >
                      <Heading 
                        size="md" 
                        mb={4} 
                        fontWeight="bold"
                        color="foreground.primary"
                      >
                        {recomendacion.type || 'Build Recomendada'}
                      </Heading>
                      <Divider mb={4} borderColor={useColorModeValue('gray.200', 'background.muted')} />
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {recomendacion.blocks.map((bloque, indiceBloque) => (
                          <Box key={indiceBloque}>
                            <Text 
                              fontWeight="bold" 
                              mb={4} 
                              fontSize="sm" 
                              color="foreground.muted" 
                              textTransform="uppercase"
                              letterSpacing="wide"
                            >
                              {bloque.type}
                            </Text>
                            <SimpleGrid columns={6} spacing={3}>
                              {bloque.items.map((objeto) => {
                                const itemData = items.get(objeto.id);
                                const itemImage = itemData 
                                  ? itemData.image 
                                  : `${DATA_DRAGON_BASE}/img/item/${objeto.id}.png`;
                                const itemName = (itemData && itemData.name) || `Item ${objeto.id}`;
                                
                                return (
                                  <Box
                                    key={objeto.id}
                                    position="relative"
                                    bg={useColorModeValue('gray.50', 'background.secondary')}
                                    p={2}
                                    borderRadius="md"
                                    textAlign="center"
                                    minH="64px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="2px"
                                    borderColor="transparent"
                                    cursor={itemData ? "pointer" : "default"}
                                    onClick={() => {
                                      if (itemData) {
                                        setItemSeleccionado(itemData);
                                        onItemModalOpen();
                                      }
                                    }}
                                    _hover={itemData ? {
                                      borderColor: 'gold.200',
                                      transform: 'scale(1.1)',
                                      boxShadow: 'xl',
                                    } : {}}
                                    transition="all 0.2s"
                                  >
                                    <VStack spacing={1}>
                                      <Image
                                        src={itemImage}
                                        alt={itemName}
                                        boxSize="48px"
                                        objectFit="contain"
                                        loading="lazy"
                                        onError={(e) => {
                                          // Si falla la imagen, intentar con el formato estándar
                                          const target = e.target;
                                          target.src = `${DATA_DRAGON_BASE}/img/item/${objeto.id}.png`;
                                        }}
                                      />
                                      {objeto.count > 1 && (
                                        <Badge
                                          position="absolute"
                                          top={1}
                                          right={1}
                                          variant="gold"
                                          fontSize="xs"
                                          borderRadius="full"
                                          minW="20px"
                                          h="20px"
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                        >
                                          {objeto.count}
                                        </Badge>
                                      )}
                                    </VStack>
                                  </Box>
                                );
                              })}
                            </SimpleGrid>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Box>
                  ))
                ) : (
                  <Box 
                    bg={useColorModeValue('white', 'background.card')} 
                    p={6} 
                    borderRadius="lg" 
                    boxShadow="md" 
                    textAlign="center" 
                    border="1px" 
                    borderColor={useColorModeValue('gray.200', 'background.muted')}
                  >
                    <Text color="foreground.muted">
                      No hay objetos recomendados disponibles para Grieta del Invocador
                    </Text>
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

    {/* Modal de Detalles de Item */}
    <Modal isOpen={isItemModalOpen} onClose={onItemModalClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
      <ModalContent
        bg={useColorModeValue('white', 'background.card')}
        borderRadius="xl"
        maxW="700px"
        boxShadow="2xl"
      >
        <ModalHeader
          fontSize="2xl"
          fontWeight="extrabold"
          letterSpacing="tight"
          color="foreground.primary"
          pb={4}
          borderBottom="1px"
          borderColor="background.muted"
        >
          <HStack spacing={4} align="center">
            {itemSeleccionado && (
              <>
                <Image
                  src={itemSeleccionado.image}
                  alt={itemSeleccionado.name}
                  boxSize="64px"
                  borderRadius="lg"
                  objectFit="contain"
                  bg={useColorModeValue('gray.50', 'background.secondary')}
                  p={2}
                />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="2xl" fontWeight="extrabold" color="foreground.primary">
                    {itemSeleccionado.name}
                  </Text>
                  {itemSeleccionado.price > 0 && (
                    <Badge variant="gold" fontSize="md" px={3} py={1}>
                      {itemSeleccionado.price} oro
                    </Badge>
                  )}
                </VStack>
              </>
            )}
          </HStack>
        </ModalHeader>
        <ModalCloseButton size="lg" />
        <ModalBody pb={8} pt={6}>
          {itemSeleccionado && (
            <VStack spacing={6} align="stretch">
              {itemSeleccionado.plaintext && (
                <Box
                  bg={useColorModeValue('gray.50', 'background.secondary')}
                  p={4}
                  borderRadius="lg"
                  borderLeft="4px"
                  borderColor="gold.200"
                >
                  <Text
                    fontSize="md"
                    color="foreground.primary"
                    lineHeight="relaxed"
                    fontStyle="italic"
                  >
                    {itemSeleccionado.plaintext}
                  </Text>
                </Box>
              )}

              {itemSeleccionado.description && (
                <Box>
                  <Heading 
                    size="sm" 
                    mb={4} 
                    fontWeight="bold" 
                    color="foreground.primary"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Descripción Completa
                  </Heading>
                  <Box
                    bg={useColorModeValue('gray.50', 'background.secondary')}
                    p={5}
                    borderRadius="lg"
                    border="1px"
                    borderColor="background.muted"
                  >
                    <Text
                      fontSize="sm"
                      color="foreground.primary"
                      lineHeight="relaxed"
                      whiteSpace="pre-wrap"
                      dangerouslySetInnerHTML={{ __html: itemSeleccionado.description }}
                      sx={{
                        '& p': {
                          marginBottom: '0.75rem',
                        },
                        '& strong': {
                          color: 'gold.200',
                          fontWeight: 'bold',
                        },
                        '& em': {
                          color: 'magic.400',
                          fontStyle: 'italic',
                        },
                      }}
                    />
                  </Box>
                </Box>
              )}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  );
};

export default ChampionDetail

