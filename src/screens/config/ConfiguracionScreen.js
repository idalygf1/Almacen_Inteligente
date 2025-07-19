import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import HeaderBar from '../../components/HeaderBar'; // 👈🏼 se agregó el header

export default function ConfiguracionScreen({ navigation }) {
  const { theme, colors } = useTheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const getIcon = (light, dark) => (theme === 'dark' ? dark : light);
  const isDark = theme === 'dark';

  const settings = [
    {
      title: 'U S U A R I O S',
      img: getIcon(
        require('../../../assets/usuarios.png'),
        require('../../../assets/usuarios-blanco.png')
      ),
      route: 'Usuarios',
    },
    {
      title: 'P R E F E R E N C I A S',
      img: require('../../../assets/paleta.png'),
      route: 'Preferencias',
    },
    {
      title: 'C O N F I G U R A C I Ó N\nD E L   S I S T E M A',
      img: getIcon(
        require('../../../assets/configuracion.png'),
        require('../../../assets/configuracion-blanco.png')
      ),
      route: 'ConfiguracionSistema',
    },
  ];

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Urbanist-Regular': require('./../../../assets/fonts/Urbanist-Regular.ttf'),
        'Urbanist-Bold': require('./../../../assets/fonts/Urbanist-Bold.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar customTitle="Configuración" />


      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >

        {settings.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.9}
            style={styles.touchable}
          >
            <LinearGradient
              colors={isDark ? ['#2b2b2b', '#1f1f1f'] : ['#ffffff', '#bbbcc1']}
              style={styles.card}
            >
              <Image source={item.img} style={styles.icon} />
              <Text style={[styles.cardText, { color: colors.text }]}>{item.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    paddingBottom: 800,
  },
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  touchable: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 26,
  },
  card: {
    width: '60%',
    borderRadius: 20,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    textAlign: 'center',
    lineHeight: 26,
  },
});
