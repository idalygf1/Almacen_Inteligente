import React, { useState } from 'react';
import {
  Modal,
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
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';

const ModalRegistrarProducto = ({ visible, onClose }) => {
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
        imageUrl = await uploadImage();
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

      const res = await fetch('https://inventory.nexusutd.online/inventory/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Alert.alert('Éxito', 'Producto registrado correctamente');
        onClose();
      } else {
        Alert.alert('Error', 'Ocurrió un error al registrar el producto');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Error inesperado');
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.title}>Registrar nuevo producto</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} onChangeText={(v) => handleInput('name', v)} />

            <Text style={styles.label}>Marca</Text>
            <TextInput style={styles.input} onChangeText={(v) => handleInput('brand', v)} />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              multiline
              onChangeText={(v) => handleInput('description', v)}
            />

            <Text style={styles.label}>Categoría</Text>
            <Picker
              selectedValue={form.category}
              onValueChange={(v) => handleInput('category', v)}
            >
              <Picker.Item label="Selecciona categoría" value="" />
              <Picker.Item label="Lácteos" value="1" />
              <Picker.Item label="Bebidas" value="2" />
            </Picker>

            <Text style={styles.label}>Unidad</Text>
            <Picker
              selectedValue={form.unit_type}
              onValueChange={(v) => handleInput('unit_type', v)}
            >
              <Picker.Item label="Selecciona unidad" value="" />
              <Picker.Item label="Piezas" value="1" />
              <Picker.Item label="Litros" value="2" />
            </Picker>

            <Text style={styles.label}>Stock mínimo</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              onChangeText={(v) => handleInput('stock_min', v)}
            />

            <Text style={styles.label}>Stock máximo</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              onChangeText={(v) => handleInput('stock_max', v)}
            />

            <View style={styles.switchRow}>
              <Text style={styles.label}>Sensor RFID</Text>
              <Switch
                value={form.sensor_type}
                onValueChange={(v) => handleInput('sensor_type', v)}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>Seleccionar imagen</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.buttonText, { color: 'gray' }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles.buttonText, { color: '#007bff' }]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalRegistrarProducto;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
  },
  button: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#666',
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
