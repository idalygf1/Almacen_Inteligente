import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/HeaderBar';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const FILTER_OPTIONS = [
  { label: 'Últimos 6 meses', value: '6m' },
  { label: 'Último año', value: '1y' },
];

const dummyData = {
  '6m': {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    data: [16800, 16900, 16850, 16800, 16820, 16810],
  },
  '1y': {
    labels: [
      'Jul 25', 'Ago', 'Sep', 'Oct',
      'Nov', 'Dic', 'Ene 26', 'Feb',
      'Mar', 'Abr', 'May', 'Jun'
    ],
    data: [
      19437, 15000, 17500, 16500,
      17000, 16700, 16800, 16900,
      16850, 16800, 16820, 16810
    ]
  }
};

export default function FinanzasPrediccion() {
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('1y');
  const navigation = useNavigation();
  const activeTab = 'prediccion';

  const chartData = {
    labels: dummyData[selectedFilter].labels,
    datasets: [{ data: dummyData[selectedFilter].data }],
  };

  const tabs = [
    { label: 'Estados de cuenta', value: 'estado' },
    { label: 'Resumen', value: 'resumen' },
    { label: 'Predicción', value: 'prediccion' },
    { label: 'IA', value: 'ia' },
  ];

  const handleTabPress = (tab) => {
    if (tab === 'estado') navigation.navigate('FinanzasEstado');
    if (tab === 'resumen') navigation.navigate('FinanzasResumen');
    if (tab === 'ia') navigation.navigate('FinanzasIA');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar customTitle="Predicción" />



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
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setSelectedFilter(option.value)}
            style={[
              styles.filterButton,
              selectedFilter === option.value && styles.activeFilter,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === option.value && styles.activeFilterText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Gráfica */}
      <ScrollView horizontal>
        <BarChart
          data={chartData}
          width={screenWidth * 1.5}
          height={300}
          fromZero
          showValuesOnTopOfBars
          withInnerLines={false}
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.background,
            backgroundGradientTo: colors.background,
            decimalPlaces: 0,
            color: () => '#FF3D3D',
            labelColor: () => colors.text,
            barPercentage: 0.6,
          }}
          verticalLabelRotation={30}
          style={{ borderRadius: 12, margin: 8 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
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
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  activeFilter: {
    backgroundColor: '#FF3D3D',
  },
  activeFilterText: {
    color: 'white',
  },
});
