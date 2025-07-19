// src/navigation/FinanzasStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FinanzasEstado from '../screens/finances/FinanzasEstado';
import FinanzasPrediccion from '../screens/finances/FinanzasPrediccion';
import FinanzasIA from '../screens/finances/FinanzasIA';
import FinanzasResumen from '../screens/finances/FinanzasResumen';

const Stack = createNativeStackNavigator();

const FinanzasStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
<Stack.Screen name="FinanzasEstado" component={FinanzasEstado} />
<Stack.Screen name="FinanzasPrediccion" component={FinanzasPrediccion} />
<Stack.Screen name="FinanzasIA" component={FinanzasIA} />
<Stack.Screen name="FinanzasResumen" component={FinanzasResumen} />

  </Stack.Navigator>
);

export default FinanzasStack;
