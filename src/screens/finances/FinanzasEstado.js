import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderBar from '../../components/HeaderBar'; // ✅ Asegúrate de que esta ruta sea correcta

export default function FinanzasEstado() {
  return (
    <View style={{ flex: 1 }}>
      <HeaderBar />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Estado de Cuenta</Text>
        <Text style={styles.subtitle}>La Barbacha de Pancho</Text>
        <Text style={styles.range}>Del: 1 de julio de 2025 | Al: 31 de julio de 2025</Text>

        <Text style={styles.sectionTitle}>Movimientos</Text>

        {/* INGRESOS */}
        <View style={styles.tableSection}>
          <Text style={styles.tableHeader}>Ingresos</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>FECHA</Text>
            <Text style={styles.tableCol}>CATEGORÍA</Text>
            <Text style={styles.tableCol}>IMPORTE</Text>
            <Text style={styles.tableCol}>MÉTODO</Text>
            <Text style={styles.tableCol}>CONCEPTO</Text>
          </View>

          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* GASTOS */}
        <View style={styles.tableSection}>
          <Text style={styles.tableHeader}>Gastos</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>FECHA</Text>
            <Text style={styles.tableCol}>CATEGORÍA</Text>
            <Text style={styles.tableCol}>IMPORTE</Text>
            <Text style={styles.tableCol}>MÉTODO</Text>
            <Text style={styles.tableCol}>CONCEPTO</Text>
          </View>

          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 2 },
  range: { fontSize: 13, color: '#555', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  tableSection: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fdfdfd',
  },
  tableHeader: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tableCol: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#00c851',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
