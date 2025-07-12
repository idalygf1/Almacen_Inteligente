// src/navigation/FinanzasStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FinanzasInicio from '../screens/finances/FinanzasInicio';
import FinanzasEstado from '../screens/finances/FinanzasEstado';
import FinanzasNomina from '../screens/finances/FinanzasNomina';
import FinanzasIA from '../screens/finances/FinanzasIA';
import FinanzasAnalisis from '../screens/finances/FinanzasAnalisis';

const Stack = createNativeStackNavigator();

const FinanzasStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FinanzasInicio" component={FinanzasInicio} />
<Stack.Screen name="FinanzasEstado" component={FinanzasEstado} />
<Stack.Screen name="FinanzasNomina" component={FinanzasNomina} />
<Stack.Screen name="FinanzasIA" component={FinanzasIA} />
<Stack.Screen name="FinanzasAnalisis" component={FinanzasAnalisis} />

  </Stack.Navigator>
);

export default FinanzasStack;
