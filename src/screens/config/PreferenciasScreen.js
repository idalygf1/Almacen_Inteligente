import React from 'react';
import { View, Text, StyleSheet, Switch, Image, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/HeaderBar';
import { LinearGradient } from 'expo-linear-gradient';

export default function PreferenciasScreen() {
  const { theme, colors, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar customTitle="Preferencias" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={isDark ? ['#222', '#111'] : ['#f2f2f2', '#e0e0e0']}
          style={styles.card}
        >
          <Image
            source={require('../../../assets/paleta.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={[styles.label, { color: colors.text }]}>
            {isDark ? 'Modo Oscuro Activado' : 'Modo Claro Activado'}
          </Text>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={isDark ? '#56CCF2' : '#2F80ED'}
            trackColor={{ false: '#ccc', true: '#56CCF2' }}
          />
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    marginTop: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});
