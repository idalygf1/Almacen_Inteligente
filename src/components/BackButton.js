import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext'; // 👈 importamos el tema

export default function BackButton() {
  const navigation = useNavigation();
  const { theme } = useTheme(); // 👈 accedemos al tema

  // 👇 Cambiamos la imagen según el tema
  const iconSource =
    theme === 'dark'
      ? require('../../assets/flecha-blanca.png')
      : require('../../assets/flecha.png');

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
      <Image source={iconSource} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 100,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});
