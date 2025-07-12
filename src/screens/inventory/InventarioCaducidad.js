// InventarioCaducidad.js
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
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import RegistrarProductos from './RegistrarProductos';
import DetalleProductoModal from './DetalleProductoModal';
import HeaderBar from '../../components/HeaderBar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const InventarioCaducidad = () => {
  const { token } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [detalleVisible, setDetalleVisible] = useState(false);

  const fetchCaducidad = async () => {
    try {
      const res = await axios.get(
        'https://inventory.nexusutd.online/inventory/products?status=expiring&page=1&limit=1000',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProductos(res.data.products || []);
    } catch (error) {
      console.error('Error al cargar productos por caducidad:', error);
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
      console.error('Error al obtener detalles del producto:', error);
    }
  };

  useEffect(() => {
    fetchCaducidad();
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

  const groupByCategory = () => {
    const grouped = {};
    productos.forEach((producto) => {
      const categoria = producto.category || 'Sin categoría';
      if (!grouped[categoria]) grouped[categoria] = [];
      grouped[categoria].push(producto);
    });
    return grouped;
  };

  const groupedProductos = groupByCategory();

  const renderCard = (item) => (
    <LinearGradient
      colors={['#fcdcdc', '#f87171']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.card}
      key={item.id}
    >
      <TouchableOpacity style={styles.editIcon} onPress={() => handleCardPress(item.id)}>
        <Ionicons name="pencil-outline" size={16} color="#333" />
      </TouchableOpacity>

      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/70' }}
        style={styles.image}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.info}>Stock: {item.stock_actual}</Text>
      <Text style={styles.info}>Caduca: {item.expiration_date?.slice(0, 10)}</Text>
    </LinearGradient>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <>
      <HeaderBar />
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>P R Ó X I M O S  A  C A D U C A R</Text>

        <View style={styles.filters}>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={styles.filterButton}
              onPress={() => navigation.navigate(screenMap[label])}
            >
              <LinearGradient
                colors={label === 'Próximos a caducar' ? ['#979797', '#4a4b54'] : ['#c7c7c7', '#c7c7c7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.filterGradient}
              >
                <Text style={[styles.filterText, { color: label === 'Próximos a caducar' ? 'white' : colors.text }]}>
                  {label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
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
              fetchCaducidad();
            }}
            producto={productoDetalle}
          />
        )}

        {productos.length > 0 ? (
          Object.entries(groupedProductos).map(([categoria, productosCategoria]) => (
            <View key={categoria} style={{ marginBottom: 28 }}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{categoria}</Text>
              </View>
              <View style={styles.grid}>{productosCategoria.map(renderCard)}</View>
            </View>
          ))
        ) : (
          <Text style={[styles.noData, { color: colors.text }]}>
            No hay productos próximos a caducar.
          </Text>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 800 },
  title: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 20,
    alignSelf: 'center',
    letterSpacing: 1.5,
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
    color: '#000',
  },
  info: {
    fontSize: 12,
    textAlign: 'center',
    color: '#1f2937',
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
  editIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    borderRadius: 20,
    padding: 4,
    zIndex: 1,
  },
  categoryHeader: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#78766b',
    marginBottom: 10,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1f2937',
  },
});

export default InventarioCaducidad;
