import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Movies from './Pages/Movies';
import PageNotFound from './Pages/PageNotFound';
import TvShows from './Pages/TvShows';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/movies' element={<Movies />}/>
        <Route path='/tvshows' element={<TvShows />}/>
        <Route path='*' element={<PageNotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;