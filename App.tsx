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

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Add" component={Add} />
        <Stack.Screen name="Finalizar" component={Finalizar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


