import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CustomDrawer = ({ navigation }) => {
  const { colors } = useTheme();
  const [openSection, setOpenSection] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Urbanist-Regular': require('../../assets/fonts/Urbanist-Regular.ttf'),
        'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection(openSection === section ? null : section);
  };

  const renderSubItem = (label, route) => (
    <TouchableOpacity
      key={label}
      style={styles.subItem}
      onPress={() => navigation.navigate(route)}
    >
      <Text style={[styles.subItemText, { color: colors.text, fontFamily: 'Urbanist-Regular' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Encabezado */}
        <LinearGradient
          colors={colors.mode === 'dark' ? ['#333', '#111'] : ['#dbdbdb', '#c6c6c6']}
          style={styles.header}
        >
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <Text style={[styles.appName, { color: colors.text }]}>NEXSTOCK</Text>
        </LinearGradient>

        {/* Menú principal */}
        <DrawerItem icon="home-outline" label="Inicio" onPress={() => navigation.navigate('Home')} colors={colors} />

        <DrawerItem
          icon="card-outline"
          label="Finanzas"
          expandable
          expanded={openSection === 'finanzas'}
          onPress={() => toggleSection('finanzas')}
          colors={colors}
        />
        {openSection === 'finanzas' && (
          <>
            {renderSubItem('Estado', 'FinanzasEstado')}
            {renderSubItem('Nómina', 'FinanzasNomina')}
            {renderSubItem('IA', 'FinanzasIA')}
            {renderSubItem('Análisis', 'FinanzasAnalisis')}
          </>
        )}

        <DrawerItem
          icon="cube-outline"
          label="Inventario"
          expandable
          expanded={openSection === 'inventario'}
          onPress={() => {
            navigation.navigate('Inventario');
            toggleSection('inventario');
          }}
          colors={colors}
        />
        {openSection === 'inventario' && (
          <>
            {renderSubItem('Todos', 'InventarioTodos')}
            {renderSubItem('Próximos a caducar', 'InventarioCaducidad')}
            {renderSubItem('Sin stock', 'InventarioSinStock')}
            {renderSubItem('Stock debajo del mínimo', 'InventarioDebajo')}
            {renderSubItem('Stock cerca del mínimo', 'InventarioCerca')}
            {renderSubItem('SobreStock', 'InventarioSobreStock')}
            {renderSubItem('Lista de compras', 'InventarioListaCompras')}
          </>
        )}

        <DrawerItem
          icon="analytics-outline"
          label="Monitoreo"
          expandable
          expanded={openSection === 'monitoreo'}
          onPress={() => {
            navigation.navigate('Monitoreo');
            toggleSection('monitoreo');
          }}
          colors={colors}
        />
        {openSection === 'monitoreo' && (
          <>
            {renderSubItem('Temperatura', 'MonitoreoTemperatura')}
            {renderSubItem('Humedad', 'MonitoreoHumedad')}
            {renderSubItem('Alertas', 'MonitoreoAlertas')}
          </>
        )}

        <DrawerItem
          icon="settings-outline"
          label="Configuración"
          onPress={() => navigation.navigate('Configuracion')}
          colors={colors}
        />

        <View style={[styles.divider, { backgroundColor: colors.card }]} />

        <DrawerItem
          icon="log-out-outline"
          label="Cerrar sesión"
          onPress={handleLogout}
          colors={colors}
        />

        <Text style={[styles.footer, { color: colors.text, fontFamily: 'Urbanist-Regular' }]}>
          © NexStock 2025
        </Text>
      </ScrollView>
    </View>
  );
};

const DrawerItem = ({ icon, label, onPress, colors, expandable, expanded }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={20} color={colors.text} style={styles.icon} />
    <Text style={[styles.menuText, { color: colors.text, fontFamily: 'Urbanist-Bold' }]}>{label}</Text>
    {expandable && (
      <Ionicons
        name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
        size={16}
        color={colors.text}
        style={styles.arrow}
      />
    )}
  </TouchableOpacity>
);

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 12,
  },
  arrow: {
    marginLeft: 'auto',
  },
  menuText: {
    fontSize: 16,
  },
  subItem: {
    paddingLeft: 50,
    paddingVertical: 10,
  },
  subItemText: {
    fontSize: 14,
  },
  divider: {
    height: 1.5,
    marginVertical: 25,
    marginHorizontal: 25,
    borderRadius: 10,
    opacity: 0.5,
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 15,
  },
});
