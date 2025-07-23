// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ConfiguracionScreen from '../screens/config/ConfiguracionScreen';
import PreferenciasScreen from '../screens/config/PreferenciasScreen';
import UsuariosScreen from '../screens/config/users/UsuariosScreen';
import ConfiguracionSistemaScreen from '../screens/config/ConfiguracionSistemaScreen';
import Monitoreo from '../screens/monitoring/Monitoreo';
import MonitoreoTemperatura from '../screens/monitoring/MonitoreoTemperatura';
import MonitoreoHumedad from '../screens/monitoring/MonitoreoHumedad';
import MonitoreoAlertas from '../screens/monitoring/MonitoreoAlertas';
import InventarioTodos from '../screens/inventory/InventarioTodos';
import RegistrarProductos from '../screens/inventory/RegistrarProductos'; // ✅ Único y correcto
import CambiarContraseñaUsuario from '../screens/config/users/CambiarContraseñaUsuario';
import InventarioCaducidad from '../screens/inventory/InventarioCaducidad';
import InventarioSinStock from '../screens/inventory/InventarioSinStock';
import InventarioDebajo from '../screens/inventory/InventarioDebajo';
import InventarioCerca from '../screens/inventory/InventarioCerca';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import InventarioSobreStock from '../screens/inventory/InventarioSobreStock';
import FinanzasResumen from '../screens/finanzas/FinanzasResumen';
import FinanzasPrediccion from '../screens/finanzas/FinanzasPrediccion';
import FinanzasIA from '../screens/finanzas/FinanzasIA';






import CustomDrawer from './CustomDrawer';

const Drawer = createDrawerNavigator();

const CustomHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>NexStock</Text>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        header: () => <CustomHeader />,
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Inventario" component={InventoryScreen} />
      <Drawer.Screen name="Configuracion" component={ConfiguracionScreen} />
      <Drawer.Screen name="Usuarios" component={UsuariosScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="Preferencias" component={PreferenciasScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="ConfiguracionSistema" component={ConfiguracionSistemaScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="Monitoreo" component={Monitoreo} />
      <Drawer.Screen name="MonitoreoTemperatura" component={MonitoreoTemperatura} />
      <Drawer.Screen name="MonitoreoHumedad" component={MonitoreoHumedad} />
      <Drawer.Screen name="MonitoreoAlertas" component={MonitoreoAlertas} />

      <Drawer.Screen name="CambiarContraseñaUsuario" component={CambiarContraseñaUsuario} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="RegistrarProductos" component={RegistrarProductos} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="InventarioTodos" component={InventarioTodos} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="InventarioCaducidad" component={InventarioCaducidad} />
      <Drawer.Screen name="InventarioSinStock" component={InventarioSinStock} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="InventarioDebajo" component={InventarioDebajo} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="InventarioCerca" component={InventarioCerca} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="InventarioSobreStock" component={InventarioSobreStock} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="FinanzasEstado" component={FinanzasEstado} />
      <Drawer.Screen name="FinanzasResumen" component={FinanzasResumen} />
      <Drawer.Screen name="FinanzasPrediccion" component={FinanzasPrediccion} />
      <Drawer.Screen name="FinanzasIA" component={FinanzasIA} />




    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
  },
  logo: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
});

export default DrawerNavigator;
