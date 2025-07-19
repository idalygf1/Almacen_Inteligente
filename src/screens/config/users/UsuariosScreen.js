import React, { useEffect, useState } from 'react';
import {
  View,
  Text as RNText,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import AgregarUsuarioModal from './AgregarUsuarioModal';
import EditarUsuarioModal from './EditarUsuarioModal';
import HeaderBar from '../../../components/HeaderBar';

const UsuariosScreen = () => {
  const { token } = useAuth();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { colors } = useTheme();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://auth.nexusutd.online/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data.users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchUsuarios();
    }
  }, [isFocused]);

  const handleEliminarUsuario = async () => {
    try {
      await axios.delete(`https://auth.nexusutd.online/auth/users/${usuarioSeleccionado.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalVisible(false);
      fetchUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }) => (
    <LinearGradient colors={colors.gradientCard} style={styles.card}>
      <RNText style={[styles.username, { color: colors.text }]}>
        <Ionicons name="person" size={16} /> {item.username}
      </RNText>

      <View style={styles.infoContainer}>
        <RNText style={[styles.label, { color: colors.text }]}>Nombre:</RNText>
        <RNText style={[styles.value, { color: colors.text }]}>
          {item.first_name} {item.last_name}
        </RNText>
      </View>

      <View style={styles.infoContainer}>
        <RNText style={[styles.label, { color: colors.text }]}>Rol:</RNText>
        <RNText style={[styles.value, { color: colors.text }]}>{item.role.name}</RNText>
      </View>

      <View style={styles.infoContainer}>
        <RNText style={[styles.label, { color: colors.text }]}>Estado:</RNText>
        <RNText style={[styles.estado, item.is_active ? styles.activo : styles.inactivo]}>
          {item.is_active ? 'Activo' : 'Inactivo'}
        </RNText>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => {
            setUsuarioSeleccionado(item);
            setModalEditarVisible(true);
          }}
        >
          <FontAwesome name="edit" size={22} color="#3498db" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CambiarContraseñaUsuario', {
              id: item.id,
              username: item.username,
            })
          }
        >
          <MaterialIcons name="lock-reset" size={22} color="#f1c40f" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setUsuarioSeleccionado(item);
            setModalVisible(true);
          }}
        >
          <Ionicons name="trash" size={22} color="#e74c3c" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />;
  }

  return (
    <>
      <HeaderBar customTitle="USUARIOS" />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.button }]}
            onPress={() => setModalAgregarVisible(true)}
          >
            <Ionicons name="person-add" size={20} color="white" />
            <RNText style={styles.addButtonText}>Agregar</RNText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
              <RNText style={styles.modalTitle}>
                ¿Eliminar a <RNText style={styles.modalUsername}>{usuarioSeleccionado?.username}</RNText>?
              </RNText>
              <RNText style={styles.modalWarning}>Esta acción no se puede deshacer.</RNText>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <RNText style={styles.buttonTextCancel}>Cancelar</RNText>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleEliminarUsuario}
                >
                  <RNText style={styles.buttonTextConfirm}>Aceptar</RNText>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <AgregarUsuarioModal
          visible={modalAgregarVisible}
          onClose={() => setModalAgregarVisible(false)}
          onSuccess={fetchUsuarios}
        />

        <EditarUsuarioModal
          visible={modalEditarVisible}
          onClose={() => setModalEditarVisible(false)}
          usuario={usuarioSeleccionado}
          onSuccess={fetchUsuarios}
        />
      </View>
    </>
  );
};

export default UsuariosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  value: {
    flexShrink: 1,
  },
  estado: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  activo: {
    color: 'green',
    backgroundColor: '#eafaf1',
  },
  inactivo: {
    color: 'red',
    backgroundColor: '#fdecea',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    padding: 20,
    borderRadius: 16,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c0392b',
    marginBottom: 10,
  },
  modalUsername: {
    color: '#c0392b',
    fontWeight: 'bold',
  },
  modalWarning: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
  },
  confirmButton: {
    backgroundColor: '#c0392b',
  },
  buttonTextCancel: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  buttonTextConfirm: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
