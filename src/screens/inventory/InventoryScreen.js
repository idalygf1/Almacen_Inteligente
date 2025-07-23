import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text as RNText,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import RegistrarProductos from './RegistrarProductos';
import DetalleProductoModal from './DetalleProductoModal';
import HeaderBar from '../../components/HeaderBar';
import { LinearGradient } from 'expo-linear-gradient';
import socket from '../../services/socket';

const InventoryScreen = () => {
  const { token } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [detalleVisible, setDetalleVisible] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('https://inventory.nexusutd.online/inventory/home', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = async (productId) => {
    try {
      const res = await axios.get(`https://inventory.nexusutd.online/inventory/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.product) {
        setProductoDetalle(res.data.product);
        setDetalleVisible(true);
      }
    } catch (error) {
      console.error('Error al obtener detalles:', error);
    }
  };

  useEffect(() => {
    fetchInventory();

    socket.on('inventory_update', (payload) => {
      const { cardData } = payload;

      setInventory((prevInventory) => {
        if (!prevInventory || !cardData) return prevInventory;

        const updatedInventory = { ...prevInventory };

        Object.keys(updatedInventory).forEach((category) => {
          updatedInventory[category] = updatedInventory[category].map((product) => {
            if (product.id === cardData.id) {
              return { ...product, stock_actual: cardData.stock_actual };
            }
            return product;
          });
        });

        return updatedInventory;
      });
    });

    return () => {
      socket.off('inventory_update');
    };
  }, []);

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

  const renderCard = (product) => (
    <TouchableOpacity key={product.id} onPress={() => handleCardPress(product.id)}>
      <LinearGradient
        colors={[colors.primaryLight || '#dcdcdc', colors.primary || '#cccccc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.card}
      >
        <Image source={{ uri: product.image_url }} style={styles.image} />
        <RNText style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {product.name}
        </RNText>
        {'expiration_date' in product && (
          <RNText style={[styles.info, { color: colors.text }]}>
            Caduca: {product.expiration_date}
          </RNText>
        )}
        <RNText style={[styles.info, { color: colors.text }]}>
          Stock: {product.stock_actual}
        </RNText>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <>
      <HeaderBar customTitle="Inventario" />
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.filters}>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={styles.filterButton}
              onPress={() => navigation.navigate(screenMap[label])}
            >
              <LinearGradient
                colors={[colors.primaryLight || '#c7c7c7', colors.primary || '#999']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.filterGradient}
              >
                <RNText style={[styles.filterText, { color: colors.cardText }]}>{label}</RNText>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={() => setModalVisible(true)}>
          <LinearGradient
            colors={[colors.primaryLight || '#ccc', colors.primary || '#888']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradientButton}
          >
            <RNText style={[styles.buttonText, { color: colors.cardText }]}>
              Registrar producto
            </RNText>
          </LinearGradient>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <RNText style={[styles.modalTitle, { color: colors.text }]}>Registrar Producto</RNText>
              <RegistrarProductos onClose={() => setModalVisible(false)} />
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <RNText style={{ color: colors.primary, marginTop: 10, textAlign: 'center' }}>Cerrar</RNText>
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
              fetchInventory();
            }}
            producto={productoDetalle}
          />
        )}

        {inventory &&
          Object.entries(categoryLabels).map(([key, label]) => {
            const items = inventory[key];
            if (!items || items.length === 0) return null;
            return (
              <View key={key} style={styles.section}>
                <RNText style={[styles.sectionTitle, { color: colors.text }]}>{label}</RNText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {items.map(renderCard)}
                </ScrollView>
              </View>
            );
          })}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 80 },
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
    width: '40%',
  },
  gradientButton: {
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  section: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    marginLeft: 15,
  },
  card: {
    borderRadius: 16,
    padding: 19,
    marginRight: 20,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 10,
  },
  image: {
    width: 160,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  name: { fontWeight: 'bold', textAlign: 'center', fontSize: 14 },
  info: { fontSize: 12, textAlign: 'center' },
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

export default InventoryScreen;
