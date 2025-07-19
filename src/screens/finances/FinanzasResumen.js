import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/HeaderBar';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const YEARS = ['2024', '2025', '2026'];

export default function FinanzasResumen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState('Julio');
  const [selectedYear, setSelectedYear] = useState('2025');
  const activeTab = 'resumen';

  const ingresos = 4100.0;
  const gastos = 0.0;
  const utilidad = ingresos - gastos;
  const margen = ingresos === 0 ? 0 : Math.round((utilidad / ingresos) * 100);

  const chartData = [
    {
      name: 'Ventas QR',
      amount: ingresos,
      color: '#00C853',
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
  ];

  const handleTabPress = (tab) => {
    if (tab === 'estado') navigation.navigate('FinanzasEstado');
    if (tab === 'prediccion') navigation.navigate('FinanzasPrediccion');
    if (tab === 'ia') navigation.navigate('FinanzasIA');
  };

  const tabs = [
    { label: 'Estados de cuenta', value: 'estado' },
    { label: 'Resumen', value: 'resumen' },
    { label: 'Predicción', value: 'prediccion' },
    { label: 'IA', value: 'ia' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HeaderBar customTitle="Resumen" />


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

      {/* Filtros */}
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

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tarjetas */}
        <View style={styles.row}>
          <View style={styles.card}>
            <Ionicons name="trending-up" size={18} color="#00C853" />
            <Text style={styles.label}>Ingresos</Text>
            <Text style={styles.value}>${ingresos.toFixed(2)}</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="trending-down" size={18} color="red" />
            <Text style={styles.label}>Gastos</Text>
            <Text style={[styles.value, { color: 'red' }]}>
              ${gastos.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.card}>
            <Ionicons name="cash" size={18} color="#00C853" />
            <Text style={styles.label}>Utilidad neta</Text>
            <Text style={styles.value}>${utilidad.toFixed(2)}</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="stats-chart" size={18} color="green" />
            <Text style={styles.label}>Margen de utilidad</Text>
            <Text style={styles.value}>{margen}%</Text>
          </View>
        </View>

        {/* Gráficas */}
        <Text style={styles.chartTitle}>Categorías de ingresos</Text>
        <PieChart
          data={chartData}
          width={screenWidth - 20}
          height={180}
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.background,
            backgroundGradientTo: colors.background,
            color: () => '#00C853',
            labelColor: () => colors.text,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          hasLegend={true}
          center={[0, 0]}
        />

        <Text style={styles.chartTitle}>Categorías de gastos</Text>
        <Text style={{ textAlign: 'center', color: colors.text }}>
          Sin gastos registrados en este periodo
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
    gap: 8,
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
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#00C853',
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});
