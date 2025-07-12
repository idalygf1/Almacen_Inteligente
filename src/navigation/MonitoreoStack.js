// src/navigation/MonitoreoStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Monitoreo from '../screens/monitoring/Monitoreo';
import MonitoreoTemperatura from '../screens/monitoring/MonitoreoTemperatura';
import MonitoreoHumedad from '../screens/monitoring/MonitoreoHumedad';
import MonitoreoAlertas from '../screens/monitoring/MonitoreoAlertas';

const Stack = createNativeStackNavigator();

const MonitoreoStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MonitoreoInicio" component={Monitoreo} />
    <Stack.Screen name="MonitoreoTemperatura" component={MonitoreoTemperatura} />
    <Stack.Screen name="MonitoreoHumedad" component={MonitoreoHumedad} />
    <Stack.Screen name="MonitoreoAlertas" component={MonitoreoAlertas} />
  </Stack.Navigator>
);

export default MonitoreoStack;
