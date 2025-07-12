import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const EditarUsuarioModal = ({ visible, onClose, usuario, onSuccess }) => {
  const { token } = useAuth();
  const { colors } = useTheme();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [originalActive, setOriginalActive] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (visible && usuario?.id) {
      axios
        .get(`https://auth.nexusutd.online/auth/users/${usuario.id}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const user = res.data?.user || {};
          const fetchedRoles = Array.isArray(res.data?.roles) ? res.data.roles : [];

          setUsername(user.username || '');
          setFirstName(user.first_name || '');
          setLastName(user.last_name || '');
          setRoleId(user.role?.id || '');
          setIsActive(user.is_active ?? false);
          setOriginalActive(user.is_active ?? false);
          setRoles(fetchedRoles);
        })
        .catch((err) => {
          console.error('Error al obtener detalles del usuario:', err);
          Alert.alert('Error', 'No se pudo cargar la información del usuario');
        });
    }
  }, [visible, usuario]);

  const handleGuardar = async () => {
    try {
      await axios.patch(
        `https://auth.nexusutd.online/auth/users/${usuario.id}`,
        {
          username,
          first_name: firstName,
          last_name: lastName,
          role_id: roleId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (isActive !== originalActive) {
        await axios.patch(
          `https://auth.nexusutd.online/auth/users/${usuario.id}/status`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      Alert.alert('Éxito', 'Usuario actualizado correctamente');
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    }
  };

  if (!usuario) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>Editar Usuario</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: colors.text }]}>Usuario</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholderTextColor={colors.placeholder}
            />

            <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholderTextColor={colors.placeholder}
            />

            <Text style={[styles.label, { color: colors.text }]}>Apellidos</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholderTextColor={colors.placeholder}
            />

            <Text style={[styles.label, { color: colors.text }]}>Rol</Text>
            <View style={[styles.pickerWrapper, { borderColor: colors.border }]}>
              <Picker
                selectedValue={roleId}
                onValueChange={setRoleId}
                dropdownIconColor={colors.text}
                style={{ color: colors.text }}
              >
                <Picker.Item label="Selecciona un rol" value="" />
                {roles.length >= 1 && roles[0] && (
                  <Picker.Item label={roles[0].name} value={roles[0].id} />
                )}
                {roles.length >= 2 && roles[1] && (
                  <Picker.Item label={roles[1].name} value={roles[1].id} />
                )}
                {roles.length >= 3 && roles[2] && (
                  <Picker.Item label={roles[2].name} value={roles[2].id} />
                )}
              </Picker>
            </View>

            <View style={styles.statusRow}>
              <Text style={[styles.label, { color: colors.text }]}>Usuario activo</Text>
              <Switch value={isActive} onValueChange={setIsActive} />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonWrapper} onPress={handleGuardar}>
                <LinearGradient
                  colors={
                    Array.isArray(colors.gradientButton)
                      ? colors.gradientButton
                      : ['#b3b3b3', '#4c4e55']
                  }
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Guardar cambios</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelWrapper} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditarUsuarioModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderRadius: 8,
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonWrapper: {
    width: '55%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 12,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelWrapper: {
    marginTop: 12,
  },
  cancelText: {
    color: '#999',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
