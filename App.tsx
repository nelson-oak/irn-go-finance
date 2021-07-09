import 'react-native-gesture-handler';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR'
import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { ThemeProvider } from 'styled-components/native';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'
import AppLoading from 'expo-app-loading';

import theme from './src/global/styles/theme'

import { AuthProvider, useAuth } from './src/hooks/auth';
import { Routes } from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  // const { isAuthStorageLoaded } = useAuth()

  // Linha comentada não funciona
  // Acho que um hook não pode ser usado no arquivo que o contexto é criado
  // if (!(fontsLoaded && isAuthStorageLoaded)) {
  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content" translucent backgroundColor={theme.colors.primary} />
      {/* <AppRoutes /> */}
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
