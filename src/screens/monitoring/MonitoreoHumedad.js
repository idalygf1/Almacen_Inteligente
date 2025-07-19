import React, { useEffect, useState } from 'react';
import HeaderBar from '../../components/HeaderBar';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

const FILTER_OPTIONS = [
  { label: 'Ahora', value: '24h' },
  { label: 'Último día', value: 'last_5min' },
  { label: 'Última semana', value: 'last_week' },
  { label: 'Último mes', value: 'last_month' },
  { label: 'Últimos 3 meses', value: 'last_3months' },
];

const MonitoreoHumedad = () => {
  const { token } = useAuth();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('24h');

  const getHumidityData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://monitoring.nexusutd.online/monitoring/humidity-graph?filter=${filter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(res.data);
    } catch (error) {
      console.error('Error fetching humidity data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHumidityData();
  }, [filter]);

  const renderChart = () => {
    if (!data?.humidity) return null;

    const humValues = data.humidity.map(entry => entry.value);
    const humTimes = data.humidity.map((entry, idx) =>
      idx % 5 === 0
        ? new Date(entry.time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        : ''
    );

    return (
      <LineChart
        data={{
          labels: humTimes,
          datasets: [{ data: humValues }],
        }}
        width={screenWidth - 32}
        height={240}
        yAxisSuffix="%"
        fromZero={false}
        bezier
        chartConfig={{
          backgroundColor: colors.background,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 172, 193, ${opacity})`,
          labelColor: () => colors.text,
          propsForDots: {
            r: '3',
            strokeWidth: '2',
            stroke: '#00ACC1',
          },
        }}
        style={{ borderRadius: 20 }}
      />
    );
  };

  return (
    <View style={[styles.fullContainer, { backgroundColor: colors.background }]}>
      <HeaderBar title="Humedad" />
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.filterContainer}>
          {FILTER_OPTIONS.map(opt => {
            const isActive = filter === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setFilter(opt.value)}
                style={[
                  styles.filterButton,
                  isActive && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && { color: '#fff' },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            {renderChart()}
            {data && (
              <View style={styles.metricsContainer}>
                <Text style={[styles.currentTemp, { color: colors.text }]}>
                  {data.current.toFixed(0)}%
                </Text>
                <View style={styles.cardGroup}>
                  <LinearGradient colors={['#c2e9fb', '#81a4fd']} style={styles.card}>
                    <Text style={styles.label}>Máxima</Text>
                    <Text style={styles.cardText}>{data.max.toFixed(0)}%</Text>
                  </LinearGradient>
                  <LinearGradient colors={['#b2fefa', '#0ed2f7']} style={styles.card}>
                    <Text style={styles.label}>Promedio</Text>
                    <Text style={styles.cardText}>{data.average.toFixed(0)}%</Text>
                  </LinearGradient>
                  <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.card}>
                    <Text style={styles.label}>Mínima</Text>
                    <Text style={styles.cardText}>{data.min.toFixed(0)}%</Text>
                  </LinearGradient>
                </View>

                {data.current > 70 && (
                  <View style={styles.alertBox}>
                    <Text style={styles.alertTitle}>⚠️ Alerta: Humedad alta</Text>
                    <Text style={styles.alertText}>
                      La humedad actual supera el 70%, revisa si hay fallas en la ventilación o exceso de humedad ambiental.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1.5,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 6,
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterText: {
    fontSize: 14,
    color: '#010237',
    fontWeight: '600',
  },
  metricsContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  currentTemp: {
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    gap: 8,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    width: '30%',
    elevation: 3,
  },
  label: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#010237',
  },
  alertBox: {
    marginTop: 20,
    backgroundColor: '#fff3cd',
    borderLeftWidth: 5,
    borderLeftColor: '#ffc107',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  alertTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#d84315',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    color: '#6a1b09',
  },
});

export default MonitoreoHumedad;
