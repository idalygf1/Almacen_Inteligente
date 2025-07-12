import AsyncStorage from '@react-native-async-storage/async-storage';

export const getMonitoreoData = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const response = await fetch('https://monitoring.nexusutd.online/monitoring/home', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Error al obtener datos');
  return await response.json();
};
