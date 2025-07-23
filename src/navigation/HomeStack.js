// src/navigation/HomeStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AcercaScreen from '../screens/AcercaScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Acerca" component={AcercaScreen} /> {/* ✅ Aquí sí */}
    </Stack.Navigator>
  );
}
