'use strict';

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { suggestionService } from '../services/suggestionService';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || message.trim().length < 10) {
      toast({
        title: 'Error',
        description: 'El mensaje debe tener al menos 10 caracteres',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      await suggestionService.enviarSugerencia({
        name: name.trim() || undefined,
        message: message.trim(),
      });
      toast({
        title: 'Sugerencia enviada',
        description: '¡Gracias por tu feedback!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setName('');
      setMessage('');
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'No se pudo enviar la sugerencia';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }} isCentered>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Sugerencias</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nombre (opcional)</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  maxLength={255}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Sugerencia</FormLabel>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tus sugerencias para mejorar la página..."
                  minH="200px"
                  maxLength={5000}
                  resize="vertical"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="yellow" type="submit" isLoading={loading}>
              Enviar sugerencia
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default SuggestionModal;

