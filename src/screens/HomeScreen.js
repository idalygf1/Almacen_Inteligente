// HomeScreen.js con modo claro (#e0e0e0) y colores adaptados dinámicamente
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
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { useLanguage } from '../context/LanguageContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { token } = useAuth();
  const navigation = useNavigation();
  const { t } = useLanguage();

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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('finances')}</Text>
        <View style={styles.singleCardRow}>
          <LinearGradient colors={colors.gradientCard} style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.cardText }]}>{t('utility')}</Text>
            <Text style={[styles.cardValue, { color: colors.cardText }]}>
              {utilidad ? `$${Number(utilidad).toLocaleString('es-MX')}` : '...'}
            </Text>
          </LinearGradient>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('monitoring')}</Text>
        <View style={styles.cardRow}>
          <LinearGradient colors={colors.gradientCard} style={styles.card}>
            <Image source={require('./../../assets/temp.png')} style={styles.icon} />
            <Text style={[styles.cardTitle, { color: colors.cardText }]}>{t('temperature')}</Text>
            <Text style={[styles.cardValue, { color: colors.cardText }]}>
              {temperatura ? `${temperatura} °C` : '...'}
            </Text>
          </LinearGradient>

          <LinearGradient colors={colors.gradientCard} style={styles.card}>
            <Image source={require('./../../assets/drop.png')} style={styles.icon} />
            <Text style={[styles.cardTitle, { color: colors.cardText }]}>{t('humidity')}</Text>
            <Text style={[styles.cardValue, { color: colors.cardText }]}>
              {humedad ? `${humedad} %` : '...'}
            </Text>
          </LinearGradient>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('alerts')}</Text>
        <View style={styles.alertContainer}>
          {alertas.map((alerta) => (
            <LinearGradient
              key={alerta.id}
              colors={colors.gradientCard}
              style={styles.alertBox}
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
            </LinearGradient>
          ))}

          <TouchableOpacity
  style={[styles.btnVerMas, { backgroundColor: colors.button }]}
  onPress={() => navigation.navigate('MonitoreoAlertas')}

>
</TouchableOpacity>

        </View>
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
    textAlign: 'center',
    marginVertical: 12,
    fontWeight: 'bold',
  },
  singleCardRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  card: {
    width: 160,
    height: 160,
    borderRadius: 16,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 8,
    tintColor: '#fff',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: 17,
    fontFamily: 'Urbanist-Regular',
  },
  alertContainer: {
    paddingHorizontal: 10,
  },
  alertBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  alertType: {
    fontFamily: 'Urbanist-Bold',
    marginBottom: 4,
    fontSize: 16,
  },
  alertMessage: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
  },
  alertTime: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
    textAlign: 'right',
    marginTop: 4,
  },
  btnText: {
    fontFamily: 'Urbanist-Bold',
    color: '#fff',
  },
});
