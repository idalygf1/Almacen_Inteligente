import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

const RegistrarProductos = ({ onClose, modoEdicion = false, producto = null }) => {
  const { token } = useAuth();

  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    category: '',
    unit_type: '',
    stock_min: '',
    stock_max: '',
    sensor_type: false,
    image: null,
  });

  useEffect(() => {
    if (modoEdicion && producto) {
      setForm({
        name: producto.name || '',
        brand: producto.brand || '',
        description: producto.description || '',
        category: producto.category?.toString() || '',
        unit_type: producto.unit_type?.toString() || '',
        stock_min: producto.stock_min?.toString() || '',
        stock_max: producto.stock_max?.toString() || '',
        sensor_type: producto.sensor_type === 'rfid',
        image: producto.image_url ? { uri: producto.image_url } : null,
      });
    }
  }, [modoEdicion, producto]);

  const handleInput = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      handleInput('image', result.assets[0]);
    }
  };

  const uploadImage = async () => {
    const imageData = new FormData();
    imageData.append('file', {
      uri: form.image.uri,
      name: 'producto.png',
      type: 'image/png',
    });

    const res = await fetch('https://inventory.nexusutd.online/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: imageData,
    });

    const data = await res.json();
    return data.image_url;
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = '';
      if (form.image) {
        if (form.image.uri && !form.image.uri.includes('http')) {
          imageUrl = await uploadImage();
        } else {
          imageUrl = form.image.uri;
        }
      }

      const body = {
        name: form.name,
        brand: form.brand,
        description: form.description,
        category: parseInt(form.category),
        unit_type: parseInt(form.unit_type),
        stock_min: parseInt(form.stock_min),
        stock_max: parseInt(form.stock_max),
        sensor_type: form.sensor_type ? 'rfid' : 'none',
        image_url: imageUrl,
      };

      const url = modoEdicion
        ? `https://inventory.nexusutd.online/inventory/products/${producto._id}`
        : `https://inventory.nexusutd.online/inventory/products`;

      const method = modoEdicion ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Alert.alert('Éxito', modoEdicion ? 'Producto actualizado' : 'Producto registrado');
        onClose();
      } else {
        Alert.alert('Error', 'Ocurrió un error al guardar el producto');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Error inesperado');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={form.name} onChangeText={(v) => handleInput('name', v)} />

      <Text style={styles.label}>Marca</Text>
      <TextInput style={styles.input} value={form.brand} onChangeText={(v) => handleInput('brand', v)} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        multiline
        value={form.description}
        onChangeText={(v) => handleInput('description', v)}
      />

      <Text style={styles.label}>Categoría</Text>
      <Picker selectedValue={form.category} onValueChange={(v) => handleInput('category', v)}>
        <Picker.Item label="Selecciona categoría" value="" />
        <Picker.Item label="Lácteos" value="1" />
        <Picker.Item label="Bebidas" value="2" />
      </Picker>

      <Text style={styles.label}>Unidad</Text>
      <Picker selectedValue={form.unit_type} onValueChange={(v) => handleInput('unit_type', v)}>
        <Picker.Item label="Selecciona unidad" value="" />
        <Picker.Item label="Piezas" value="1" />
        <Picker.Item label="Litros" value="2" />
      </Picker>

      <Text style={styles.label}>Stock mínimo</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={form.stock_min}
        onChangeText={(v) => handleInput('stock_min', v)}
      />

      <Text style={styles.label}>Stock máximo</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={form.stock_max}
        onChangeText={(v) => handleInput('stock_max', v)}
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Sensor RFID</Text>
        <Switch value={form.sensor_type} onValueChange={(v) => handleInput('sensor_type', v)} />
      </View>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Seleccionar imagen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 },
  button: {
    marginTop: 16,
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default RegistrarProductos;
