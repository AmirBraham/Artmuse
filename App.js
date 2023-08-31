import * as React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import Home from "./screens/Home"
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './screens/Settings';
import { Text } from 'react-native';

const queryClient = new QueryClient()
const Stack = createNativeStackNavigator();


export default function App() {


  return (
    <>
      <StatusBar style="light" backgroundColor='black' />
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerShown: false,
            presentation:"card",
            animationTypeForReplace:"push"
          }} >
            <Stack.Screen name='Hello' component={Home} />
            <Stack.Screen name='Settings' component={Settings} />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider >
    </>


  );
}
