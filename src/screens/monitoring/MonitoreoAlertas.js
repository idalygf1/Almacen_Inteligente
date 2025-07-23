// src/screens/Monitoreo/MonitoreoAlertas.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/HeaderBar';
import gasImg from './../../../assets/gas.png';
import humedadImg from './../../../assets/humedad.png';
import temperaturaImg from './../../../assets/temperatura.png';
import vibracionImg from './../../../assets/vibracion.png';

const MonitoreoAlertas = () => {
  const { token } = useAuth();
  const { colors } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sensorModalVisible, setSensorModalVisible] = useState(false);
  const [filterSensor, setFilterSensor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://monitoring.nexusutd.online/monitoring/notifications?limit=1000',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const allAlerts = response.data.notifications || [];
        setAlerts(allAlerts);
        setFilteredAlerts(allAlerts);
      } catch (error) {
        console.error('Error al obtener alertas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  useEffect(() => {
    let filtered = Array.isArray(alerts) ? [...alerts] : [];
    if (filterSensor !== 'all') {
      filtered = filtered.filter(alert =>
        alert.sensor?.toLowerCase() === filterSensor.toLowerCase()
      );
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(alert =>
        alert.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }
    setFilteredAlerts(filtered);
  }, [filterSensor, filterStatus, alerts]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "hh:mm a '–' d 'de' MMMM", { locale: es });
  };

  const getSensorStatus = () => [
    { name: 'Temperatura', image: temperaturaImg },
    { name: 'Humedad', image: humedadImg },
    { name: 'Gas', image: gasImg },
    { name: 'Vibración', image: vibracionImg },
  ];

  return (
    <View style={[styles.fullContainer, { backgroundColor: colors.background }]}>
      <HeaderBar title="Alertas" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Historial de Alertas</Text>
          <TouchableOpacity onPress={() => setSensorModalVisible(true)} style={[styles.sensorButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.sensorEmoji}>📡</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filters}>
          <Picker selectedValue={filterSensor} onValueChange={setFilterSensor} style={[styles.picker, { backgroundColor: colors.input }]}>
            <Picker.Item label="Sensor: Todos" value="all" />
            <Picker.Item label="Gas" value="Gas" />
            <Picker.Item label="Vibración" value="Vibration" />
          </Picker>

          <Picker selectedValue={filterStatus} onValueChange={setFilterStatus} style={[styles.picker, { backgroundColor: colors.input }]}>
            <Picker.Item label="Estado: Todos" value="all" />
            <Picker.Item label="Leído" value="read" />
            <Picker.Item label="No leído" value="unread" />
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.button} />
        ) : filteredAlerts && filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedAlert(alert);
                setModalVisible(true);
              }}
            >
              <LinearGradient
                colors={colors?.gradientCard || [colors.primary, colors.primaryLight || '#60a5fa']}
                style={[styles.card, { shadowColor: colors.primaryLight }]}
              >
                <Text style={[styles.cardTitle, { color: colors.cardText }]}>
                  {alert.sensor} – {formatDate(alert.timestamp)}
                </Text>
                <Text style={[styles.cardMessage, { color: colors.cardText }]}>
                  {alert.message}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: colors.text, textAlign: 'center' }}>
            No hay alertas disponibles.
          </Text>
        )}
      </ScrollView>

      {/* Modal Detalle */}
      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            {selectedAlert && (
              <>
                <Text style={[styles.modalSensor, { color: colors.primary }]}>
                  {selectedAlert.sensor}
                </Text>
                <Text style={[styles.modalDate, { color: colors.text }]}>
                  {formatDate(selectedAlert.timestamp)}
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

      {/* Modal Sensores */}
      <Modal visible={sensorModalVisible} animationType="fade" transparent onRequestClose={() => setSensorModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={[styles.sensorModalContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Estado de Sensores</Text>
            {getSensorStatus().map((sensor, index) => (
              <View key={index} style={styles.sensorRow}>
                <Image source={sensor.image} style={styles.sensorImage} />
                <Text style={[styles.sensorName, { color: colors.text }]}>{sensor.name}</Text>
                <Text style={styles.sensorStatus}>⚠️ Offline</Text>
              </View>
            ))}
            <TouchableOpacity onPress={() => setSensorModalVisible(false)}>
              <Text style={[styles.closeModal, { color: colors.primary }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: { flex: 1 },
  scrollContainer: { padding: 16, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  title: { fontSize: 20, fontWeight: 'bold' },
  sensorButton: { padding: 10, borderRadius: 50 },
  sensorEmoji: { fontSize: 22 },
  filters: { flexDirection: 'row', gap: 10, marginBottom: 20, marginTop: 16 },
  picker: { flex: 1, borderRadius: 20, height: 53 },
  card: { padding: 18, borderRadius: 16, marginBottom: 16, elevation: 4 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  cardMessage: { fontSize: 15 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalCard: { padding: 24, borderRadius: 14, width: '85%', alignItems: 'center', elevation: 5 },
  modalSensor: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  modalDate: { fontSize: 14, marginBottom: 10 },
  modalMessage: { fontSize: 15, textAlign: 'center', marginBottom: 16 },
  closeModal: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  sensorModalContainer: { padding: 26, borderRadius: 14, width: '85%', alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1.2 },
  sensorRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: '100%', justifyContent: 'space-between' },
  sensorImage: { width: 28, height: 28, resizeMode: 'contain' },
  sensorName: { flex: 1, fontSize: 16, fontWeight: '600', marginLeft: 12 },
  sensorStatus: { fontSize: 14, fontWeight: 'bold', color: '#facc15' },
});

export default MonitoreoAlertas;
