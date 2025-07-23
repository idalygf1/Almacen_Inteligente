import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { ColorPicker } from 'react-native-color-picker';

export default function HeaderBar({ customTitle }) {
  const { colors } = useTheme();
  const { logout } = useAuth();
  const route = useRoute();
  const [userName, setUserName] = useState('');
  const [logoUrl, setLogoUrl] = useState(null);
  const [companyName, setCompanyName] = useState('');

  const getTitleForRoute = (routeName) => {
    switch (routeName) {
      case 'Monitoreo':
        return 'Monitoreo';
      case 'MonitoreoTemperatura':
        return 'Temperatura';
      case 'MonitoreoHumedad':
        return 'Humedad';
      case 'MonitoreoAlertas':
        return 'Alertas';
      default:
        return 'HOY';
    }
  };

  const title = customTitle || getTitleForRoute(route.name);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const storedUser = await AsyncStorage.getItem('user');
      if (!token || !storedUser) return;

      const currentUser = JSON.parse(storedUser);

      try {
        const resUser = await fetch(
          `https://auth.nexusutd.online/auth/users/${currentUser.id}/details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userData = await resUser.json();
        if (resUser.status === 200 && userData.user) {
          const firstName = userData.user.first_name?.split(' ')[0] || '';
          setUserName(`Hola, ${firstName}`);
        }

        const resConfig = await fetch(
          'https://auth.nexusutd.online/auth/config',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const configData = await resConfig.json();
        if (resConfig.status === 200) {
          if (configData.logo_url) setLogoUrl(configData.logo_url);
          if (configData.company_name) setCompanyName(configData.company_name);
        }
      } catch (error) {
        console.error('Error al obtener información:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('accessToken');
              await AsyncStorage.removeItem('user');
              logout();
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
  colors={
    colors.mode === 'dark'
      ? [colors.primary, '#111']
      : [colors.primary, '#c6c6c6']
  }
  style={styles.container}
>

      {/* IZQUIERDA */}
      <View style={styles.left}>
        {logoUrl && <Image source={{ uri: logoUrl }} style={styles.logo} />}
        <Text style={[styles.company, { color: colors.text }]}>
          {companyName}
        </Text>
      </View>

      {/* CENTRO */}
      <Text style={[styles.center, { color: colors.text }]}>
        {title}
      </Text>

      {/* DERECHA */}
      <View style={styles.right}>
        <Text style={[styles.userName, { color: colors.text }]}>
          {userName}
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 55,
    paddingBottom: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  company: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
  },
  center: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '900',
    fontFamily: 'Urbanist-Bold',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    textAlign: 'right',
    maxWidth: 150,
  },
});
