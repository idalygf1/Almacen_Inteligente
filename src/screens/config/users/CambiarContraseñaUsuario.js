import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';

export default function CambiarContraseñaUsuario() {
  const { token } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { id, username } = route.params || {};

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      };
    }, [])
  );

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await axios.patch(
        `https://auth.nexusutd.online/auth/users/${id}/password`,
        { new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Éxito', res.data.message || 'Contraseña actualizada correctamente');
      navigation.goBack();
    } catch (error) {
      console.log('Error al cambiar contraseña:', error?.response?.data || error.message);
      Alert.alert('Error', error?.response?.data?.message || 'Ocurrió un error al cambiar la contraseña');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cambiar Contraseña</Text>
        <Text style={styles.subtitle}>
          Editando contraseña de: <Text style={styles.username}>{username || ''}</Text>
        </Text>

        {/* Contraseña actual (ya no encriptada) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Contraseña actual</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Contraseña actual"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Nueva contraseña */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nueva contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nueva contraseña"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <Icon name={showNew ? 'eye-off' : 'eye'} size={24} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirmar nueva contraseña */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirmar nueva contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar nueva contraseña"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Icon name={showConfirm ? 'eye-off' : 'eye'} size={24} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Guardar nueva contraseña</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20
  },
  username: {
    fontWeight: 'bold',
    color: '#0f172a'
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    color: '#0f172a',
    marginBottom: 6
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#000'
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
