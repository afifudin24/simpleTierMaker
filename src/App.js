// src/App.js
import React from 'react';
import TierList from './components/TierList';
import {
  ChakraProvider,
  Container,
  Stack,
  Box,
  Heading,
  Text,
} from '@chakra-ui/react'
import theme from './theme/Theme';

function App() {
  return (
    <ChakraProvider  theme={theme}>
    <Box>
      <TierList />
    </Box>
    </ChakraProvider>
  );
}

export default App;
