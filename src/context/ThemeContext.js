import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ThemeContext = createContext();

const baseLight = {
  mode: 'light',
  background: '#f9fafb',
  text: '#000000',
  cardText: '#000000',
  input: '#ffffff',
  border: '#cccccc',
  placeholder: '#888888',
  cancel: '#ecf0f1',
  cancelText: '#2c3e50',
};

const baseDark = {
  mode: 'dark',
  background: '#121212',
  text: '#ffffff',
  cardText: '#ffffff',
  input: '#2c2c2c',
  border: '#444444',
  placeholder: '#aaaaaa',
  cancel: '#7f8c8d',
  cancelText: '#ffffff',
};

// Aclarar color HEX
const lightenColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [dynamicColors, setDynamicColors] = useState({
    primary: '#1e40af',
    secondary: '#50e3c2',
    tertiary: '#f5a623',
    primaryLight: '#bcd2ff',
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const fetchColorsFromBackend = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await axios.get('https://auth.nexusutd.online/auth/config', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { color_primary, color_secondary, color_tertiary } = res.data;

      if (color_primary && color_secondary && color_tertiary) {
        const primaryLight = lightenColor(color_secondary, 0.1);
        setDynamicColors({
          primary: color_primary,
          secondary: color_secondary,
          tertiary: color_tertiary,
          primaryLight,
        });
      }
    } catch (error) {
      console.error('❌ Error al obtener colores del backend:', error);
    }
  };

  useEffect(() => {
    fetchColorsFromBackend();
  }, []);

  const currentBase = theme === 'light' ? baseLight : baseDark;

  const colors = {
  ...currentBase,
  ...dynamicColors,
  card: dynamicColors.primaryLight,
  button: dynamicColors.primary,
  gradientCard: [dynamicColors.primary, dynamicColors.secondary],
};


  return (
    <ThemeContext.Provider
      value={{
        theme,
        dark: theme === 'dark', // ✅ ESTO ES LO QUE FALTABA
        colors,
        toggleTheme,
        fetchColorsFromBackend,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return context;
};
