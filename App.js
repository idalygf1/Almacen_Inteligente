// App.js
import React, { useEffect, useState, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import MainNavigator from './src/navigation/MainNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';

import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ProductProvider } from './src/context/ProductContext';
import { LanguageProvider } from './src/context/LanguageContext';

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { token, loading, logout } = useAuth();

  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      await SplashScreen.hideAsync();
    }
  }, [loading]);

  useEffect(() => {
    const borrarTokenAlInicio = async () => {
      try {
        await AsyncStorage.removeItem('token');
        console.log('');
        logout(); // fuerza cerrar sesión
      } catch (error) {
        console.warn('Error eliminando token al inicio', error);
      }
    };

    borrarTokenAlInicio();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <ProductProvider>
            <RootNavigation />
          </ProductProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
