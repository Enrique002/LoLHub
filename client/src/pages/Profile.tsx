'use strict';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
} from '@chakra-ui/react';
import { Camera, Star, ImageIcon, Search, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { favoriteService } from '../services/favoriteService';
import ChampionCard, { DatosCampeonFavorito } from '../components/ChampionCard';
import { DATA_DRAGON_BASE } from '../config';

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

  const [modalTipo, setModalTipo] = useState<ModalTipo>('items');
  const modalEdicion = useDisclosure();
  const [busquedaModal, setBusquedaModal] = useState('');
  const [seleccionTemporal, setSeleccionTemporal] = useState<string[]>([]);

  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const inputBannerRef = useRef<HTMLInputElement>(null);

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
  }, [estaAutenticado, cargando]);

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
            <Avatar
              size="xl"
              name={perfil?.name}
              src={perfil?.avatar_url ?? undefined}
              borderWidth="4px"
              borderColor="background.card"
              position="absolute"
              bottom="-48px"
              left="32px"
            />
            <IconButton
              aria-label="Cambiar avatar"
              icon={<Camera />}
              position="absolute"
              bottom="16px"
              left="140px"
              onClick={() => inputAvatarRef.current?.click()}
            />
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
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
              {favoritosCampeones.map((campeon) => (
                <ChampionCard
                  key={campeon.id}
                  {...campeon}
                  esFavoritoInicial
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


