import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import HeaderBar from '../../components/HeaderBar';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const YEARS = ['2024', '2025', '2026'];

export default function FinanzasEstado() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState('Julio');
  const [selectedYear, setSelectedYear] = useState('2025');

  const activeTab = 'estado';

  const tabs = [
    { label: 'Estados de cuenta', value: 'estado' },
    { label: 'Resumen', value: 'resumen' },
    { label: 'Predicción', value: 'prediccion' },
    { label: 'IA', value: 'ia' },
  ];

  const handleTabPress = (tab) => {
    if (tab === 'estado') return;
    if (tab === 'resumen') navigation.navigate('FinanzasResumen');
    if (tab === 'prediccion') navigation.navigate('FinanzasPrediccion');
    if (tab === 'ia') navigation.navigate('FinanzasIA');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HeaderBar customTitle="Estados de Cuenta" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Botones de navegación */}
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

        {/* Filtros de mes y año */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {MONTHS.map((month) => (
              <TouchableOpacity
                key={month}
                onPress={() => setSelectedMonth(month)}
                style={[
                  styles.filterButton,
                  selectedMonth === month && styles.activeFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedMonth === month && styles.activeFilterText,
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {YEARS.map((year) => (
              <TouchableOpacity
                key={year}
                onPress={() => setSelectedYear(year)}
                style={[
                  styles.filterButton,
                  selectedYear === year && styles.activeFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedYear === year && styles.activeFilterText,
                  ]}
                >
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Contenido de ejemplo */}
        <View style={styles.summaryBox}>
          <Text style={styles.sectionTitle}>Estado de Cuenta</Text>
          <Text style={styles.subtitle}>Cha Cha</Text>
          <Text style={[styles.amount, { color: colors.text }]}>Dinero inicial: $-99,250.00</Text>

          {/* Tarjetas de cuentas */}
          <View style={styles.cardGrid}>
            {[
              { label: 'Crédito personal', amount: -138000, color: '#d6dce0' },
              { label: 'Efectivo', amount: -106700, color: '#c9f5db' },
              { label: 'Wallet Rappi', amount: 128200, color: '#facc6e' },
              { label: 'Débito BBVA', amount: 143330, color: '#adcfff' },
              { label: 'Wallet Uber Eats', amount: 95200, color: '#c592ff' },
              { label: 'Débito Mercado Pago', amount: 214200, color: '#7bc6ff' },
              { label: 'Crédito Oro BBVA', amount: -435480, color: '#fff796' },
            ].map((item, i) => (
              <View key={i} style={[styles.card, { backgroundColor: item.color }]}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardAmount}>${item.amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontWeight: 'bold',
    color: '#000',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tabText: {
    fontWeight: 'bold',
  },
  filterContainer: {
    marginVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  filterText: {
    fontWeight: 'bold',
  },
  activeFilter: {
    backgroundColor: '#ff4d4d',
  },
  activeFilterText: {
    color: 'white',
  },
  summaryBox: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  card: {
    width: '45%',
    padding: 12,
    borderRadius: 12,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '900',
  },
});
