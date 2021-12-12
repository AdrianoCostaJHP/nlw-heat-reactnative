import React from 'react';
import {
 useFonts,
 Roboto_400Regular,
 Roboto_700Bold
} from "@expo-google-fonts/roboto"
import AppLoadig from "expo-app-loading"
import Home from './src/pages/Home';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/hooks/useAuth';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })
  if(!fontsLoaded){
    return <AppLoadig/>
  }
  return (
    <AuthProvider>
      <StatusBar 
        style="light" 
        translucent 
        backgroundColor="transparent" 
      />
      <Home/>
    </AuthProvider>
  )
}

