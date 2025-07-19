import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HeaderBar from '../../components/HeaderBar';

const InventarioSinStock = () => {
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
        'https://inventory.nexusutd.online/inventory/products?status=out_of_stock&page=1&limit=1000',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(res.data.products)) {
        setProductos(res.data.products);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error('Error al cargar productos sin stock:', error);
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
      if (res.data?.product) {
        setProductoDetalle({ ...res.data.product, id: res.data.product._id });
        setDetalleVisible(true);
      }
    } catch (error) {
      console.error('Error al obtener detalles del producto:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
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
    <LinearGradient
      key={product.id}
      colors={['#ff9595', '#c15b5b']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.card}
    >
      <TouchableOpacity
        style={styles.editIcon}
        onPress={() => handleCardPress(product.id)}
      >
        <Ionicons name="pencil-outline" size={16} color="#333" />
      </TouchableOpacity>

      <Image
        source={{ uri: product.image_url || 'https://via.placeholder.com/70' }}
        style={styles.image}
      />
      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
      <Text style={styles.info}>Stock: {product.stock_actual}</Text>
    </LinearGradient>
  );

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

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <>
      <HeaderBar customTitle="Sin Stock" />

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>

        <View style={styles.filters}>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={styles.filterButton}
              onPress={() => navigation.navigate(screenMap[label])}
            >
              <LinearGradient
                colors={label === 'Sin stock' ? ['#979797', '#4a4b54'] : ['#c7c7c7', '#c7c7c7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.filterGradient}
              >
                <Text style={[styles.filterText, { color: label === 'Sin stock' ? 'white' : colors.text }]}>
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
              fetchProductos();
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
          <Text style={[styles.noData, { color: colors.text }]}>No hay productos sin stock.</Text>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 250 },
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
  editIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    borderRadius: 20,
    padding: 4,
    zIndex: 2,
  },
});

export default InventarioSinStock;
