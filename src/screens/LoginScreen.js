import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const { login } = useAuth(); // ✅ solo espera un parámetro
  const { t } = useLanguage();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos vacíos', 'Por favor, llena todos los campos.');
      return;
    }

    try {
      const response = await fetch('https://auth.nexusutd.online/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        await AsyncStorage.setItem('accessToken', data.accessToken);

        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        login(data.accessToken); // ✅ solo 1 argumento
      } else {
        Alert.alert('Error', 'Usuario y contraseña inválidos');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Líneas superiores */}
      <View style={styles.diagonalContainer}>
        <View style={[styles.diagonal, { backgroundColor: '#656565', top: 0 }]} />
        <View style={[styles.diagonal, { backgroundColor: '#888', top: 25 }]} />
        <View style={[styles.diagonal, { backgroundColor: '#ddd', top: 50 }]} />
      </View>

      {/* Líneas inferiores */}
      <View style={styles.diagonalContainerBottomRight}>
        <View style={[styles.diagonalRight, { backgroundColor: '#656565', top: 0 }]} />
        <View style={[styles.diagonalRight, { backgroundColor: '#888', top: 25 }]} />
        <View style={[styles.diagonalRight, { backgroundColor: '#ddd', top: 50 }]} />
      </View>

      {/* Contenido principal */}
      <View style={styles.centeredContent}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>N E X S T O C K</Text>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={t('login_user')}
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={t('login_password')}
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)}>
              <MaterialIcons
                name={secure ? 'visibility-off' : 'visibility'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{t('login_button')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centeredContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 130, height: 130, marginBottom: 20 },
  card: { width: '85%', backgroundColor: '#f0f0f0', borderRadius: 16, padding: 20, elevation: 2 },
  inputContainer: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: '#000' },
  button: { backgroundColor: '#8a8989', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  diagonalContainer: { position: 'absolute', top: 0, left: 0, width: 500, height: 200, overflow: 'hidden' },
  diagonal: { position: 'absolute', left: -40, width: 300, height: 20, transform: [{ rotate: '-30deg' }], borderRadius: 4 },
  diagonalContainerBottomRight: { position: 'absolute', bottom: -80, right: -200, width: 900, height: 200, overflow: 'hidden' },
  diagonalRight: { position: 'absolute', right: -60, width: 500, height: 20, transform: [{ rotate: '-30deg' }], borderRadius: 4 },
  title: { fontSize: 30, fontWeight: 'bold', marginLeft: 20, marginTop: 15, marginBottom: 10, textAlign: 'center', fontFamily: 'italic' },
});
