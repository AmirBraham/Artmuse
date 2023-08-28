import * as React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import Home from "./screens/Home"
import { StatusBar } from 'expo-status-bar';


const queryClient = new QueryClient()


export default function App() {
  <StatusBar style="dark" />

  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>


  );
}
