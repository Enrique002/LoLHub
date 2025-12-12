import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import RegisterForm from '../components/RegisterForm';
import heroBanner from '../assets/hero-banner.jpg';

const Register = () => {
  const overlay = useColorModeValue('rgba(5, 10, 24, 0.88)', 'rgba(2, 4, 14, 0.92)');
  const pattern = 'radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.18), transparent 40%), radial-gradient(circle at 30% 80%, rgba(250, 204, 21, 0.2), transparent 35%)';

  return (
    <Box
      minH="100vh"
      backgroundImage={`${pattern}, url(${heroBanner})`}
      backgroundSize="cover"
      backgroundPosition="center"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        bg: overlay,
        backdropFilter: 'blur(3px)',
      }}
    >
      <Flex position="relative" minH="100vh" align="center" justify="center" px={4} py={10}>
        <Box
          w="full"
          maxW="520px"
          bg="rgba(7, 13, 30, 0.85)"
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          borderRadius="2xl"
          boxShadow="0 25px 70px rgba(0,0,0,0.5)"
          p={{ base: 6, md: 8 }}
          backdropFilter="blur(6px)"
        >
          <RegisterForm />
        </Box>
      </Flex>
    </Box>
  );
};

export default Register;


