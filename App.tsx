import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';

import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import { RootStackParamList } from './src/navigation/types';

// Cria o "empilhador" de telas
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // Provedor do React Native Paper
    <PaperProvider>
      {/* Container da navegação */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Pokédex' }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={({ route }) => ({
              // Pega o nome do Pokémon do parâmetro e coloca no título
              title: route.params.pokemon.name.charAt(0).toUpperCase() + route.params.pokemon.name.slice(1),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}