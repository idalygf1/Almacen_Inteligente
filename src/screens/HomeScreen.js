import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import HeaderBar from '../components/HeaderBar';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { token } = useAuth();
  const navigation = useNavigation();

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [utilidad, setUtilidad] = useState('');
  const [temperatura, setTemperatura] = useState(null);
  const [humedad, setHumedad] = useState(null);
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Urbanist-Regular': require('./../../assets/fonts/Urbanist-Regular.ttf'),
        'Urbanist-Bold': require('./../../assets/fonts/Urbanist-Bold.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await axios.get('https://inventory.nexusutd.online/inventory/home', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const monRes = await axios.get('https://monitoring.nexusutd.online/monitoring/home', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUtilidad(invRes.data.utilidad || '');
        setTemperatura(monRes.data.temperature || null);
        setHumedad(monRes.data.humidity || null);
        setAlertas(monRes.data.unread_notifications?.slice(0, 2) || []);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      }
    };

    fetchData();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

        {/* Finanzas */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Finanzas</Text>
        <View style={[styles.card, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.cardTitle, { color: colors.cardText }]}>Utilidad de hoy</Text>
          <Image source={require('./../../assets/bolsa.png')} style={styles.icon} />
          <Text style={[styles.cardValue, { color: colors.cardText }]}>
            {utilidad ? `$${Number(utilidad).toLocaleString('es-MX')}` : ''}
          </Text>
        </View>

        {/* Monitoreo */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Monitoreo</Text>
        <View style={[styles.card, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.cardTitle, { color: colors.cardText }]}>Temperatura</Text>
          <Image source={require('./../../assets/temp.png')} style={styles.icon} />
          <Text style={[styles.cardValue, { color: colors.cardText }]}>
            {temperatura ? `${temperatura} °C` : '...'}
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.cardTitle, { color: colors.cardText }]}>Humedad</Text>
          <Image source={require('./../../assets/drop.png')} style={styles.icon} />
          <Text style={[styles.cardValue, { color: colors.cardText }]}>
            {humedad ? `${humedad} %` : '...'}
          </Text>
        </View>

        {/* Alertas */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Alertas recientes</Text>
        <View style={styles.alertContainer}>
          {alertas.length > 0 ? (
            alertas.map((alerta) => (
              <View
                key={alerta.id}
                style={[styles.alertBox, { backgroundColor: colors.primaryLight }]}
              >
                <Text style={[styles.alertType, { color: colors.cardText }]}>
                  {alerta.type.toUpperCase()}
                </Text>
                <Text style={[styles.alertMessage, { color: colors.cardText }]}>
                  {alerta.message}
                </Text>
                <Text style={[styles.alertTime, { color: colors.cardText }]}>
                  {new Date(alerta.timestamp).toLocaleString('es-MX')}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.noAlerts, { color: colors.cardText }]}>Sin alertas recientes</Text>
          )}
        </View>

        {/* Botón Acerca de */}
        <TouchableOpacity
  style={[styles.aboutButton, { backgroundColor: colors.primaryLight }]}
  onPress={() => navigation.navigate('Acerca')}
>
  <Text style={[styles.aboutText, { color: colors.cardText }]}>N O S O T R O S</Text>
</TouchableOpacity>




      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 12,
    textAlign: 'left',
  },
  card: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  cardValue: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    textAlign: 'center',
  },
  alertContainer: {
    gap: 10,
  },
  alertBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  alertType: {
    fontFamily: 'Urbanist-Bold',
    marginBottom: 4,
    fontSize: 16,
  },
  alertMessage: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 15,
  },
  alertTime: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 13,
    textAlign: 'right',
    marginTop: 4,
  },
  noAlerts: {
    fontSize: 15,
    fontFamily: 'Urbanist-Regular',
    textAlign: 'center',
    marginTop: 8,
  },
  aboutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: 200,
    left: 285,
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    fontWeight: 'bold',
  },
});
