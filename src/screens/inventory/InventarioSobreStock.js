import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import axios from 'axios';
import socket from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import RegistrarProductos from './RegistrarProductos';
import DetalleProductoModal from './DetalleProductoModal';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HeaderBar from '../../components/HeaderBar';

const InventarioSobreStock = () => {
  const { token } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [detalleVisible, setDetalleVisible] = useState(false);

  const fetchProductos = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        'https://inventory.nexusutd.online/inventory/products?status=overstock&page=1&limit=1000',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (Array.isArray(res.data.products)) {
        setProductos(res.data.products);
      } else {
        console.warn('Respuesta inesperada:', res.data);
        setProductos([]);
      }
    } catch (error) {
      console.error('Error al cargar productos sobrestock:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = async (productId) => {
    try {
      const res = await axios.get(`https://inventory.nexusutd.online/inventory/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.product) {
        setProductoDetalle({ ...res.data.product, id: res.data.product._id });
        setDetalleVisible(true);
      }
    } catch (error) {
      console.error('Error al obtener detalles del producto:', error);
    }
  };

  useEffect(() => {
    socket.connect();

    const handleInventoryUpdate = (payload) => {
      const { cardData } = payload;
      if (!cardData || !cardData.id) return;

      setProductos((prev) =>
        prev.map((p) => (p.id === cardData.id ? { ...p, stock_actual: cardData.stock_actual } : p))
      );
    };

    socket.on('inventory_update', handleInventoryUpdate);

    return () => {
      socket.off('inventory_update', handleInventoryUpdate);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [token]);

  const categoryLabels = {
    expired_soon: 'Próximos a caducar',
    out_of_stock: 'Sin stock',
    below_minimum: 'Debajo del mínimo',
    near_minimum: 'Cerca del mínimo',
    overstock: 'Sobrestock',
    all: 'Todos',
  };

  const screenMap = {
    'Próximos a caducar': 'InventarioCaducidad',
    'Sin stock': 'InventarioSinStock',
    'Debajo del mínimo': 'InventarioDebajo',
    'Cerca del mínimo': 'InventarioCerca',
    'Sobrestock': 'InventarioSobreStock',
    'Todos': 'InventarioTodos',
  };

  const renderCard = (item) => (
    <LinearGradient
      key={item.id}
      colors={[colors.primaryLight, colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.card}
    >
      <TouchableOpacity style={styles.editIcon} onPress={() => handleCardPress(item.id)}>
        <Ionicons name="pencil-outline" size={16} color="#333" />
      </TouchableOpacity>

      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/70' }}
        style={styles.image}
      />
      <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.info, { color: colors.text }]}>Stock: {item.stock_actual}</Text>
    </LinearGradient>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <>
      <HeaderBar customTitle="Sobre Stock" />
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.filters}>
          {Object.entries(categoryLabels).map(([key, label]) => {
            const isActive = label === 'Sobrestock';
            return (
              <TouchableOpacity
                key={key}
                style={styles.filterButton}
                onPress={() => navigation.navigate(screenMap[label])}
              >
                <LinearGradient
                  colors={
                    isActive
                      ? [colors.primaryLight, colors.primary]
                      : colors.mode === 'dark'
                      ? ['#444', '#111']
                      : ['#e5e5e5', '#d4d4d4']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.filterGradient}
                >
                  <Text style={[styles.filterText, { color: isActive ? '#fff' : colors.text }]}>
                    {label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={() => setModalVisible(true)}>
          <LinearGradient
            colors={colors.mode === 'dark' ? ['#555', '#111'] : ['#ccc', '#fff']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={[styles.buttonText, { color: colors.mode === 'dark' ? '#fff' : '#000' }]}>
              Registrar producto
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Registrar Producto</Text>
              <RegistrarProductos onClose={() => setModalVisible(false)} />
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.primary, marginTop: 10, textAlign: 'center' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {productoDetalle && (
          <DetalleProductoModal
            visible={detalleVisible}
            onClose={() => {
              setDetalleVisible(false);
              setProductoDetalle(null);
              fetchProductos();
            }}
            producto={productoDetalle}
          />
        )}

        {productos.length > 0 ? (
          <View style={styles.grid}>{productos.map(renderCard)}</View>
        ) : (
          <Text style={[styles.noData, { color: colors.text }]}>No hay productos en sobrestock.</Text>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 800,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  filterButton: {
    borderRadius: 20,
    margin: 5,
  },
  filterGradient: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    alignSelf: 'center',
    marginBottom: 25,
    width: '45%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 14,
    padding: 14,
    width: 145,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  },
  image: {
    width: 160,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 4,
  },
  info: {
    fontSize: 12,
    textAlign: 'center',
  },
  editIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 14,
    padding: 4,
    zIndex: 10,
  },
  noData: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 16,
    borderRadius: 16,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default InventarioSobreStock;
