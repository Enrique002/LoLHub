'use strict';

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColorScheme = 'red',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: 'sm', md: 'md' }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack spacing={2} align="center">
            <Icon as={AlertTriangle} color={`${confirmColorScheme}.500`} boxSize={8} />
            <Text>{title}</Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text textAlign="center" color="foreground.muted">
            {message}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            colorScheme={confirmColorScheme}
            onClick={handleConfirm}
            isLoading={isLoading}
            loadingText="Procesando..."
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;

