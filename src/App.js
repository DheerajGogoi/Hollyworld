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
import { BrowserRouter, Routes, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Pages/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/home' exact component={Home} />
        <Route path='*' exact>
          <Redirect to='/home' />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;