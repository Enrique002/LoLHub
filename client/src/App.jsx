'use strict';

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, useColorModeValue } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ChampionList from './pages/ChampionList';
import ChampionDetail from './pages/ChampionDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Items from './pages/Items';
import Runas from './pages/Runas';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Ranking from './pages/Ranking';

const App = () => {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'background.primary')}>
      <Navbar />
      <Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/champions" element={<ChampionList />} />
          <Route path="/champions/:id" element={<ChampionDetail />} />
          <Route path="/items" element={<Items />} />
          <Route path="/runas" element={<Runas />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/comunidad" element={<Community />} />
          <Route path="/ranking" element={<Ranking />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;
