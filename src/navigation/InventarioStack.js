// src/navigation/InventarioStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import InventarioTodos from '../screens/inventory/InventarioTodos';
import InventarioCaducidad from '../screens/inventory/InventarioCaducidad';
import InventarioSinStock from '../screens/inventory/InventarioSinStock';
import InventarioDebajo from '../screens/inventory/InventarioDebajo';
import InventarioCerca from '../screens/inventory/InventarioCerca';
import InventarioSobreStock from '../screens/inventory/InventarioSobreStock';
import InventarioListaCompras from '../screens/inventory/InventarioListaCompras';

const Stack = createNativeStackNavigator();

const InventarioStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="InventoryScreen" component={InventoryScreen} />
    <Stack.Screen name="InventarioTodos" component={InventarioTodos} />
    <Stack.Screen name="InventarioCaducidad" component={InventarioCaducidad} />
    <Stack.Screen name="InventarioSinStock" component={InventarioSinStock} />
    <Stack.Screen name="InventarioDebajo" component={InventarioDebajo} />
    <Stack.Screen name="InventarioCerca" component={InventarioCerca} />
    <Stack.Screen name="InventarioSobreStock" component={InventarioSobreStock} />
    <Stack.Screen name="InventarioListaCompras" component={InventarioListaCompras} />
  </Stack.Navigator>
);

export default InventarioStack;
