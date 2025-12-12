import React from 'react'
import { Box, Spinner, VStack, Text } from '@chakra-ui/react'

const Loading = ({ message = 'Cargando...', size = 'xl' }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
      <VStack spacing={4}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size={size} />
        <Text color="gray.500">{message}</Text>
      </VStack>
    </Box>
  )
}

export default Loading

