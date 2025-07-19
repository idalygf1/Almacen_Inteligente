import React, { useEffect, useState } from 'react';
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
import HeaderBar from '../../components/HeaderBar';

const screenWidth = Dimensions.get('window').width;

const FILTER_OPTIONS = [
  { label: 'Ahora', value: '24h' },
  { label: 'Último día', value: 'last_5min' },
  { label: 'Última semana', value: 'last_week' },
  { label: 'Último mes', value: 'last_month' },
  { label: 'Últimos 3 meses', value: 'last_3months' },
];

const MonitoreoTemperatura = () => {
  const { token } = useAuth();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('24h');

  const getTemperatureData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://monitoring.nexusutd.online/monitoring/temperature-graph?filter=${filter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(res.data);
    } catch (error) {
      console.error('Error fetching temperature data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTemperatureData();
  }, [filter]);

  const renderChart = () => {
    if (!data?.temperature) return null;

    const tempValues = data.temperature.map(entry => entry.value);
    const tempTimes = data.temperature.map((entry, idx) =>
      idx % 5 === 0
        ? new Date(entry.time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        : ''
    );

    return (
      <LineChart
        data={{
          labels: tempTimes,
          datasets: [{ data: tempValues }],
        }}
        width={screenWidth - 32}
        height={240}
        yAxisSuffix="°C"
        fromZero={false}
        bezier
        chartConfig={{
          backgroundColor: colors.background,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(30, 136, 229, ${opacity})`,
          labelColor: () => colors.text,
          propsForDots: {
            r: '3',
            strokeWidth: '2',
            stroke: '#1976D2',
          },
        }}
        style={{ borderRadius: 20 }}
      />
    );
  };

  return (
    <View style={[styles.full, { backgroundColor: colors.background }]}>
      <HeaderBar title="Temperatura" />
      <ScrollView style={[styles.container]}>

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
                  {data.current.toFixed(1)}°C
                </Text>
                <View style={styles.cardGroup}>
                  <LinearGradient colors={['#ff9a9e', '#fad0c4']} style={styles.card}>
                    <Text style={styles.label}>Máxima</Text>
                    <Text style={styles.cardText}>{data.max.toFixed(1)}°C</Text>
                  </LinearGradient>
                  <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.card}>
                    <Text style={styles.label}>Promedio</Text>
                    <Text style={styles.cardText}>{data.average.toFixed(1)}°C</Text>
                  </LinearGradient>
                  <LinearGradient colors={['#b2fefa', '#0ed2f7']} style={styles.card}>
                    <Text style={styles.label}>Mínima</Text>
                    <Text style={styles.cardText}>{data.min.toFixed(1)}°C</Text>
                  </LinearGradient>
                </View>

                {data.current > 28 && (
                  <View style={styles.alertBox}>
                    <Text style={styles.alertTitle}>⚠️ Alerta: Temperatura alta</Text>
                    <Text style={styles.alertText}>
                      La temperatura supera los 28°C, revisa condiciones de ventilación o refrigeración.
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
  full: { flex: 1 },
  container: {
    padding: 16,
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

export default MonitoreoTemperatura;
