// HeaderBar.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function HeaderBar() {
  const { token } = useAuth();
  const { colors } = useTheme();
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get('https://auth.nexusutd.online/auth/config', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogoUrl(res.data.logo_url);
      } catch (error) {
        console.error('Error al obtener configuración del sistema:', error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      {/* Espacio izquierdo */}
      <View style={{ width: 65 }} />

      {/* Título centrado */}
      <Text style={[styles.title, { color: colors.text }]}>NexStock</Text>

      {/* Logo a la derecha */}
      {logoUrl && (
        <Image
          source={{ uri: logoUrl }}
          style={styles.logo}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Urbanist-Bold',
  },
  logo: {
    width: 65,
    height: 65,
    borderRadius: 8,
  },
});
