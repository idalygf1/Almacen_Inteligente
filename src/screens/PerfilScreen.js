import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import HeaderBar from '../components/HeaderBar';

export default function PerfilScreen() {
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const [fullUser, setFullUser] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Urbanist-Regular': require('./../../assets/fonts/Urbanist-Regular.ttf'),
        'Urbanist-Bold': require('./../../assets/fonts/Urbanist-Bold.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (token && storedUser) {
        const currentUser = JSON.parse(storedUser);

        try {
          const response = await fetch('https://auth.nexusutd.online/auth/users', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          if (response.status === 200 && data.users) {
            const matchedUser = data.users.find(u => u.username === currentUser.username);
            setFullUser(matchedUser || currentUser);
          } else {
            setFullUser(currentUser);
          }
        } catch (error) {
          console.error('Error al obtener usuario completo:', error);
          setFullUser(currentUser);
        }

        setUser(currentUser);
      }
    };

    loadUserData();
  }, []);

  if (!fontsLoaded || !user || !fullUser) return null;

  const gradientColors = colors.mode === 'dark'
    ? ['#333333', '#111111']
    : ['#dbdbdb', '#c6c6c6'];

  return (
    <>
      <HeaderBar title="Perfil" />
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={gradientColors} style={styles.header}>
          <Image source={require('../../assets/usuario.png')} style={styles.avatar} />
          <Text style={[styles.name, { color: colors.text }]}>
            {fullUser.first_name} {fullUser.last_name}
          </Text>
          <Text style={[styles.username, { color: colors.subtext || colors.text }]}>
            {fullUser.username}
          </Text>
        </LinearGradient>

        <LinearGradient
          colors={colors.mode === 'dark' ? ['#333333', '#111111'] : ['#dbdbdb', '#c6c6c6']}
          style={styles.card}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Información del usuario</Text>

          <View style={styles.infoGroup}>
            <MaterialIcons name="alternate-email" size={22} color={colors.text} />
            <View style={styles.infoTextGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Usuario</Text>
              <Text style={[styles.value, { color: colors.text }]}>{fullUser.username}</Text>
            </View>
          </View>

          <View style={styles.infoGroup}>
            <MaterialIcons name="badge" size={22} color={colors.text} />
            <View style={styles.infoTextGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Rol</Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {fullUser.role?.name || fullUser.role}
              </Text>
            </View>
          </View>

          <View style={styles.infoGroup}>
            <MaterialIcons name="fingerprint" size={22} color={colors.text} />
            <View style={styles.infoTextGroup}>
              <Text style={[styles.label, { color: colors.text }]}>ID</Text>
              <Text style={[styles.value, { color: colors.text }]}>{fullUser.id}</Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 70,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#ccc',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    fontFamily: 'Urbanist-Regular',
    fontStyle: 'italic',
  },
  card: {
    marginTop: 30,
    marginHorizontal: 10,
    borderRadius: 20,
    padding: 40,
    elevation: 6,
    shadowColor: '#727070',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 20,
    top: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Urbanist-Regular',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
  },
  headerCard: {
    marginTop: 30,
    marginHorizontal: 30,
    borderRadius: 20,
    padding: 25,
    elevation: 6,
    alignItems: 'center',
    shadowColor: '#727070',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  centeredInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTextGroup: {
    flexDirection: 'column',
  },
});
