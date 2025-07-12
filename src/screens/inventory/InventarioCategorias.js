import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const InventarioCategoria = ({ categoria }) => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    try {
      const res = await axios.get(
        'https://inventory.nexusutd.online/inventory/products/general?page=1&limit=1000',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('📦 Productos cargados:', res.data);
      setData(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const productosFiltrados = data.filter((p) => p.category === categoria);

  const renderCard = (item) => (
    <View key={item.id} style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.info}>Stock: {item.stock_actual}</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inventario</Text>
      <Text style={styles.sectionTitle}>{categoria}</Text>

      {productosFiltrados.length > 0 ? (
        <View style={styles.grid}>{productosFiltrados.map(renderCard)}</View>
      ) : (
        <Text style={styles.noData}>No hay productos registrados en esta categoría.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    padding: 12,
    width: 140,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  info: {
    fontSize: 12,
    textAlign: 'center',
  },
  noData: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default InventarioCategoria;
