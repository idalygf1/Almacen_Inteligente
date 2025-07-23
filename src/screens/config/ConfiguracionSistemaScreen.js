import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import ColorPicker from 'react-native-wheel-color-picker';

export default function ConfiguracionSistemaScreen() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colors, fetchColorsFromBackend } = useTheme();

  const fetchConfig = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get('https://auth.nexusutd.online/auth/config', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfig(response.data);
    } catch (error) {
      console.error('Error al obtener configuración:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo obtener la configuración del sistema.');
    } finally {
      setLoading(false);
    }
  };

  const guardarCambios = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const body = {
        color_primary: config.color_primary,
        color_secondary: config.color_secondary,
      };
      const response = await axios.patch(
        'https://auth.nexusutd.online/auth/config',
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      await fetchColorsFromBackend();

      Alert.alert('✅ Éxito', response.data.message || 'Colores actualizados correctamente');
    } catch (error) {
      console.error('Error al guardar:', error.response?.data || error.message);
      Alert.alert('❌ Error', 'No se pudo guardar el color');
    }
  };

  const actualizarColor = (key, color) => {
    setConfig((prev) => ({ ...prev, [key]: color }));
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (loading || !config) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: config.logo_url || 'https://via.placeholder.com/80' }}
            style={[styles.logo, { borderColor: colors.primary }]}
          />
        </View>

        {/* NOMBRE */}
        <Text style={[styles.label, { color: colors.text }]}>Nombre de la empresa</Text>
        <View style={[styles.inputMock, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Text style={[styles.inputText, { color: colors.text }]}>{config.company_name || 'Empresa'}</Text>
        </View>

        {/* COLOR PRIMARIO */}
        <Text style={[styles.label, { color: colors.text, marginTop: 20 }]}>Color principal de la app</Text>
        <Text style={[styles.colorLabel, { color: colors.text }]}>Color primario</Text>
        <ColorPicker
          color={config.color_primary}
          onColorChangeComplete={(color) => actualizarColor('color_primary', color)}
          thumbSize={30}
          sliderSize={20}
          style={{ width: '100%', height: 200, marginBottom: 30 }}
        />

        {/* COLOR SECUNDARIO */}
        
        <Text style={[styles.label, { color: colors.text }]}>Color secundario - Cards</Text>
        <ColorPicker
          color={config.color_secondary}
          onColorChangeComplete={(color) => actualizarColor('color_secondary', color)}
          thumbSize={30}
          sliderSize={20}
          style={{ width: '100%', height: 200, marginBottom: 30 }}
        />

        {/* BOTONES */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.cancelButton, {
              backgroundColor: colors.cancel,
              borderColor: colors.primary,
            }]}
            onPress={fetchConfig}
          >
            <Text style={[styles.cancelText, { color: colors.primary }]}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={guardarCambios}
          >
            <Text style={styles.saveText}>Guardar cambios</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputMock: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputText: {
    fontSize: 16,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 55,
    gap: 15,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  cancelText: {
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});
