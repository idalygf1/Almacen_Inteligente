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
import { useLanguage } from '../../context/LanguageContext';

const COLORES_DISPONIBLES = [
  '#0033ff', '#00cc99', '#ffcc00',
  '#1e40af', '#3b82f6', '#000000',
  '#ffffff', '#e11d48', '#9333ea', '#16a34a'
];

const LANGUAGES = [
  { code: 'es', flag: '🇲🇽' },
  { code: 'ne', flag: '🇳🇪' },
  { code: 'en', flag: '🇱🇷' },
  { code: 'fr', flag: '🇫🇷' },
  { code: 'it', flag: '🇮🇹' },
  { code: 'pt', flag: '🇵🇹' },
  { code: 'zh', flag: '🇨🇳' },
  { code: 'de', flag: '🇩🇪' },
  { code: 'ar', flag: '🇸🇦' },
  { code: 'ja', flag: '🇯🇵' },
  { code: 'ru', flag: '🇷🇺' },
];

export default function ConfiguracionSistemaScreen() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language, changeLanguage, t } = useLanguage();

  const fetchConfig = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get('https://auth.nexusutd.online/auth/config', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        color_tertiary: config.color_tertiary,
      };

      const response = await axios.put(
        '',
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('✅ Éxito', response.data.message || 'Colores actualizados correctamente');
    } catch (error) {
      console.error('Error al guardar:', error.response?.data || error.message);
      Alert.alert('❌ Error', 'No se pudieron guardar los cambios');
    }
  };

  const actualizarColor = (key, color) => {
    setConfig((prev) => ({
      ...prev,
      [key]: color,
    }));
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (loading || !config) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.card}>
        {/* Logo */}
        <Text style={styles.sectionTitle}>{t('logo')}</Text>
        <Image source={{ uri: config.logo_url }} style={styles.logo} />
        <Text style={styles.subtext}>El logo se carga desde el backend</Text>

        {/* Paleta de colores */}
        <Text style={styles.sectionTitle}>{t('color_palette')}</Text>

        {[ 
          { label: t('primary'), key: 'color_primary' },
          { label: t('secondary'), key: 'color_secondary' },
          { label: t('tertiary'), key: 'color_tertiary' },
        ].map((item) => (
          <View key={item.key} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.colorRow}>
              {COLORES_DISPONIBLES.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => actualizarColor(item.key, color)}
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: color,
                      borderWidth: config[item.key] === color ? 3 : 1,
                      borderColor: config[item.key] === color ? '#000' : '#ccc',
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Idioma */}
        <Text style={styles.sectionTitle}>{t('language')}</Text>
        <View style={styles.langRow}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text
                style={[
                  styles.langCircle,
                  {
                    borderColor: language === lang.code ? '#000' : '#ccc',
                    borderWidth: language === lang.code ? 2 : 1,
                  },
                ]}
              >
                {lang.flag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={guardarCambios}>
          <Text style={styles.saveButtonText}>{t('save_changes')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#1e293b',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#334155',
  },
  subtext: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#475569',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  langCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
