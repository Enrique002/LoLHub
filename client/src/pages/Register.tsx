import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import RegisterForm from '../components/RegisterForm';

const Register: React.FC = () => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  return (
    <Box minH="100vh" bg={bg} py={10} transition="background-color 0.2s">
      <RegisterForm />
    </Box>
  );
};

export default Register;


