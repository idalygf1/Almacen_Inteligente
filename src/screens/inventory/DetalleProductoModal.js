import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const DetalleProductoModal = ({ visible, onClose, producto }) => {
  const { token } = useAuth();
  const { colors } = useTheme();
  const [tab, setTab] = useState('info');
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    if (visible && producto?.id) {
      fetchMovimientos();
      setTab('info');
    }
  }, [visible, producto]);

  const fetchMovimientos = async () => {
    try {
      const res = await fetch(
        `https://inventory.nexusutd.online/inventory/products/${producto.id}/movements`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.movements) setMovimientos(data.movements);
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
    }
  };

  const handleAddMovement = async () => {
    try {
      const res = await fetch(
        `https://inventory.nexusutd.online/inventory/products/${producto.id}/movements`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: 'Alta',
            quantity: 1,
            comment: 'Alta rápida desde modal',
          }),
        }
      );
      const data = await res.json();
      if (data?.success || res.status === 200 || res.status === 201) {
        fetchMovimientos();
        Alert.alert('Éxito', 'Se ha registrado un movimiento.');
      }
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
    }
  };

  const handleEliminar = () => {
    Alert.alert('¿Eliminar producto?', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`https://inventory.nexusutd.online/inventory/products/${producto.id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Producto eliminado');
            onClose();
          } catch (error) {
            console.error('Error al eliminar:', error);
          }
        },
      },
    ]);
  };

  if (!producto) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <LinearGradient
          colors={['#f3f4f6', '#e5e7eb']}
          style={[styles.modal, { backgroundColor: colors.card }]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{producto.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={handleAddMovement} style={styles.iconBtn}>
                <Ionicons name="add-circle-outline" size={22} color="#16a34a" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEliminar} style={styles.iconBtn}>
                <Ionicons name="trash-outline" size={22} color="#dc2626" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.close, { color: colors.text }]}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tabBar}>
            <TouchableOpacity onPress={() => setTab('info')} style={[styles.tab, tab === 'info' && styles.tabActive]}>
              <Text style={[styles.tabText, tab === 'info' && styles.tabTextActive]}>Información</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('movs')} style={[styles.tab, tab === 'movs' && styles.tabActive]}>
              <Text style={[styles.tabText, tab === 'movs' && styles.tabTextActive]}>Movimientos</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 360 }}>
            {tab === 'info' && (
              <View style={styles.infoContainer}>
                <Image
                  source={{ uri: producto.image_url || 'https://via.placeholder.com/150' }}
                  style={styles.image}
                />
                <View style={styles.infoText}>
                  <Text style={styles.label}><Text style={styles.bold}>Stock actual:</Text> {producto.stock_actual} unidades</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Stock mínimo:</Text> {producto.stock_minimum ?? 'N/A'} unidades</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Stock máximo:</Text> {producto.stock_maximum ?? 'N/A'} unidades</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Marca:</Text> {producto.brand}</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Última actualización:</Text> {producto.last_updated}</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Descripción:</Text> {producto.description}</Text>
                </View>
              </View>
            )}

            {tab === 'movs' && (
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.th}>Fecha</Text>
                  <Text style={styles.th}>Hora</Text>
                  <Text style={styles.th}>Tipo</Text>
                  <Text style={styles.th}>Inicial</Text>
                  <Text style={styles.th}>Movido</Text>
                  <Text style={styles.th}>Final</Text>
                  <Text style={styles.th}>Comentario</Text>
                </View>
                {movimientos.map((mov, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={styles.td}>{mov.date?.slice(0, 10)}</Text>
                    <Text style={styles.td}>{mov.time}</Text>
                    <Text style={[styles.td, { color: mov.type === 'Alta' ? '#16a34a' : '#dc2626' }]}>{mov.type}</Text>
                    <Text style={styles.td}>{mov.stock_before}</Text>
                    <Text style={styles.td}>{mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}</Text>
                    <Text style={styles.td}>{mov.stock_after}</Text>
                    <Text style={styles.td}>{mov.comment}</Text>
                  </View>
                ))}
                {movimientos.length === 0 && (
                  <Text style={{ padding: 8, color: '#6b7280' }}>No hay movimientos registrados.</Text>
                )}
              </View>
            )}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.btnCerrar}>
            <LinearGradient colors={['#a4a4a4', '#6b6b6b']} style={styles.gradientButton}>
              <Text style={styles.btnCerrarText}>Cerrar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '95%',
    borderRadius: 16,
    padding: 16,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  close: {
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  iconBtn: {
    padding: 2,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderColor: '#1d4ed8',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#1d4ed8',
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  image: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  infoText: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 13,
  },
  bold: {
    fontWeight: 'bold',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    padding: 6,
  },
  th: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
  },
  td: {
    flex: 1,
    fontSize: 12,
  },
  btnCerrar: {
  alignSelf: 'center',
  borderRadius: 20,
  overflow: 'hidden',
  width: 120,
  height: 40,
  marginTop: 14,
},
  gradientButton: {
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnCerrarText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default DetalleProductoModal;
