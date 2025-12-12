'use strict';

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';

const ModalVideoHabilidad = ({
  estaAbierto,
  onCerrar,
  urlVideo,
  nombreHabilidad,
}) => {
  const fondoModal = useColorModeValue('white', 'gray.800');

  return (
    <Modal isOpen={estaAbierto} onClose={onCerrar} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent bg={fondoModal}>
        <ModalHeader color={useColorModeValue('gray.800', 'white')}>
          {nombreHabilidad}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box
            position="relative"
            width="100%"
            paddingBottom="56.25%" 
            borderRadius="md"
            overflow="hidden"
            bg="black"
          >
            <Box
              as="video"
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              controls
              autoPlay
              src={urlVideo}
              style={{
                objectFit: 'contain',
              }}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalVideoHabilidad;

