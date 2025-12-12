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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  Image,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Handshake, UsersRound, UserPlus, UserCheck, Clock4, UserX, Ban, X, Users, MessageSquare, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DATA_DRAGON_BASE } from '../config';
import axios from 'axios';
import {
  communityService,
} from '../services/communityService';
import ConfirmModal from '../components/ConfirmModal';

const estadoConfig = {
  none: { label: 'Agregar amigo', color: 'gold' },
  outgoing: { label: 'Solicitud enviada', color: 'blue' },
  incoming: { label: 'Solicitud pendiente', color: 'purple' },
  friend: { label: 'Amigos', color: 'green' },
};

const Community = () => {
  const { estaAutenticado, cargando, usuario } = useAuth();
  const navegar = useNavigate();
  const toast = useToast();

  const [usuarios, setUsuarios] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [usuariosBloqueados, setUsuariosBloqueados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    userId: null,
  });

  // Estados para equipos ideales
  const [miEquipo, setMiEquipo] = useState(null);
  const [equiposAmigos, setEquiposAmigos] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const equipoModal = useDisclosure();
  const [equipoNombre, setEquipoNombre] = useState('');
  const [equipoCampeones, setEquipoCampeones] = useState([]);
  const [equipoDescripcion, setEquipoDescripcion] = useState('');
  const [savingEquipo, setSavingEquipo] = useState(false);
  const [comentarioInput, setComentarioInput] = useState({});
  const [sendingComment, setSendingComment] = useState(new Set());
  const [comentariosVisibles, setComentariosVisibles] = useState({});
  const [cargandoMasComentarios, setCargandoMasComentarios] = useState(new Set());
  const [totalComentarios, setTotalComentarios] = useState({});
  
  // Estados para selector de campeones
  const [champions, setChampions] = useState([]);
  const [loadingChampions, setLoadingChampions] = useState(false);
  const [championSearchTerm, setChampionSearchTerm] = useState('');

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

  const cargarEquipos = async () => {
    try {
      setLoadingEquipos(true);
      const [miEquipoResp, equiposAmigosResp] = await Promise.all([
        communityService.obtenerEquipoIdeal(),
        communityService.obtenerEquiposAmigos(),
      ]);
      setMiEquipo(miEquipoResp);
      setEquiposAmigos(equiposAmigosResp);
      
      // Inicializar comentarios visibles (5 por defecto) y totales
      const nuevosComentariosVisibles = {};
      const nuevosTotales = {};
      
      // Inicializar para mi equipo
      if (miEquipoResp) {
        const comentarios = Array.isArray(miEquipoResp.comentarios) ? miEquipoResp.comentarios : [];
        const comentariosCount = comentarios.length;
        const totalCount = miEquipoResp.total_comentarios || comentariosCount;
        nuevosComentariosVisibles[miEquipoResp.id] = Math.min(5, comentariosCount);
        nuevosTotales[miEquipoResp.id] = totalCount;
      }
      
      // Inicializar para equipos de amigos
      equiposAmigosResp.forEach((equipo) => {
        // Asegurar que comentarios sea un array
        const comentarios = Array.isArray(equipo.comentarios) ? equipo.comentarios : [];
        const comentariosCount = comentarios.length;
        const totalCount = equipo.total_comentarios || comentariosCount;
        // Mostrar todos los comentarios disponibles inicialmente (hasta 5)
        nuevosComentariosVisibles[equipo.id] = Math.min(5, comentariosCount);
        nuevosTotales[equipo.id] = totalCount;
        // Debug: verificar que los comentarios se están cargando
        if (comentariosCount > 0) {
          console.log(`Equipo ${equipo.id} (${equipo.nombre}): ${comentariosCount} comentarios cargados, total: ${totalCount}`);
        }
      });
      setComentariosVisibles(nuevosComentariosVisibles);
      setTotalComentarios(nuevosTotales);
    } catch (error) {
      console.error('Error cargando equipos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los equipos ideales',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingEquipos(false);
    }
  };

  const cargarMasComentarios = async (teamId) => {
    try {
      setCargandoMasComentarios((prev) => new Set(prev).add(teamId));
      const comentariosActuales = comentariosVisibles[teamId] || 5;
      const siguientePagina = Math.floor(comentariosActuales / 5) + 1;
      
      console.log(`Cargando más comentarios para equipo ${teamId}, página ${siguientePagina}, comentarios actuales: ${comentariosActuales}`);
      
      const respuesta = await communityService.obtenerComentarios(teamId, siguientePagina, 5);
      
      console.log(`Respuesta recibida:`, respuesta);
      console.log(`Total comentarios: ${respuesta.total}, Comentarios en respuesta: ${respuesta.comments.length}`);
      
      if (!respuesta.comments || respuesta.comments.length === 0) {
        toast({
          title: 'Sin más comentarios',
          description: 'No hay más comentarios para cargar',
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      
      // Verificar si ya tenemos todos los comentarios cargados
      const equipoActual = equiposAmigos.find(e => e.id === teamId) || (miEquipo?.id === teamId ? miEquipo : null);
      if (equipoActual) {
        const comentariosCargados = Array.isArray(equipoActual.comentarios) ? equipoActual.comentarios.length : 0;
        console.log(`Comentarios ya cargados: ${comentariosCargados}, Total: ${respuesta.total}`);
        if (comentariosCargados >= respuesta.total) {
          toast({
            title: 'Todos los comentarios cargados',
            description: 'Ya se están mostrando todos los comentarios',
            status: 'info',
            duration: 2000,
            isClosable: true,
          });
          return;
        }
      }
      
      // Actualizar el equipo con los nuevos comentarios
      setEquiposAmigos((prev) =>
        prev.map((equipo) => {
          if (equipo.id === teamId) {
            // Combinar comentarios existentes con los nuevos (evitar duplicados)
            const comentariosExistentes = Array.isArray(equipo.comentarios) ? equipo.comentarios : [];
            const idsExistentes = new Set(comentariosExistentes.map((c) => c.id));
            const nuevosComentarios = respuesta.comments.filter((c) => !idsExistentes.has(c.id));
            console.log(`Equipo ${teamId}: ${comentariosExistentes.length} comentarios existentes, ${nuevosComentarios.length} nuevos`);
            return {
              ...equipo,
              comentarios: [...comentariosExistentes, ...nuevosComentarios],
            };
          }
          return equipo;
        })
      );
      
      // También actualizar mi equipo si es el mismo
      setMiEquipo((prev) => {
        if (prev && prev.id === teamId) {
          const comentariosExistentes = Array.isArray(prev.comentarios) ? prev.comentarios : [];
          const idsExistentes = new Set(comentariosExistentes.map((c) => c.id));
          const nuevosComentarios = respuesta.comments.filter((c) => !idsExistentes.has(c.id));
          console.log(`Mi equipo ${teamId}: ${comentariosExistentes.length} comentarios existentes, ${nuevosComentarios.length} nuevos`);
          return {
            ...prev,
            comentarios: [...comentariosExistentes, ...nuevosComentarios],
          };
        }
        return prev;
      });
      
      // Actualizar contadores
      setComentariosVisibles((prev) => ({
        ...prev,
        [teamId]: comentariosActuales + respuesta.comments.length,
      }));
      setTotalComentarios((prev) => ({
        ...prev,
        [teamId]: respuesta.total,
      }));
    } catch (error) {
      console.error('Error cargando más comentarios:', error);
      const message = error?.response?.data?.message || 'No se pudieron cargar más comentarios';
      toast({ title: 'Error', description: message, status: 'error', duration: 3000, isClosable: true });
    } finally {
      setCargandoMasComentarios((prev) => {
        const next = new Set(prev);
        next.delete(teamId);
        return next;
      });
    }
  };

  const verMenosComentarios = (teamId) => {
    setComentariosVisibles((prev) => ({
      ...prev,
      [teamId]: 5,
    }));
  };

  const eliminarComentario = async (commentId, teamId) => {
    try {
      await communityService.eliminarComentario(commentId);
      
      // Actualizar equipos de amigos
      setEquiposAmigos((prev) =>
        prev.map((equipo) => {
          if (equipo.id === teamId) {
            return {
              ...equipo,
              comentarios: equipo.comentarios.filter((c) => c.id !== commentId),
            };
          }
          return equipo;
        })
      );
      
      // Actualizar mi equipo si es el mismo
      setMiEquipo((prev) => {
        if (prev && prev.id === teamId) {
          return {
            ...prev,
            comentarios: (prev.comentarios || []).filter((c) => c.id !== commentId),
          };
        }
        return prev;
      });
      
      // Actualizar contadores
      setTotalComentarios((prev) => ({
        ...prev,
        [teamId]: Math.max(0, (prev[teamId] || 0) - 1),
      }));
      
      // Ajustar comentarios visibles si es necesario
      setComentariosVisibles((prev) => {
        const actuales = prev[teamId] || 5;
        return {
          ...prev,
          [teamId]: Math.max(5, actuales - 1),
        };
      });
      
      toast({
        title: 'Comentario eliminado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo eliminar el comentario';
      toast({ title: 'Error', description: message, status: 'error', duration: 3000, isClosable: true });
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
    cargarEquipos();
  }, [estaAutenticado, cargando]);

  const actualizarEstadoUsuario = (userId, estado) => {
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

  const manejarAccionSolicitud = async (id, accion) => {
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
      // Recargar equipos cuando se acepta una solicitud (nuevo amigo puede tener equipo)
      if (accion === 'accept') {
        await cargarEquipos();
      }
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

  const enviarSolicitud = async (userId) => {
    setProcessingIds((prev) => new Set(prev).add(userId));
    try {
      await communityService.enviarSolicitud(userId);
      actualizarEstadoUsuario(userId, 'outgoing');
      toast({ title: 'Solicitud enviada', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
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
    async (friendId, opciones) => {
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
    if (messagesContainerRef.current && messagesEndRef.current) {
      const contenedor = messagesContainerRef.current;
      const estaCercaDelFinal = contenedor.scrollHeight - contenedor.scrollTop - contenedor.clientHeight < 100;
      
      if (estaCercaDelFinal) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
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
      
      setTimeout(() => {
        if (messagesContainerRef.current && messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } catch (error) {
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

  const manejarKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      enviarMensaje();
    }
  };

  const abrirConfirmacionEliminar = (friendId, friendName) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      userId: friendId,
      userName: friendName,
    });
  };

  const abrirConfirmacionBloquear = (userId, userName) => {
    setConfirmModal({
      isOpen: true,
      type: 'block',
      userId,
      userName,
    });
  };

  const eliminarAmigo = async (friendId) => {
    setProcessingIds((prev) => new Set(prev).add(friendId));
    try {
      await communityService.eliminarAmigo(friendId);
      actualizarEstadoUsuario(friendId, 'none');
      if (selectedFriendId === friendId) {
        setSelectedFriendId(null);
        setMessages([]);
      }
      toast({ title: 'Amigo eliminado', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
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

  const bloquearUsuario = async (userId) => {
    setProcessingIds((prev) => new Set(prev).add(userId));
    try {
      await communityService.bloquearUsuario(userId);
      await cargarDatos();
      if (selectedFriendId === userId) {
        setSelectedFriendId(null);
        setMessages([]);
      }
      toast({ title: 'Usuario bloqueado', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
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

  const desbloquearUsuario = async (blockedUserId) => {
    setProcessingIds((prev) => new Set(prev).add(blockedUserId));
    try {
      await communityService.desbloquearUsuario(blockedUserId);
      setUsuariosBloqueados((prev) => prev.filter((u) => u.user.id !== blockedUserId));
      toast({ title: 'Usuario desbloqueado', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
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

  const abrirModalEquipo = async () => {
    if (miEquipo) {
      setEquipoNombre(miEquipo.nombre);
      setEquipoCampeones(miEquipo.campeones);
      setEquipoDescripcion(miEquipo.descripcion || '');
    } else {
      setEquipoNombre('');
      setEquipoCampeones([]);
      setEquipoDescripcion('');
    }
    
    // Cargar campeones si no están cargados
    if (champions.length === 0) {
      setLoadingChampions(true);
      try {
        const response = await axios.get(`${DATA_DRAGON_BASE}/data/es_ES/champion.json`);
        const championsData = Object.values(response.data?.data || {});
        setChampions(championsData);
      } catch (error) {
        console.error('Error cargando campeones:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los campeones',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoadingChampions(false);
      }
    }
    
    equipoModal.onOpen();
  };

  const toggleCampeon = (championId) => {
    if (equipoCampeones.includes(championId)) {
      setEquipoCampeones(equipoCampeones.filter((id) => id !== championId));
    } else {
      if (equipoCampeones.length < 5) {
        setEquipoCampeones([...equipoCampeones, championId]);
      } else {
        toast({
          title: 'Límite alcanzado',
          description: 'Solo puedes seleccionar hasta 5 campeones',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const filteredChampions = useMemo(() => {
    if (!championSearchTerm.trim()) {
      return champions;
    }
    const search = championSearchTerm.toLowerCase();
    return champions.filter(
      (champion) =>
        champion.name.toLowerCase().includes(search) ||
        champion.id.toLowerCase().includes(search) ||
        champion.title.toLowerCase().includes(search)
    );
  }, [champions, championSearchTerm]);

  const guardarEquipo = async () => {
    if (!equipoNombre.trim() || equipoCampeones.length === 0) {
      toast({
        title: 'Error',
        description: 'El nombre y al menos un campeón son requeridos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (equipoCampeones.length > 5) {
      toast({
        title: 'Error',
        description: 'Máximo 5 campeones permitidos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setSavingEquipo(true);
      const equipo = await communityService.guardarEquipoIdeal({
        nombre: equipoNombre,
        campeones: equipoCampeones,
        descripcion: equipoDescripcion || undefined,
      });
      setMiEquipo(equipo);
      equipoModal.onClose();
      toast({
        title: 'Equipo guardado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      cargarEquipos();
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo guardar el equipo';
      toast({ title: 'Error', description: message, status: 'error', duration: 3000, isClosable: true });
    } finally {
      setSavingEquipo(false);
    }
  };

  const eliminarEquipo = async () => {
    try {
      await communityService.eliminarEquipoIdeal();
      setMiEquipo(null);
      toast({
        title: 'Equipo eliminado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Recargar equipos para actualizar la vista
      await cargarEquipos();
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo eliminar el equipo';
      toast({ title: 'Error', description: message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  const agregarComentario = async (teamId) => {
    const comentario = comentarioInput[teamId]?.trim();
    if (!comentario) return;

    try {
      setSendingComment((prev) => new Set(prev).add(teamId));
      const nuevoComentario = await communityService.agregarComentario(teamId, comentario);
      // Actualizar el equipo en la lista con el nuevo comentario
      setEquiposAmigos((prev) =>
        prev.map((equipo) => {
          if (equipo.id === teamId) {
            // Agregar el nuevo comentario al inicio (más reciente primero)
            return { ...equipo, comentarios: [nuevoComentario, ...equipo.comentarios] };
          }
          return equipo;
        })
      );
      // También actualizar mi equipo si es el mismo
      setMiEquipo((prev) => {
        if (prev && prev.id === teamId) {
          return {
            ...prev,
            comentarios: [nuevoComentario, ...(prev.comentarios || [])],
          };
        }
        return prev;
      });
      // Actualizar contadores
      setTotalComentarios((prev) => ({
        ...prev,
        [teamId]: (prev[teamId] || 0) + 1,
      }));
      // Si no se están mostrando todos los comentarios, aumentar el contador visible
      setComentariosVisibles((prev) => ({
        ...prev,
        [teamId]: Math.min((prev[teamId] || 5) + 1, (totalComentarios[teamId] || 0) + 1),
      }));
      setComentarioInput((prev) => ({ ...prev, [teamId]: '' }));
      toast({
        title: 'Comentario agregado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      // Recargar equipos para asegurar sincronización
      await cargarEquipos();
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo agregar el comentario';
      toast({ title: 'Error', description: message, status: 'error', duration: 3000, isClosable: true });
    } finally {
      setSendingComment((prev) => {
        const next = new Set(prev);
        next.delete(teamId);
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
                    <Box 
                      ref={messagesContainerRef}
                      flex="1" 
                      overflowY="auto" 
                      pr={2} 
                      mb={4}
                      style={{ scrollBehavior: 'smooth' }}
                    >
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
                  <Tag 
                    colorScheme={estadoConfig[usuario.status].color} 
                    w="fit-content"
                    _hover={{
                      opacity: 0.9,
                      transform: 'scale(1.02)',
                    }}
                    transition="all 0.2s"
                  >
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
                      _disabled={{
                        opacity: 0.6,
                        cursor: 'not-allowed',
                        _hover: {
                          opacity: 0.6,
                          bg: 'gray.600',
                        },
                      }}
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

        {/* Sección de Equipos Ideales */}
        <Box>
          <Flex align="center" justify="space-between" mb={4}>
            <Flex align="center" gap={2}>
              <Icon as={Users} color="gold.200" />
              <Heading size="md">Equipos Ideales</Heading>
            </Flex>
            <Button
              leftIcon={<Icon as={miEquipo ? Edit : Plus} />}
              colorScheme="yellow"
              size="sm"
              onClick={abrirModalEquipo}
            >
              {miEquipo ? 'Editar mi equipo' : 'Crear mi equipo'}
            </Button>
          </Flex>

          {/* Mi Equipo Ideal */}
          {loadingEquipos ? (
            <Skeleton height="200px" borderRadius="lg" />
          ) : miEquipo ? (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={6}
              bg="background.card"
              borderColor="background.muted"
              mb={6}
            >
              <Flex justify="space-between" align="start" mb={4}>
                <Box>
                  <Heading size="md" mb={2}>
                    {miEquipo.nombre}
                  </Heading>
                  {miEquipo.descripcion && (
                    <Text color="foreground.muted" fontSize="sm">
                      {miEquipo.descripcion}
                    </Text>
                  )}
                </Box>
                <IconButton
                  aria-label="Eliminar equipo"
                  icon={<Icon as={Trash2} />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={eliminarEquipo}
                />
              </Flex>
              <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={4}>
                {miEquipo.campeones.map((championId) => (
                  <Box
                    key={championId}
                    textAlign="center"
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor="background.muted"
                  >
                    <Image
                      src={`${DATA_DRAGON_BASE}/img/champion/${championId}.png`}
                      alt={championId}
                      boxSize="64px"
                      mx="auto"
                      mb={2}
                      borderRadius="md"
                    />
                    <Text fontSize="xs" fontWeight="semibold" noOfLines={1}>
                      {championId}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>

              {/* Comentarios en mi equipo */}
              {miEquipo && (
                <>
                  <Divider my={4} />
                  <VStack spacing={3} align="stretch">
                    <HStack>
                      <Icon as={MessageSquare} color="foreground.muted" />
                      <Text fontWeight="semibold" fontSize="sm">
                        Comentarios ({totalComentarios[miEquipo.id] || miEquipo.comentarios?.length || 0})
                      </Text>
                    </HStack>
                    
                    {/* Mostrar solo los comentarios visibles */}
                    {miEquipo.comentarios && miEquipo.comentarios.length > 0 ? (
                      <>
                        {miEquipo.comentarios
                          .slice(0, comentariosVisibles[miEquipo.id] || 5)
                          .map((comentario) => {
                            // El dueño del equipo puede eliminar cualquier comentario
                            const puedeEliminar = usuario?.id === miEquipo.usuario.id;
                            return (
                              <Flex key={comentario.id} gap={3} align="start">
                                <Avatar
                                  size="xs"
                                  name={comentario.usuario.name}
                                  src={comentario.usuario.avatar_url ?? undefined}
                                />
                                <Box flex="1">
                                  <Flex justify="space-between" align="start" mb={1}>
                                    <HStack>
                                      <Text fontSize="xs" fontWeight="semibold">
                                        {comentario.usuario.name}
                                      </Text>
                                      <Text fontSize="xs" color="foreground.muted">
                                        {new Date(comentario.created_at).toLocaleDateString()}
                                      </Text>
                                    </HStack>
                                    {puedeEliminar && (
                                      <IconButton
                                        aria-label="Eliminar comentario"
                                        icon={<Icon as={Trash2} />}
                                        size="xs"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => eliminarComentario(comentario.id, miEquipo.id)}
                                      />
                                    )}
                                  </Flex>
                                  <Text fontSize="sm" color="foreground.primary">
                                    {comentario.comentario}
                                  </Text>
                                </Box>
                              </Flex>
                            );
                          })}
                        
                        {/* Botones Ver más / Ver menos comentarios */}
                        <HStack spacing={2}>
                          {(comentariosVisibles[miEquipo.id] || 5) < (totalComentarios[miEquipo.id] || miEquipo.comentarios.length) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              colorScheme="yellow"
                              onClick={() => cargarMasComentarios(miEquipo.id)}
                              isLoading={cargandoMasComentarios.has(miEquipo.id)}
                              leftIcon={<Icon as={MessageSquare} />}
                            >
                              Ver más comentarios (
                              {(totalComentarios[miEquipo.id] || miEquipo.comentarios.length) - (comentariosVisibles[miEquipo.id] || 5)} restantes)
                            </Button>
                          )}
                          {(comentariosVisibles[miEquipo.id] || 5) > 5 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              colorScheme="gray"
                              onClick={() => verMenosComentarios(miEquipo.id)}
                            >
                              Ver menos
                            </Button>
                          )}
                        </HStack>
                      </>
                    ) : (
                      <Text fontSize="sm" color="foreground.muted" fontStyle="italic">
                        Aún no hay comentarios en este equipo. ¡Anima a tus amigos a comentar!
                      </Text>
                    )}
                    
                    {/* El dueño no puede comentar en su propio equipo */}
                    <Text fontSize="xs" color="foreground.muted" fontStyle="italic" textAlign="center" pt={2}>
                      Solo tus amigos pueden comentar en tu equipo ideal
                    </Text>
                  </VStack>
                </>
              )}
            </Box>
          ) : (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={6}
              borderColor="background.muted"
              textAlign="center"
              bg="background.card"
            >
              <Text color="foreground.muted">
                Crea tu equipo ideal para que tus amigos puedan verlo y comentar sobre él.
              </Text>
            </Box>
          )}

          {/* Equipos de Amigos */}
          {loadingEquipos ? (
            <Box mt={6}>
              <Skeleton height="200px" borderRadius="lg" />
            </Box>
          ) : equiposAmigos.length > 0 ? (
            <Box mt={6}>
              <Flex align="center" gap={2} mb={4}>
                <Icon as={Users} color="gold.200" />
                <Heading size="md">
                  Equipos de tus amigos ({equiposAmigos.length})
                </Heading>
              </Flex>
              <VStack spacing={4} align="stretch">
                {equiposAmigos.map((equipo) => (
                  <Box
                    key={equipo.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={5}
                    bg="background.card"
                    borderColor="background.muted"
                  >
                    <Flex align="center" justify="space-between" mb={4}>
                      <Flex align="center" gap={3}>
                        <Avatar
                          size="md"
                          name={equipo.usuario.name}
                          src={equipo.usuario.avatar_url ?? undefined}
                        />
                        <Box>
                          <Text fontWeight="semibold" fontSize="lg">
                            {equipo.usuario.name}
                          </Text>
                          <Text fontSize="sm" color="foreground.muted">
                            {equipo.nombre}
                          </Text>
                        </Box>
                      </Flex>
                      <Badge colorScheme="yellow" px={3} py={1} borderRadius="full">
                        Equipo Ideal
                      </Badge>
                    </Flex>
                    {equipo.descripcion && (
                      <Text fontSize="sm" color="foreground.muted" mb={4}>
                        {equipo.descripcion}
                      </Text>
                    )}
                    <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={3} mb={4}>
                      {equipo.campeones.map((championId) => (
                        <Box
                          key={championId}
                          textAlign="center"
                          p={2}
                          borderWidth="1px"
                          borderRadius="md"
                          borderColor="background.muted"
                        >
                          <Image
                            src={`${DATA_DRAGON_BASE}/img/champion/${championId}.png`}
                            alt={championId}
                            boxSize="48px"
                            mx="auto"
                            mb={1}
                            borderRadius="md"
                          />
                          <Text fontSize="xs" noOfLines={1}>
                            {championId}
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>

                    {/* Comentarios */}
                    <Divider my={4} />
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Icon as={MessageSquare} color="foreground.muted" />
                        <Text fontWeight="semibold" fontSize="sm">
                          Comentarios ({totalComentarios[equipo.id] || equipo.comentarios.length})
                        </Text>
                      </HStack>
                      
                      {/* Mostrar solo los comentarios visibles */}
                      {equipo.comentarios && equipo.comentarios.length > 0 ? (
                        <>
                          {equipo.comentarios
                            .slice(0, comentariosVisibles[equipo.id] || 5)
                            .map((comentario) => {
                              // El autor puede eliminar su comentario O el dueño del equipo puede eliminar cualquier comentario
                              const puedeEliminar = usuario?.id === comentario.usuario.id || usuario?.id === equipo.usuario.id;
                              return (
                                <Flex key={comentario.id} gap={3} align="start">
                                  <Avatar
                                    size="xs"
                                    name={comentario.usuario.name}
                                    src={comentario.usuario.avatar_url ?? undefined}
                                  />
                                  <Box flex="1">
                                    <Flex justify="space-between" align="start" mb={1}>
                                      <HStack>
                                        <Text fontSize="xs" fontWeight="semibold">
                                          {comentario.usuario.name}
                                        </Text>
                                        <Text fontSize="xs" color="foreground.muted">
                                          {new Date(comentario.created_at).toLocaleDateString()}
                                        </Text>
                                      </HStack>
                                      {puedeEliminar && (
                                        <IconButton
                                          aria-label="Eliminar comentario"
                                          icon={<Icon as={Trash2} />}
                                          size="xs"
                                          variant="ghost"
                                          colorScheme="red"
                                          onClick={() => eliminarComentario(comentario.id, equipo.id)}
                                        />
                                      )}
                                    </Flex>
                                    <Text fontSize="sm" color="foreground.primary">
                                      {comentario.comentario}
                                    </Text>
                                  </Box>
                                </Flex>
                              );
                            })}
                          
                          {/* Botones Ver más / Ver menos comentarios */}
                          <HStack spacing={2}>
                            {(comentariosVisibles[equipo.id] || 5) < (totalComentarios[equipo.id] || equipo.comentarios.length) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                colorScheme="yellow"
                                onClick={() => cargarMasComentarios(equipo.id)}
                                isLoading={cargandoMasComentarios.has(equipo.id)}
                                leftIcon={<Icon as={MessageSquare} />}
                              >
                                Ver más comentarios (
                                {(totalComentarios[equipo.id] || equipo.comentarios.length) - (comentariosVisibles[equipo.id] || 5)} restantes)
                              </Button>
                            )}
                            {(comentariosVisibles[equipo.id] || 5) > 5 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                colorScheme="gray"
                                onClick={() => verMenosComentarios(equipo.id)}
                              >
                                Ver menos
                              </Button>
                            )}
                          </HStack>
                        </>
                      ) : (
                        <Text fontSize="sm" color="foreground.muted" fontStyle="italic">
                          Aún no hay comentarios en este equipo. ¡Sé el primero en comentar!
                        </Text>
                      )}
                      
                      <HStack>
                        <Input
                          placeholder="Escribe un comentario..."
                          value={comentarioInput[equipo.id] || ''}
                          onChange={(e) =>
                            setComentarioInput((prev) => ({
                              ...prev,
                              [equipo.id]: e.target.value,
                            }))
                          }
                          size="sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              agregarComentario(equipo.id);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          colorScheme="yellow"
                          onClick={() => agregarComentario(equipo.id)}
                          isLoading={sendingComment.has(equipo.id)}
                          isDisabled={!comentarioInput[equipo.id]?.trim()}
                        >
                          Enviar
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          ) : (
            <Box mt={6}>
              <Flex align="center" gap={2} mb={4}>
                <Icon as={Users} color="gold.200" />
                <Heading size="md">Equipos de tus amigos</Heading>
              </Flex>
              <Box
                borderWidth="1px"
                borderRadius="lg"
                p={6}
                borderColor="background.muted"
                textAlign="center"
                bg="background.card"
              >
                <Text color="foreground.muted">
                  Tus amigos aún no han creado equipos ideales. ¡Anímales a crear el suyo!
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      </VStack>

      {/* Modal para crear/editar equipo */}
      <Modal isOpen={equipoModal.isOpen} onClose={equipoModal.onClose} size="4xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {miEquipo ? 'Editar Equipo Ideal' : 'Crear Equipo Ideal'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Nombre del equipo</FormLabel>
                <Input
                  value={equipoNombre}
                  onChange={(e) => setEquipoNombre(e.target.value)}
                  placeholder="Ej: Mi equipo de ranked"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  value={equipoDescripcion}
                  onChange={(e) => setEquipoDescripcion(e.target.value)}
                  placeholder="Describe tu estrategia o composición..."
                  rows={3}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>
                  Campeones ({equipoCampeones.length}/5)
                </FormLabel>
                <Text fontSize="sm" color="foreground.muted" mb={2}>
                  Selecciona hasta 5 campeones haciendo clic en ellos
                </Text>
                
                {/* Campo de búsqueda */}
                <InputGroup mb={3}>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={Search} color="foreground.muted" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar campeón por nombre..."
                    value={championSearchTerm}
                    onChange={(e) => setChampionSearchTerm(e.target.value)}
                    mb={3}
                  />
                </InputGroup>

                {/* Grid de campeones */}
                {loadingChampions ? (
                  <Flex justify="center" py={8}>
                    <Spinner color="yellow.400" />
                  </Flex>
                ) : (
                  <Box
                    maxH="400px"
                    overflowY="auto"
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor="background.muted"
                    p={3}
                    bg="background.secondary"
                  >
                    <SimpleGrid columns={{ base: 4, sm: 5, md: 6 }} spacing={2}>
                      {filteredChampions.map((champion) => {
                        const estaSeleccionado = equipoCampeones.includes(champion.id);
                        const puedeSeleccionar = equipoCampeones.length < 5 || estaSeleccionado;
                        
                        return (
                          <Box
                            key={champion.id}
                            position="relative"
                            cursor={puedeSeleccionar ? 'pointer' : 'not-allowed'}
                            opacity={puedeSeleccionar ? 1 : 0.5}
                            onClick={() => puedeSeleccionar && toggleCampeon(champion.id)}
                            borderWidth="2px"
                            borderRadius="md"
                            borderColor={estaSeleccionado ? 'gold.400' : 'background.muted'}
                            bg={estaSeleccionado ? 'yellow.900' : 'background.card'}
                            p={2}
                            transition="all 0.2s"
                            _hover={
                              puedeSeleccionar
                                ? {
                                    borderColor: estaSeleccionado ? 'gold.300' : 'gold.200',
                                    transform: 'scale(1.05)',
                                    boxShadow: 'md',
                                  }
                                : {}
                            }
                          >
                            <Image
                              src={`${DATA_DRAGON_BASE}/img/champion/${champion.image?.full || 'default.png'}`}
                              alt={champion.name}
                              boxSize="48px"
                              mx="auto"
                              mb={1}
                              borderRadius="md"
                            />
                            <Text
                              fontSize="xs"
                              fontWeight="semibold"
                              textAlign="center"
                              noOfLines={1}
                              color={estaSeleccionado ? 'gold.200' : 'foreground.primary'}
                            >
                              {champion.name}
                            </Text>
                            {estaSeleccionado && (
                              <Badge
                                position="absolute"
                                top={1}
                                right={1}
                                colorScheme="yellow"
                                borderRadius="full"
                                fontSize="xs"
                                minW="20px"
                                h="20px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                ✓
                              </Badge>
                            )}
                          </Box>
                        );
                      })}
                    </SimpleGrid>
                    {filteredChampions.length === 0 && (
                      <Text textAlign="center" color="foreground.muted" py={4}>
                        No se encontraron campeones
                      </Text>
                    )}
                  </Box>
                )}

                {/* Campeones seleccionados */}
                {equipoCampeones.length > 0 && (
                  <Box mt={3}>
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                      Campeones seleccionados:
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {equipoCampeones.map((championId) => {
                        const champion = champions.find((c) => c.id === championId);
                        return (
                          <Badge
                            key={championId}
                            colorScheme="yellow"
                            px={2}
                            py={1}
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            {champion?.name || championId}
                            <IconButton
                              aria-label="Quitar campeón"
                              icon={<Icon as={X} />}
                              size="xs"
                              variant="ghost"
                              colorScheme="yellow"
                              onClick={() => toggleCampeon(championId)}
                              h="16px"
                              minW="16px"
                            />
                          </Badge>
                        );
                      })}
                    </HStack>
                  </Box>
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={equipoModal.onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="yellow"
              onClick={guardarEquipo}
              isLoading={savingEquipo}
              isDisabled={!equipoNombre.trim() || equipoCampeones.length === 0}
            >
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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

const StatCard = ({ title, value, description, icon }) => {
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


