import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; // ✅ Agregado

import HomeScreen from '../screens/HomeScreen';
import FinanzasStack from './FinanzasStack';
import InventarioStack from './InventarioStack';
import MonitoreoStack from './MonitoreoStack';
import ConfiguracionStack from './ConfiguracionStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { colors } = useTheme(); // ✅ Usando colores del contexto

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Inicio':
              iconName = 'home-outline';
              break;
            case 'Finanzas':
              iconName = 'card-outline';
              break;
            case 'Inventario':
              iconName = 'cube-outline';
              break;
            case 'Monitoreo':
              iconName = 'analytics-outline';
              break;
            case 'Configuración':
              iconName = 'settings-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.button, // ✅ Cambiado dinámicamente
        tabBarInactiveTintColor: colors.text + '80', // gris claro u oscuro
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: 'transparent',
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Monitoreo" component={MonitoreoStack} />
      <Tab.Screen name="Inventario" component={InventarioStack} />
      <Tab.Screen name="Finanzas" component={FinanzasStack} />
      <Tab.Screen name="Configuración" component={ConfiguracionStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
