import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext'; // ✅ Se agrega uso del theme

const AgregarUsuarioModal = ({ visible, onClose, onSuccess }) => {
  const { token } = useAuth();
  const { colors } = useTheme(); // ✅ Se obtienen los colores del tema

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const limpiarCampos = () => {
    setFirstName('');
    setLastName('');
    setUsername('');
    setPassword('');
  };

  const handleCreate = async () => {
    if (!firstName || !lastName || !username || !password) {
      Alert.alert('Campos vacíos', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      await axios.post(
        'https://auth.nexusutd.online/auth/users',
        {
          first_name: firstName,
          last_name: lastName,
          username,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Usuario creado', 'El usuario se ha registrado correctamente');
      limpiarCampos();
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo crear el usuario');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
          <ScrollView>
            <Text style={[styles.title, { color: colors.text }]}>Agregar Usuario</Text>

            <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.input, borderColor: colors.border }]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Ingresa el nombre"
              placeholderTextColor={colors.placeholder}
            />

            <Text style={[styles.label, { color: colors.text }]}>Apellido</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.input, borderColor: colors.border }]}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Ingresa el apellido"
              placeholderTextColor={colors.placeholder}
            />

            <Text style={[styles.label, { color: colors.text }]}>Usuario</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.input, borderColor: colors.border }]}
              value={username}
              onChangeText={setUsername}
              placeholder="Nombre de usuario"
              placeholderTextColor={colors.placeholder}
            />

            <Text style={[styles.label, { color: colors.text }]}>Contraseña</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.input, borderColor: colors.border }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              placeholderTextColor={colors.placeholder}
              secureTextEntry
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.cancel }]}
                onPress={() => {
                  limpiarCampos();
                  onClose();
                }}
              >
                <Text style={[styles.buttonTextCancel, { color: colors.cancelText }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleCreate}
              >
                <Text style={styles.buttonTextSave}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AgregarUsuarioModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modalContainer: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    marginTop: 15,
    fontWeight: '600',
  },
  input: {
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonTextCancel: {
    fontWeight: '600',
  },
  buttonTextSave: {
    color: '#fff',
    fontWeight: '600',
  },
});
