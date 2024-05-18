import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native'; // Importando do 'react-native'
import { useEffect, useState } from 'react';
const Stack = createNativeStackNavigator();

import Home from './pages/Home/Home'
import Add from './pages/Add/Add'
import Finalizar from './pages/Finalizar/Finalizar'

export default function App() {
  const [atualizaPagina, setatualizaPagina] = useState(true);
  const [ItensEscolhidos, setItensEscolhidos] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {props => (
            <Home
              {...props}
              ItensEscolhidos={ItensEscolhidos}
              setItensEscolhidos={setItensEscolhidos}
              atualizaPagina={atualizaPagina}
              setatualizaPagina={setatualizaPagina}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Add">
          {props => (
            <Add
              {...props}
              atualizaPagina={atualizaPagina}
              setatualizaPagina={setatualizaPagina}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Finalizar">
          {props => (
            <Finalizar
              {...props}
              ItensEscolhidos={ItensEscolhidos}
              setItensEscolhidos={setItensEscolhidos}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


