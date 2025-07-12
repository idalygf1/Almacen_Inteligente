import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const lightColors = {
  mode: 'light',
  background: '#e0e0e0',
  text: '#000000',
  card: '#f5f5f5',
  button: '#000000',
  cardText: '#000000',
  gradientCard: ['#d6d6d6', '#a0a0a0'],
  input: '#ffffff',
  border: '#cccccc',
  placeholder: '#888888',
  cancel: '#ecf0f1',
  cancelText: '#2c3e50',
  primary: '#000000',
};

const darkColors = {
  mode: 'dark',
  background: '#121212',
  text: '#ffffff',
  card: '#1e1e1e',
  button: '#4a90e2',
  cardText: '#ffffff',
  gradientCard: ['#333333', '#111111'],
  input: '#2c2c2c',
  border: '#444444',
  placeholder: '#aaaaaa',
  cancel: '#7f8c8d',
  cancelText: '#ffffff',
  primary: '#4a90e2',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return context;
};
