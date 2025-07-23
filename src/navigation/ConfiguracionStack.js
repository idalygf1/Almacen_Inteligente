import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConfiguracionScreen from '../screens/config/ConfiguracionScreen';
import UsuariosScreen from '../screens/config/users/UsuariosScreen';
import PreferenciasScreen from '../screens/config/PreferenciasScreen';
import ConfiguracionSistemaScreen from '../screens/config/ConfiguracionSistemaScreen';


const Stack = createNativeStackNavigator();

export default function ConfiguracionStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Configuracion" component={ConfiguracionScreen} />
      <Stack.Screen name="Usuarios" component={UsuariosScreen} />
      <Stack.Screen name="Preferencias" component={PreferenciasScreen} />
      <Stack.Screen name="ConfiguracionSistema" component={ConfiguracionSistemaScreen} />
    </Stack.Navigator>
  );
}
