import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import LoginForm from '../components/LoginForm';
import heroBanner from '../assets/hero-banner.jpg';

const Login: React.FC = () => {
  const overlay = useColorModeValue('rgba(3, 8, 22, 0.85)', 'rgba(2, 6, 18, 0.9)');
  const pattern = 'radial-gradient(circle at top, rgba(255, 215, 0, 0.2), transparent 45%), radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.15), transparent 35%)';

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
        backdropFilter: 'blur(2px)',
      }}
    >
      <Flex position="relative" minH="100vh" align="center" justify="center" px={4} py={10}>
        <Box
          w="full"
          maxW="480px"
          bg="rgba(6, 11, 25, 0.85)"
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          borderRadius="2xl"
          boxShadow="0 25px 60px rgba(0,0,0,0.45)"
          p={{ base: 6, md: 8 }}
          backdropFilter="blur(6px)"
        >
          <LoginForm />
        </Box>
      </Flex>
    </Box>
  );
};

export default Login;


