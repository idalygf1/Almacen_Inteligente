import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import socket from '../../services/socket';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderBar from '../../components/HeaderBar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Monitoreo = () => {
  const { token } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered] = useState('Todos');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://monitoring.nexusutd.online/monitoring/home', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTemperature(res.data.temperature);
      setHumidity(res.data.humidity);
      setNotifications(res.data.unread_notifications);
    } catch (error) {
      console.error('Error al obtener datos de monitoreo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    socket.connect();

    socket.on('product-updated', (data) => {
      if (data.cardData?.stock_actual !== undefined) {
        setTemperature(data.cardData.stock_actual);
      }
      if (data.detailData?.stock_actual !== undefined) {
        setHumidity(data.detailData.stock_actual);
      }
      if (data.movementData) {
        setNotifications((prev) => [data.movementData, ...prev]);
      }
    });

    return () => {
      socket.off('product-updated');
      socket.disconnect();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setFiltered('Todos');
    }, [])
  );

  const handleFilterPress = (type) => {
    setFiltered(type);
    if (type === 'Temperatura') navigation.navigate('MonitoreoTemperatura');
    else if (type === 'Humedad') navigation.navigate('MonitoreoHumedad');
    else if (type === 'Alertas') navigation.navigate('MonitoreoAlertas');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar title="Monitoreo" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            {/* FILTROS PERSONALIZADOS */}
            <View style={styles.filters}>
              {['Todos', 'Temperatura', 'Humedad', 'Alertas'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleFilterPress(type)}
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor: filtered === type ? colors.primary : '#ddd',
                    },
                  ]}
                >
                  <Text style={{ color: filtered === type ? '#fff' : '#333', fontWeight: 'bold' }}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* TARJETAS SENSORAS */}
            {(filtered === 'Todos' || filtered === 'Temperatura') && (
              <LinearGradient colors={['#e66465', '#9198e5']} style={styles.card}>
                <Image source={require('../../../assets/temp.png')} style={styles.icon} />
                <Text style={[styles.cardLabel, { color: '#fff' }]}>Temperatura</Text>
                <Text style={styles.cardValue}>{temperature ?? '--'}°C</Text>
              </LinearGradient>
            )}
            {(filtered === 'Todos' || filtered === 'Humedad') && (
              <LinearGradient colors={['#56CCF2', '#2F80ED']} style={styles.card}>
                <Image source={require('../../../assets/drop.png')} style={styles.icon} />
                <Text style={[styles.cardLabel, { color: '#fff' }]}>Humedad</Text>
                <Text style={styles.cardValue}>{humidity ?? '--'}%</Text>
              </LinearGradient>
            )}

            {(filtered === 'Todos' || filtered === 'Alertas') && (
              <>
                <Text style={[styles.subtitle, { color: colors.text }]}>A L E R T A S</Text>
                {notifications.map((n, index) => (
                  <TouchableOpacity
                    key={n.id || index}
                    style={[styles.alertCard, { backgroundColor: colors.card }]}
                    onPress={() => {
                      setSelectedAlert(n);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={[styles.alertType, { color: colors.text }]}>
                      {n.type === 'Gas' ? 'Sensor de gases' : 'Sensor de movimiento'}
                    </Text>
                    <Text style={[styles.alertMessage, { color: colors.text }]}>{n.message}</Text>
                    <Text style={[styles.alertTime, { color: colors.text }]}>
                      {new Date(n.timestamp).toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}

        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
              {selectedAlert && (
                <>
                  <Text style={[styles.modalSensor, { color: colors.primary }]}>
                    {selectedAlert.type === 'Gas' ? 'Sensor de gases' : 'Sensor de movimiento'}
                  </Text>
                  <Text style={[styles.modalDate, { color: colors.text }]}>
                    {new Date(selectedAlert.timestamp).toLocaleString()}
                  </Text>
                  <Text style={[styles.modalMessage, { color: colors.text }]}>
                    {selectedAlert.message}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={[styles.closeModal, { color: colors.primary }]}>Cerrar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 18, paddingBottom: 60 },
  filters: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  cardLabel: { fontSize: 14, marginTop: 10, fontWeight: 'bold' },
  cardValue: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 6 },
  icon: { width: 38, height: 38, resizeMode: 'contain' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 12 },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  alertType: { fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  alertMessage: { fontSize: 13, marginBottom: 4 },
  alertTime: { fontSize: 11, textAlign: 'right' },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    width: '85%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalSensor: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  modalDate: { fontSize: 14, marginBottom: 10 },
  modalMessage: { fontSize: 15, textAlign: 'center', marginBottom: 16 },
  closeModal: { fontSize: 16, fontWeight: 'bold' },
});

export default Monitoreo;
