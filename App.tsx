/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  useColorScheme,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import Home from "./screens/Home"
import Settings from './screens/Settings';


const Stack = createNativeStackNavigator();
const queryClient = new QueryClient()

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (

    <NavigationContainer>

      <QueryClientProvider client={queryClient}>
        <Stack.Navigator screenOptions={{
          headerShown: false,
        }} >

          <Stack.Screen name='Hello' component={Home} />
          <Stack.Screen name='Settings' component={Settings} />

        </Stack.Navigator>
      </QueryClientProvider>

    </NavigationContainer>

  );
}


export default App;
