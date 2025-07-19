import React from 'react';
import { View, Text as RNText, StyleSheet, Switch, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/HeaderBar'; // ✅ Header agregado

export default function PreferenciasScreen() {
  const { theme, colors, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <HeaderBar customTitle="Preferencias" />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Image
          source={require('../../../assets/paleta.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <RNText style={[styles.title, { color: colors.text }]}>Tema de la aplicación</RNText>

        <View style={styles.switchContainer}>
          <RNText style={[styles.label, { color: colors.text }]}>
            {isDark ? 'Modo Oscuro Activado' : 'Modo Claro Activado'}
          </RNText>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={isDark ? '#4a90e2' : '#007bff'}
            trackColor={{ false: '#ccc', true: '#4a90e2' }}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
  },
});
