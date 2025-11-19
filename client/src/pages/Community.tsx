'use strict';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Skeleton,
  Spinner,
  Stack,
  Tag,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Handshake, UsersRound, UserPlus, UserCheck, Clock4, UserX, Ban, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  communityService,
  SolicitudAmistad,
  UsuarioComunidad,
  EstadoAmistad,
  MensajeAmigo,
  UsuarioBloqueado,
} from '../services/communityService';
import ConfirmModal from '../components/ConfirmModal';

const estadoConfig: Record<EstadoAmistad, { label: string; color: string }> = {
  none: { label: 'Agregar amigo', color: 'gold' },
  outgoing: { label: 'Solicitud enviada', color: 'gray' },
  incoming: { label: 'Solicitud pendiente', color: 'purple' },
  friend: { label: 'Amigos', color: 'green' },
};

const Community: React.FC = () => {
  const { estaAutenticado, cargando, usuario } = useAuth();
  const navegar = useNavigate();
  const toast = useToast();

  const [usuarios, setUsuarios] = useState<UsuarioComunidad[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudAmistad[]>([]);
  const [usuariosBloqueados, setUsuariosBloqueados] = useState<UsuarioBloqueado[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MensajeAmigo[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'block' | null;
    userId: number | null;
    userName?: string;
  }>({
    isOpen: false,
    type: null,
    userId: null,
  });

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [usersResp, requestsResp, blockedResp] = await Promise.all([
        communityService.obtenerUsuarios(),
        communityService.obtenerSolicitudes(),
        communityService.obtenerUsuariosBloqueados(),
      ]);
      setUsuarios(usersResp);
      setSolicitudes(requestsResp);
      setUsuariosBloqueados(blockedResp);
    } catch (error) {
      toast({
        title: 'No se pudo cargar la comunidad',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cargando) {
      return;
    }
    if (!estaAutenticado) {
      navegar('/login');
      return;
    }
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estaAutenticado, cargando]);

  const actualizarEstadoUsuario = (userId: number, estado: EstadoAmistad) => {
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === userId
          ? {
              ...usuario,
              status: estado,
            }
          : usuario
      )
    );
  };

  const manejarAccionSolicitud = async (id: number, accion: 'accept' | 'reject') => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      if (accion === 'accept') {
        await communityService.aceptarSolicitud(id);
        const solicitud = solicitudes.find((sol) => sol.id === id);
        if (solicitud) {
          actualizarEstadoUsuario(solicitud.requester.id, 'friend');
        }
        toast({ title: 'Solicitud aceptada', status: 'success', duration: 3000, isClosable: true });
      } else {
        await communityService.rechazarSolicitud(id);
        const solicitud = solicitudes.find((sol) => sol.id === id);
        if (solicitud) {
          actualizarEstadoUsuario(solicitud.requester.id, 'none');
        }
        toast({ title: 'Solicitud rechazada', status: 'info', duration: 3000, isClosable: true });
      }
      setSolicitudes((prev) => prev.filter((sol) => sol.id !== id));
    } catch (error) {
      toast({
        title: 'No se pudo actualizar la solicitud',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const enviarSolicitud = async (userId: number) => {
    setProcessingIds((prev) => new Set(prev).add(userId));
    try {
      await communityService.enviarSolicitud(userId);
      actualizarEstadoUsuario(userId, 'outgoing');
      toast({ title: 'Solicitud enviada', status: 'success', duration: 3000, isClosable: true });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.receiver_id?.[0] ||
        'No se pudo enviar la solicitud';
      toast({ title: 'Error', description: message, status: 'error', duration: 3000, isClosable: true });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const totalAmigos = useMemo(
    () => usuarios.filter((usuario) => usuario.status === 'friend').length,
    [usuarios]
  );

  const amigos = useMemo(
    () => usuarios.filter((usuario) => usuario.status === 'friend'),
    [usuarios]
  );

  const totalPendientes = solicitudes.length;

  const amigoSeleccionado = useMemo(
    () => amigos.find((friend) => friend.id === selectedFriendId) ?? null,
    [amigos, selectedFriendId]
  );

  const obtenerMensajes = useCallback(
    async (friendId: number, opciones?: { silencioso?: boolean }) => {
      const silencioso = opciones?.silencioso ?? false;
      try {
        if (!silencioso) {
          setLoadingMessages(true);
        }
        const data = await communityService.obtenerMensajes(friendId);
        setMessages(data);
        setMessagesError(null);
      } catch (error) {
        if (!silencioso) {
          toast({
            title: 'No se pudieron cargar los mensajes',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
        setMessagesError('No se pudieron cargar los mensajes');
      } finally {
        if (!silencioso) {
          setLoadingMessages(false);
        }
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!selectedFriendId) {
      setMessages([]);
      return;
    }

    obtenerMensajes(selectedFriendId);
    const interval = window.setInterval(() => {
      obtenerMensajes(selectedFriendId, { silencioso: true });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [selectedFriendId, obtenerMensajes]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const enviarMensaje = async () => {
    if (!selectedFriendId || !messageInput.trim()) {
      return;
    }

    try {
      setSendingMessage(true);
      const nuevoMensaje = await communityService.enviarMensaje(selectedFriendId, messageInput.trim());
      setMessages((prev) => [...prev, nuevoMensaje]);
      setMessageInput('');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.message?.[0] ||
        'No se pudo enviar el mensaje';
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const manejarKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      enviarMensaje();
    }
  };

  const abrirConfirmacionEliminar = (friendId: number, friendName?: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      userId: friendId,
      userName: friendName,
    });
  };

  const abrirConfirmacionBloquear = (userId: number, userName?: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'block',
      userId,
      userName,
    });
  };

  const eliminarAmigo = async (friendId: number) => {
    setProcessingIds((prev) => new Set(prev).add(friendId));
    try {
      await communityService.eliminarAmigo(friendId);
      actualizarEstadoUsuario(friendId, 'none');
      if (selectedFriendId === friendId) {
        setSelectedFriendId(null);
        setMessages([]);
      }
      toast({ title: 'Amigo eliminado', status: 'success', duration: 3000, isClosable: true });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'No se pudo eliminar el amigo';
      toast({ title: 'Error', description: message, status: 'error', duration: 3000, isClosable: true });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(friendId);
        return next;
      });
    }
  };

  const bloquearUsuario = async (userId: number) => {
    setProcessingIds((prev) => new Set(prev).add(userId));
    try {
      await communityService.bloquearUsuario(userId);
      await cargarDatos();
      if (selectedFriendId === userId) {
        setSelectedFriendId(null);
        setMessages([]);
      }
      toast({ title: 'Usuario bloqueado', status: 'success', duration: 3000, isClosable: true });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'No se pudo bloquear el usuario';
      toast({ title: 'Error', description: message, status: 'error', duration: 3000, isClosable: true });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const manejarConfirmacion = () => {
    if (!confirmModal.userId || !confirmModal.type) return;

    if (confirmModal.type === 'delete') {
      eliminarAmigo(confirmModal.userId);
    } else if (confirmModal.type === 'block') {
      bloquearUsuario(confirmModal.userId);
    }
  };

  const desbloquearUsuario = async (blockedUserId: number) => {
    setProcessingIds((prev) => new Set(prev).add(blockedUserId));
    try {
      await communityService.desbloquearUsuario(blockedUserId);
      setUsuariosBloqueados((prev) => prev.filter((u) => u.user.id !== blockedUserId));
      toast({ title: 'Usuario desbloqueado', status: 'success', duration: 3000, isClosable: true });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'No se pudo desbloquear el usuario';
      toast({ title: 'Error', description: message, status: 'error', duration: 3000, isClosable: true });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(blockedUserId);
        return next;
      });
    }
  };

  if (cargando || loading) {
    return (
      <Container maxW="1200px" py={10}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
          <Skeleton height="120px" borderRadius="lg" />
          <Skeleton height="120px" borderRadius="lg" />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height="180px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      </Container>
    );
  }

  if (!estaAutenticado) {
    return null;
  }

  return (
    <Container maxW="1200px" py={10}>
      <VStack align="stretch" spacing={8}>
        <Box>
          <Heading size="2xl" mb={2}>
            Comunidad
          </Heading>
          <Text color="foreground.muted" fontSize="lg">
            Conecta con otros invocadores, envía solicitudes de amistad y descubre nuevos aliados.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <StatCard
            title="Amigos en la comunidad"
            value={totalAmigos}
            description="Jugadores con los que ya eres aliado."
            icon={UserCheck}
          />
          <StatCard
            title="Solicitudes pendientes"
            value={totalPendientes}
            description="Responde las solicitudes para sumar nuevos aliados."
            icon={UserPlus}
          />
        </SimpleGrid>

        <Box>
          <Flex align="center" justify="space-between" mb={4}>
            <Heading size="md">Solicitudes recibidas</Heading>
            {totalPendientes > 0 && (
              <Badge colorScheme="yellow" borderRadius="full" px={3} py={1}>
                {totalPendientes} nuevas
              </Badge>
            )}
          </Flex>

          {solicitudes.length === 0 ? (
            <Box
              border="1px dashed"
              borderColor="background.muted"
              p={6}
              borderRadius="lg"
              textAlign="center"
            >
              <Text color="foreground.muted">No tienes solicitudes pendientes por el momento.</Text>
            </Box>
          ) : (
            <Stack spacing={4}>
              {solicitudes.map((solicitud) => (
                <Flex
                  key={solicitud.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  align="center"
                  gap={4}
                  bg="background.card"
                  borderColor="background.muted"
                >
                  <Avatar
                    size="md"
                    name={solicitud.requester.name}
                    src={solicitud.requester.avatar_url ?? undefined}
                  />
                  <Box flex="1">
                    <Text fontWeight="semibold">{solicitud.requester.name}</Text>
                    <Text fontSize="sm" color="foreground.muted">
                      {solicitud.requester.email}
                    </Text>
                    <HStack spacing={2} mt={1}>
                      <Icon as={Clock4} color="foreground.muted" />
                      <Text fontSize="xs" color="foreground.muted">
                        {new Date(solicitud.created_at).toLocaleString()}
                      </Text>
                    </HStack>
                  </Box>
                  <HStack>
                    <Button
                      size="sm"
                      colorScheme="gold"
                      isLoading={processingIds.has(solicitud.id)}
                      onClick={() => manejarAccionSolicitud(solicitud.id, 'accept')}
                    >
                      Aceptar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      isLoading={processingIds.has(solicitud.id)}
                      onClick={() => manejarAccionSolicitud(solicitud.id, 'reject')}
                    >
                      Rechazar
                    </Button>
                  </HStack>
                </Flex>
              ))}
            </Stack>
          )}
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Chats con amigos
          </Heading>
          {amigos.length === 0 ? (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={6}
              borderColor="background.muted"
              textAlign="center"
            >
              <Text color="foreground.muted">Agrega amigos para comenzar a chatear.</Text>
            </Box>
          ) : (
            <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
              <Box
                w={{ base: '100%', md: '280px' }}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                borderColor="background.muted"
                bg="background.card"
              >
                <Text fontWeight="semibold" mb={4}>
                  Tus amigos ({amigos.length})
                </Text>
                <Stack spacing={3}>
                  {amigos.map((friend) => {
                    const seleccionado = friend.id === selectedFriendId;
                    return (
                      <Flex
                        key={friend.id}
                        align="center"
                        gap={3}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={seleccionado ? 'yellow.500' : 'background.muted'}
                        bg={seleccionado ? 'yellow.900' : 'background.card'}
                        cursor="pointer"
                        onClick={() => setSelectedFriendId(friend.id)}
                        position="relative"
                      >
                        <Avatar size="sm" name={friend.name} src={friend.avatar_url ?? undefined} />
                        <Box flex="1" minW={0}>
                          <Text fontWeight="semibold" isTruncated>{friend.name}</Text>
                          <Text fontSize="xs" color="foreground.muted" isTruncated>
                            {friend.email}
                          </Text>
                        </Box>
                        <HStack spacing={1} onClick={(e) => e.stopPropagation()}>
                          <IconButton
                            aria-label="Eliminar amigo"
                            icon={<Icon as={UserX} />}
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => abrirConfirmacionEliminar(friend.id, friend.name)}
                            isLoading={processingIds.has(friend.id)}
                          />
                          <IconButton
                            aria-label="Bloquear usuario"
                            icon={<Icon as={Ban} />}
                            size="xs"
                            colorScheme="orange"
                            variant="ghost"
                            onClick={() => abrirConfirmacionBloquear(friend.id, friend.name)}
                            isLoading={processingIds.has(friend.id)}
                          />
                        </HStack>
                      </Flex>
                    );
                  })}
                </Stack>
              </Box>

              <Box
                flex="1"
                borderWidth="1px"
                borderRadius="lg"
                p={{ base: 3, md: 4 }}
                borderColor="background.muted"
                bg="background.card"
                minH={{ base: '300px', md: '420px' }}
              >
                {amigoSeleccionado ? (
                  <Flex direction="column" h="100%">
                    <Flex justify="space-between" align="center" mb={4}>
                      <Box>
                        <Heading size="sm">Chat con {amigoSeleccionado.name}</Heading>
                        <Text fontSize="sm" color="foreground.muted">
                          {amigoSeleccionado.email}
                        </Text>
                      </Box>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Eliminar amigo"
                          icon={<Icon as={UserX} />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => abrirConfirmacionEliminar(amigoSeleccionado.id, amigoSeleccionado.name)}
                          isLoading={processingIds.has(amigoSeleccionado.id)}
                        />
                        <IconButton
                          aria-label="Bloquear usuario"
                          icon={<Icon as={Ban} />}
                          size="sm"
                          colorScheme="orange"
                          variant="ghost"
                          onClick={() => abrirConfirmacionBloquear(amigoSeleccionado.id, amigoSeleccionado.name)}
                          isLoading={processingIds.has(amigoSeleccionado.id)}
                        />
                      </HStack>
                    </Flex>
                    <Divider mb={4} />
                    <Box flex="1" overflowY="auto" pr={2} mb={4}>
                      {loadingMessages ? (
                        <Flex justify="center" py={10}>
                          <Spinner color="yellow.400" />
                        </Flex>
                      ) : messages.length === 0 ? (
                        <Text color="foreground.muted">Todavía no hay mensajes. ¡Envía el primero!</Text>
                      ) : (
                        <Stack spacing={3}>
                          {messages.map((mensaje) => {
                            const esPropio = mensaje.sender_id === usuario?.id;
                            return (
                              <Flex key={mensaje.id} justify={esPropio ? 'flex-end' : 'flex-start'}>
                                <Box
                                  maxW={{ base: '85%', md: '75%' }}
                                  bg={esPropio ? 'yellow.600' : 'background.muted'}
                                  color={esPropio ? 'black' : 'white'}
                                  px={4}
                                  py={2}
                                  borderRadius="lg"
                                >
                                  <Text wordBreak="break-word">{mensaje.message}</Text>
                                  <Text fontSize="xs" mt={1} color={esPropio ? 'blackAlpha.700' : 'whiteAlpha.700'}>
                                    {new Date(mensaje.created_at).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </Text>
                                </Box>
                              </Flex>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </Stack>
                      )}
                      {messagesError && (
                        <Text color="red.300" mt={4}>
                          {messagesError}
                        </Text>
                      )}
                    </Box>
                    <Divider my={4} />
                    <Stack spacing={3}>
                      <Textarea
                        placeholder="Escribe un mensaje y presiona Enter para enviarlo"
                        value={messageInput}
                        onChange={(event) => setMessageInput(event.target.value)}
                        onKeyDown={manejarKeyDown}
                        resize="none"
                        minH={{ base: '80px', md: '100px' }}
                      />
                      <Button
                        alignSelf="flex-end"
                        colorScheme="yellow"
                        onClick={enviarMensaje}
                        isDisabled={!messageInput.trim()}
                        isLoading={sendingMessage}
                        size={{ base: 'sm', md: 'md' }}
                      >
                        Enviar mensaje
                      </Button>
                    </Stack>
                  </Flex>
                ) : (
                  <Flex h="100%" align="center" justify="center" textAlign="center">
                    <Text color="foreground.muted">
                      Selecciona un amigo de la lista para comenzar a conversar.
                    </Text>
                  </Flex>
                )}
              </Box>
            </Flex>
          )}
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Explora invocadores
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
            {usuarios.map((usuario) => (
              <Box
                key={usuario.id}
                borderWidth="1px"
                borderRadius="lg"
                p={5}
                bg="background.card"
                borderColor="background.muted"
                boxShadow="lg"
              >
                <VStack spacing={3} align="stretch">
                  <HStack spacing={3}>
                    <Avatar name={usuario.name} src={usuario.avatar_url ?? undefined} />
                    <Box>
                      <Text fontWeight="semibold">{usuario.name}</Text>
                      <Text fontSize="sm" color="foreground.muted">
                        {usuario.email}
                      </Text>
                    </Box>
                  </HStack>
                  <Tag colorScheme={estadoConfig[usuario.status].color} w="fit-content">
                    {estadoConfig[usuario.status].label}
                  </Tag>
                  <HStack spacing={2} w="100%">
                    <Button
                      leftIcon={<Icon as={Handshake} />}
                      colorScheme="yellow"
                      isDisabled={usuario.status === 'friend' || usuario.status === 'outgoing'}
                      isLoading={processingIds.has(usuario.id)}
                      onClick={() => enviarSolicitud(usuario.id)}
                      flex="1"
                      size={{ base: 'sm', md: 'md' }}
                    >
                      {usuario.status === 'none'
                        ? 'Enviar solicitud'
                        : usuario.status === 'incoming'
                        ? 'Solicitud recibida'
                        : usuario.status === 'friend'
                        ? 'Ya son amigos'
                        : 'Solicitud enviada'}
                    </Button>
                    <IconButton
                      aria-label="Bloquear usuario"
                      icon={<Icon as={Ban} />}
                      colorScheme="orange"
                      variant="outline"
                      onClick={() => abrirConfirmacionBloquear(usuario.id, usuario.name)}
                      isLoading={processingIds.has(usuario.id)}
                      size={{ base: 'sm', md: 'md' }}
                    />
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
          {usuarios.length === 0 && (
            <Box textAlign="center" mt={8} p={6} borderWidth="1px" borderRadius="lg" borderColor="background.muted">
              <Text color="foreground.muted">Por ahora no hay otros invocadores registrados.</Text>
            </Box>
          )}
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Usuarios bloqueados
          </Heading>
          {usuariosBloqueados.length === 0 ? (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={6}
              borderColor="background.muted"
              textAlign="center"
            >
              <Text color="foreground.muted">No tienes usuarios bloqueados.</Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
              {usuariosBloqueados.map((bloqueado) => (
                <Flex
                  key={bloqueado.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  bg="background.card"
                  borderColor="background.muted"
                  align="center"
                  gap={3}
                >
                  <Avatar size="md" name={bloqueado.user.name} src={bloqueado.user.avatar_url ?? undefined} />
                  <Box flex="1" minW={0}>
                    <Text fontWeight="semibold" isTruncated>{bloqueado.user.name}</Text>
                    <Text fontSize="sm" color="foreground.muted" isTruncated>
                      {bloqueado.user.email}
                    </Text>
                  </Box>
                  <IconButton
                    aria-label="Desbloquear usuario"
                    icon={<Icon as={X} />}
                    size="sm"
                    colorScheme="green"
                    variant="ghost"
                    onClick={() => desbloquearUsuario(bloqueado.user.id)}
                    isLoading={processingIds.has(bloqueado.user.id)}
                  />
                </Flex>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, userId: null })}
        onConfirm={manejarConfirmacion}
        title={
          confirmModal.type === 'delete'
            ? '¿Eliminar amigo?'
            : confirmModal.type === 'block'
            ? '¿Bloquear usuario?'
            : ''
        }
        message={
          confirmModal.type === 'delete'
            ? `¿Estás seguro de que quieres eliminar a ${confirmModal.userName || 'este amigo'}? Esta acción no se puede deshacer.`
            : confirmModal.type === 'block'
            ? `¿Estás seguro de que quieres bloquear a ${confirmModal.userName || 'este usuario'}? No podrás recibir solicitudes de amistad de él y se eliminará la amistad si existe.`
            : ''
        }
        confirmText={confirmModal.type === 'delete' ? 'Eliminar' : confirmModal.type === 'block' ? 'Bloquear' : 'Confirmar'}
        cancelText="Cancelar"
        confirmColorScheme={confirmModal.type === 'delete' ? 'red' : 'orange'}
        isLoading={confirmModal.userId ? processingIds.has(confirmModal.userId) : false}
      />
    </Container>
  );
};

const StatCard: React.FC<{
  title: string;
  value: number;
  description: string;
  icon: typeof UsersRound;
}> = ({ title, value, description, icon }) => {
  return (
    <Flex
      borderWidth="1px"
      borderRadius="xl"
      p={6}
      align="center"
      gap={4}
      bg="background.card"
      borderColor="background.muted"
      boxShadow="lg"
    >
      <IconButton aria-label={title} icon={<Icon as={icon} />} variant="ghost" colorScheme="yellow" />
      <Box>
        <Heading size="lg">{value}</Heading>
        <Text fontWeight="semibold">{title}</Text>
        <Text fontSize="sm" color="foreground.muted">
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

export default Community;


