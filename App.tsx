import 'react-native-gesture-handler';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR'
import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'
import AppLoading from 'expo-app-loading';

import theme from './src/global/styles/theme'

import { AppRoutes } from './src/routes/app.routs';
import { SignIn } from './src/screens/SignIn';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" translucent backgroundColor={theme.colors.primary} />
        {/* <AppRoutes /> */}
        <SignIn />
      </NavigationContainer>
    </ThemeProvider>
  );
}
