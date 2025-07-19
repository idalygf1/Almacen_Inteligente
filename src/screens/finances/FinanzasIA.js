import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/HeaderBar';
import { useNavigation } from '@react-navigation/native';

export default function FinanzasIA() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const activeTab = 'ia';

  const tabs = [
    { label: 'Estados de cuenta', value: 'estado' },
    { label: 'Resumen', value: 'resumen' },
    { label: 'Predicción', value: 'prediccion' },
    { label: 'IA', value: 'ia' },
  ];

  const handleTabPress = (tab) => {
    if (tab === 'estado') navigation.navigate('FinanzasEstado');
    if (tab === 'resumen') navigation.navigate('FinanzasResumen');
    if (tab === 'prediccion') navigation.navigate('FinanzasPrediccion');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar customTitle="I A" />


      {/* Navegación superior */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[
              styles.tabButton,
              activeTab === tab.value && { backgroundColor: colors.primary },
            ]}
            onPress={() => handleTabPress(tab.value)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.value ? 'white' : colors.text },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido de IA */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.text, { color: colors.text }]}>
          Aquí aparecerá el análisis de IA próximamente.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tabText: {
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
