'use strict';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  useDisclosure,
  useToast,
  Avatar,
  VStack,
  Progress,
  HStack,
} from '@chakra-ui/react';
import { Camera, Star, ImageIcon, Search, Sparkles, Shield, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { favoriteService } from '../services/favoriteService';
import ChampionCard, { DatosCampeonFavorito } from '../components/ChampionCard';
import { DATA_DRAGON_BASE } from '../config';
import { missionsService, MissionProgress, MissionSummary, MissionReward } from '../services/missionsService';

interface ItemData {
  id: string;
  name: string;
  description: string;
  image: { full: string };
  tags?: string[];
}

interface RuneData {
  id: string;
  name: string;
  icon: string;
  shortDesc?: string;
  longDesc?: string;
}

type ModalTipo = 'items' | 'runes';

const hexToRgba = (hex: string, alpha = 1): string => {
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

const buildDecorationGlow = (color: string) => ({
  backgroundImage: `linear-gradient(135deg, ${color}, ${hexToRgba(color, 0.2)})`,
  boxShadow: `0 15px 35px ${hexToRgba(color, 0.45)}`,
});

const Profile: React.FC = () => {
  const { usuario, estaAutenticado, actualizarUsuario, cargando } = useAuth();
  const navegar = useNavigate();
  const toast = useToast();

  const [perfil, setPerfil] = useState(usuario);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [favoritosCampeones, setFavoritosCampeones] = useState<DatosCampeonFavorito[]>([]);
  const [itemsDatos, setItemsDatos] = useState<Record<string, ItemData>>({});
  const [runesDatos, setRunesDatos] = useState<Record<string, RuneData>>({});
  const [favoritosItems, setFavoritosItems] = useState<string[]>([]);
  const [favoritosRunas, setFavoritosRunas] = useState<string[]>([]);
  const [misiones, setMisiones] = useState<MissionProgress[]>([]);
  const [resumenMisiones, setResumenMisiones] = useState<MissionSummary | null>(null);
  const [actualizandoDecoracion, setActualizandoDecoracion] = useState<string | 'remove' | null>(null);

  const [modalTipo, setModalTipo] = useState<ModalTipo>('items');
  const modalEdicion = useDisclosure();
  const [busquedaModal, setBusquedaModal] = useState('');
  const [seleccionTemporal, setSeleccionTemporal] = useState<string[]>([]);

  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const inputBannerRef = useRef<HTMLInputElement>(null);
  const decoracionActiva = perfil?.selected_decoration ?? null;

  const recargarMisiones = useCallback(async () => {
    try {
      const respuesta = await missionsService.obtenerProgreso();
      setMisiones(respuesta.missions);
      setResumenMisiones(respuesta.summary);
    } catch (error) {
      console.error('No se pudieron cargar las misiones', error);
    }
  }, []);

  const equiparDecoracion = useCallback(
    async (missionKey: string | null) => {
      setActualizandoDecoracion(missionKey ?? 'remove');
      try {
        const respuesta = await profileService.actualizarPerfil({
          selected_decoration_key: missionKey,
        });
        setPerfil(respuesta.user);
        actualizarUsuario(respuesta.user);
        toast({
          title: missionKey ? 'Decoración equipada' : 'Decoración removida',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'No se pudo actualizar la decoración',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setActualizandoDecoracion(null);
      }
    },
    [actualizarUsuario, toast]
  );

  useEffect(() => {
    if (cargando) {
      return;
    }

    if (!estaAutenticado) {
      navegar('/login');
      return;
    }

    const cargarPerfil = async () => {
      try {
        const [perfilResp, favoritosResp] = await Promise.all([
          profileService.obtenerPerfil(),
          favoriteService.obtenerFavoritos(),
        ]);

        setPerfil(perfilResp.user);
        setFavoritosItems(perfilResp.user.favorite_items ?? []);
        setFavoritosRunas(perfilResp.user.favorite_runes ?? []);
        setFavoritosCampeones(favoritosResp as DatosCampeonFavorito[]);
        actualizarUsuario(perfilResp.user);
        await recargarMisiones();
      } catch (error) {
        toast({
          title: 'Error al cargar el perfil',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setCargandoPerfil(false);
      }
    };

    const cargarDatosEstaticos = async () => {
      try {
        const [itemsResp, runasResp] = await Promise.all([
          fetch(`${DATA_DRAGON_BASE}/data/es_ES/item.json`).then((res) => res.json()),
          fetch(`${DATA_DRAGON_BASE}/data/es_ES/runesReforged.json`).then((res) => res.json()),
        ]);

        const itemsMap: Record<string, ItemData> = {};
        Object.entries(itemsResp.data).forEach(([id, data]: [string, any]) => {
          itemsMap[id] = { id, name: data.name, description: data.description, image: data.image, tags: data.tags };
        });
        setItemsDatos(itemsMap);

        const runesMap: Record<string, RuneData> = {};
        runasResp.forEach((tree: any) => {
          tree.slots.forEach((slot: any) => {
            slot.runes.forEach((rune: any) => {
              runesMap[String(rune.id)] = {
                id: String(rune.id),
                name: rune.name,
                icon: rune.icon,
                shortDesc: rune.shortDesc,
                longDesc: rune.longDesc,
              };
            });
          });
        });
        setRunesDatos(runesMap);
      } catch (error) {
        console.error('Error cargando datos de referencia:', error);
      }
    };

    cargarPerfil();
    cargarDatosEstaticos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estaAutenticado, cargando, recargarMisiones]);

  const manejarCargaArchivo = (tipo: 'avatar' | 'banner') => (evento: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append(tipo === 'avatar' ? 'avatar' : 'banner', archivo);

    profileService
      .actualizarPerfil(formData)
      .then((respuesta) => {
        setPerfil(respuesta.user);
        actualizarUsuario(respuesta.user);
        toast({
          title: tipo === 'avatar' ? 'Foto de perfil actualizada' : 'Banner actualizado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        recargarMisiones();
      })
      .catch(() => {
        toast({
          title: 'No se pudo actualizar la imagen',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const abrirModalFavoritos = (tipo: ModalTipo) => {
    setModalTipo(tipo);
    setSeleccionTemporal(tipo === 'items' ? favoritosItems : favoritosRunas);
    setBusquedaModal('');
    modalEdicion.onOpen();
  };

  const guardarFavoritos = () => {
    const payload =
      modalTipo === 'items'
        ? { favorite_items: seleccionTemporal }
        : { favorite_runes: seleccionTemporal };

    profileService
      .actualizarPerfil(payload)
      .then((respuesta) => {
        setPerfil(respuesta.user);
        actualizarUsuario(respuesta.user);
        setFavoritosItems(respuesta.user.favorite_items ?? []);
        setFavoritosRunas(respuesta.user.favorite_runes ?? []);
        modalEdicion.onClose();
        toast({
          title: 'Favoritos actualizados',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        recargarMisiones();
      })
      .catch(() => {
        toast({
          title: 'No se pudieron guardar los favoritos',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const alternarSeleccionTemporal = (id: string) => {
    setSeleccionTemporal((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const elementosModal = useMemo(() => {
    if (modalTipo === 'items') {
      return Object.values(itemsDatos).filter((item) =>
        item.name.toLowerCase().includes(busquedaModal.toLowerCase())
      );
    }
    return Object.values(runesDatos).filter((runa) =>
      runa.name.toLowerCase().includes(busquedaModal.toLowerCase())
    );
  }, [modalTipo, itemsDatos, runesDatos, busquedaModal]);

  const renderModalElemento = (id: string, nombre: string, icono: React.ReactNode) => {
    const seleccionado = seleccionTemporal.includes(id);
    return (
      <Box
        key={id}
        borderWidth="1px"
        borderRadius="md"
        p={3}
        cursor="pointer"
        borderColor={seleccionado ? 'gold.200' : 'background.muted'}
        bg={seleccionado ? 'gold.50' : 'transparent'}
        onClick={() => alternarSeleccionTemporal(id)}
        transition="all 0.2s"
      >
        <Flex align="center" gap={3}>
          {icono}
          <Text fontWeight="medium">{nombre}</Text>
        </Flex>
      </Box>
    );
  };

  const renderItemsFavoritos = () => {
    if (!favoritosItems.length) {
      return <Text color="foreground.muted">Aún no tienes objetos favoritos.</Text>;
    }

    return (
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
        {favoritosItems.map((id) => {
          const item = itemsDatos[id];
          if (!item) return null;
          return (
            <Flex
              key={id}
              p={3}
              align="center"
              gap={3}
              borderWidth="1px"
              borderRadius="lg"
              borderColor="background.muted"
              bg="background.card"
            >
              <Image
                src={`${DATA_DRAGON_BASE}/img/item/${item.image.full}`}
                alt={item.name}
                boxSize="48px"
                borderRadius="md"
              />
              <Box>
                <Text fontWeight="semibold">{item.name}</Text>
                <Text fontSize="xs" color="foreground.muted" noOfLines={2}>
                  {item.tags?.join(', ')}
                </Text>
              </Box>
            </Flex>
          );
        })}
      </SimpleGrid>
    );
  };

  const renderRunasFavoritas = () => {
    if (!favoritosRunas.length) {
      return <Text color="foreground.muted">Aún no tienes runas favoritas.</Text>;
    }

    return (
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
        {favoritosRunas.map((id) => {
          const runa = runesDatos[id];
          if (!runa) return null;
          return (
            <Flex
              key={id}
              p={3}
              align="center"
              gap={3}
              borderWidth="1px"
              borderRadius="lg"
              borderColor="background.muted"
              bg="background.card"
            >
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/img/${runa.icon}`}
                alt={runa.name}
                boxSize="48px"
              />
              <Box>
                <Text fontWeight="semibold">{runa.name}</Text>
                <Text fontSize="xs" color="foreground.muted" noOfLines={2}>
                  {runa.shortDesc}
                </Text>
              </Box>
            </Flex>
          );
        })}
      </SimpleGrid>
    );
  };

  const missionIconMap = useMemo(
    () => ({
      crown: Crown,
      sparkles: Sparkles,
      shield: Shield,
      image: ImageIcon,
    }),
    []
  );

  const renderDecoracion = useCallback(
    (decoracion: MissionReward) => {
      const IconComponent = missionIconMap[decoracion.icon as keyof typeof missionIconMap] ?? Sparkles;
      return (
        <Tag
          key={decoracion.key}
          borderRadius="full"
          px={4}
          py={2}
          bg="transparent"
          borderColor={decoracion.color}
          borderWidth="1px"
        >
          <Flex align="center" gap={2}>
            <Icon as={IconComponent} color={decoracion.color} />
            <Text fontWeight="semibold">{decoracion.title}</Text>
          </Flex>
        </Tag>
      );
    },
    [missionIconMap]
  );

  if (cargando || cargandoPerfil) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack spacing={8} align="stretch">
          <Box borderRadius="2xl" overflow="hidden" boxShadow="2xl" borderWidth="1px" borderColor="background.muted" p={6}>
            <Skeleton height="240px" borderRadius="xl" mb={4} />
            <Flex align="center" gap={4}>
              <SkeletonCircle size="24" />
              <Box flex="1">
                <Skeleton height="20px" width="200px" mb={2} />
                <Skeleton height="14px" width="150px" />
              </Box>
            </Flex>
          </Box>
          <Box>
            <Skeleton height="24px" width="200px" mb={4} />
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} height="220px" borderRadius="lg" />
              ))}
            </SimpleGrid>
          </Box>
          <Box>
            <Skeleton height="24px" width="220px" mb={4} />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </Box>
        </VStack>
      </Container>
    );
  }

  if (!estaAutenticado) {
    return null;
  }

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        <Box
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="2xl"
          borderWidth="1px"
          borderColor="background.muted"
        >
          <Box
            position="relative"
            bg={perfil?.banner_url ? undefined : 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)'}
            minH="200px"
          >
            {perfil?.banner_url && (
              <Image
                src={perfil.banner_url}
                alt="Banner"
                width="100%"
                height="240px"
                objectFit="cover"
              />
            )}
            <IconButton
              aria-label="Cambiar banner"
              icon={<ImageIcon />}
              position="absolute"
              top={4}
              right={4}
              onClick={() => inputBannerRef.current?.click()}
            />
            <Input
              type="file"
              accept="image/*"
              hidden
              ref={inputBannerRef}
              onChange={manejarCargaArchivo('banner')}
            />
            <Box
              position="absolute"
              bottom="-64px"
              left="32px"
              display="flex"
              flexDirection="column"
              gap={2}
              alignItems="flex-start"
            >
              <Box position="relative" display="inline-block">
                <Box
                  borderRadius="full"
                  p={decoracionActiva ? 2 : 0}
                  bg={decoracionActiva ? 'transparent' : 'background.card'}
                  border={decoracionActiva ? '2px solid transparent' : '4px solid background.card'}
                  sx={decoracionActiva ? buildDecorationGlow(decoracionActiva.color) : undefined}
                >
                  <Avatar
                    size="xl"
                    name={perfil?.name}
                    src={perfil?.avatar_url ?? undefined}
                    borderWidth={decoracionActiva ? 0 : 0}
                  />
                </Box>
                <IconButton
                  aria-label="Cambiar avatar"
                  icon={<Camera />}
                  size="sm"
                  position="absolute"
                  bottom={0}
                  right={-2}
                  onClick={() => inputAvatarRef.current?.click()}
                />
              </Box>
              {decoracionActiva && (
                <Tag variant="subtle" colorScheme="yellow">
                  {decoracionActiva.title}
                </Tag>
              )}
            </Box>
            <Input
              type="file"
              accept="image/*"
              hidden
              ref={inputAvatarRef}
              onChange={manejarCargaArchivo('avatar')}
            />
          </Box>
          <Box p={6} pt={14}>
            <Heading size="lg">{perfil?.name}</Heading>
            <Text color="foreground.muted">{perfil?.email}</Text>
            <Tag mt={3} variant="subtle" colorScheme="yellow">
              Invocador activo
            </Tag>
          </Box>
        </Box>

        {resumenMisiones && (
          <Box borderWidth="1px" borderRadius="2xl" p={6} borderColor="background.muted" bg="background.card" boxShadow="xl">
            <Flex align="center" justify="space-between" mb={6} direction={{ base: 'column', md: 'row' }} gap={3}>
              <Box>
                <Heading size="md">Misiones y decoraciones</Heading>
                <Text color="foreground.muted">Completa los retos para desbloquear adornos únicos.</Text>
              </Box>
              <Tag size="lg" colorScheme="yellow" borderRadius="full" px={4}>
                {resumenMisiones.completed}/{resumenMisiones.total} completadas
              </Tag>
            </Flex>
            <Stack spacing={4}>
              {misiones.length ? (
                misiones.map((mision) => {
                  const IconComponent = missionIconMap[mision.reward.icon as keyof typeof missionIconMap] ?? Sparkles;
                  return (
                    <Box
                      key={mision.key}
                      borderWidth="1px"
                      borderRadius="lg"
                      p={4}
                      borderColor={mision.completed ? 'gold.300' : 'background.muted'}
                      bg={mision.completed ? 'yellow.900' : 'background.secondary'}
                    >
                      <Flex
                        justify="space-between"
                        align={{ base: 'flex-start', md: 'center' }}
                        gap={3}
                        direction={{ base: 'column', md: 'row' }}
                        mb={3}
                      >
                        <Box>
                          <Flex align="center" gap={3}>
                            <Icon as={IconComponent} color={mision.completed ? 'gold.200' : 'foreground.primary'} />
                            <Heading size="sm">{mision.title}</Heading>
                          </Flex>
                          <Text color="foreground.muted" fontSize="sm" mt={1}>
                            {mision.description}
                          </Text>
                        </Box>
                        <Tag colorScheme={mision.completed ? 'yellow' : 'gray'} borderRadius="full">
                          {mision.completed ? 'Completada' : `${mision.progress.current}/${mision.progress.target}`}
                        </Tag>
                      </Flex>
                      <Progress value={mision.progress.percentage} colorScheme="yellow" size="sm" borderRadius="full" />
                      <HStack spacing={2} mt={3} color="foreground.muted" fontSize="sm">
                        <Text>Recompensa:</Text>
                        <Flex align="center" gap={2}>
                          <Icon as={IconComponent} color={mision.reward.color} />
                          <Text fontWeight="semibold" color="foreground.primary">
                            {mision.reward.title}
                          </Text>
                        </Flex>
                      </HStack>
                    </Box>
                  );
                })
              ) : (
                <Text color="foreground.muted">Estamos calculando tus misiones...</Text>
              )}
            </Stack>
            <Box mt={6}>
              <Heading size="sm" mb={3}>
                Decoraciones desbloqueadas
              </Heading>
              {resumenMisiones.decorations.length ? (
                <Stack spacing={3}>
                  {resumenMisiones.decorations.map((decoracion) => {
                    const esActiva = decoracionActiva?.key === decoracion.key;
                    return (
                      <Flex
                        key={decoracion.key}
                        align={{ base: 'flex-start', md: 'center' }}
                        justify="space-between"
                        gap={3}
                        direction={{ base: 'column', md: 'row' }}
                        borderWidth="1px"
                        borderRadius="lg"
                        p={3}
                        borderColor={esActiva ? decoracion.color : 'background.muted'}
                        bg={esActiva ? hexToRgba(decoracion.color, 0.1) : 'transparent'}
                      >
                        {renderDecoracion(decoracion)}
                        <Button
                          size="sm"
                          variant={esActiva ? 'solid' : 'outline'}
                          colorScheme="yellow"
                          onClick={() => equiparDecoracion(decoracion.key)}
                          isDisabled={esActiva}
                          isLoading={actualizandoDecoracion === decoracion.key}
                        >
                          {esActiva ? 'Equipado' : 'Equipar'}
                        </Button>
                      </Flex>
                    );
                  })}
                  {decoracionActiva && (
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="whiteAlpha"
                      alignSelf="flex-start"
                      onClick={() => equiparDecoracion(null)}
                      isLoading={actualizandoDecoracion === 'remove'}
                    >
                      Quitar decoración
                    </Button>
                  )}
                </Stack>
              ) : (
                <Text color="foreground.muted">Completa una misión para conseguir tu primera decoración.</Text>
              )}
            </Box>
          </Box>
        )}

        <Box>
          <Flex align="center" justify="space-between" mb={4}>
            <Flex align="center" gap={2}>
              <Icon as={Star} color="gold.200" />
              <Heading size="md">Campeones Favoritos</Heading>
            </Flex>
            <Button leftIcon={<Shield size={16} />} onClick={() => navegar('/champions')}>
              Administrar en listado
            </Button>
          </Flex>
          {favoritosCampeones.length ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={4}>
              {favoritosCampeones.map((campeon) => (
                <ChampionCard
                  key={campeon.id}
                  {...campeon}
                  esFavoritoInicial
                  variant="compact"
                  onFavoriteChange={(_, esFavorito) => {
                    if (!esFavorito) {
                      setFavoritosCampeones((prev) => prev.filter((c) => c.id !== campeon.id));
                    }
                  }}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Text color="foreground.muted">Aún no tienes campeones favoritos.</Text>
          )}
        </Box>

        <Divider />

        <Box>
          <Flex align="center" justify="space-between" mb={4}>
            <Flex align="center" gap={2}>
              <Icon as={Sparkles} color="gold.200" />
              <Heading size="md">Objetos Favoritos</Heading>
            </Flex>
            <Button size="sm" variant="outline" onClick={() => abrirModalFavoritos('items')}>
              Editar
            </Button>
          </Flex>
          {renderItemsFavoritos()}
        </Box>

        <Box>
          <Flex align="center" justify="space-between" mb={4}>
            <Flex align="center" gap={2}>
              <Icon as={Sparkles} color="gold.200" />
              <Heading size="md">Runas Favoritas</Heading>
            </Flex>
            <Button size="sm" variant="outline" onClick={() => abrirModalFavoritos('runes')}>
              Editar
            </Button>
          </Flex>
          {renderRunasFavoritas()}
        </Box>
      </VStack>

      <Modal isOpen={modalEdicion.isOpen} onClose={modalEdicion.onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Selecciona tus {modalTipo === 'items' ? 'objetos' : 'runas'} favoritos
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup mb={4}>
              <InputLeftElement pointerEvents="none">
                <Icon as={Search} />
              </InputLeftElement>
              <Input
                placeholder="Buscar..."
                value={busquedaModal}
                onChange={(e) => setBusquedaModal(e.target.value)}
              />
            </InputGroup>
            <VStack spacing={3} align="stretch">
              {elementosModal.map((elemento) =>
                renderModalElemento(
                  elemento.id,
                  elemento.name,
                  modalTipo === 'items' ? (
                    <Image
                      src={`${DATA_DRAGON_BASE}/img/item/${(elemento as ItemData).image.full}`}
                      alt={elemento.name}
                      boxSize="48px"
                      borderRadius="md"
                    />
                  ) : (
                    <Image
                      src={`https://ddragon.leagueoflegends.com/cdn/img/${(elemento as RuneData).icon}`}
                      alt={elemento.name}
                      boxSize="48px"
                    />
                  )
                )
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={modalEdicion.onClose}>
              Cancelar
            </Button>
            <Button colorScheme="yellow" onClick={guardarFavoritos}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Profile;


