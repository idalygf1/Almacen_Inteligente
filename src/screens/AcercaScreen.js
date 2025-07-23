import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import HeaderBar from '../components/HeaderBar';
import * as Font from 'expo-font';
import { useTheme } from '../context/ThemeContext';
import TabNavigator from '../navigation/TabNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AcercaScreen() {
  const { colors } = useTheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Urbanist-Regular': require('../../assets/fonts/Urbanist-Regular.ttf'),
        'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#000000ff' }}>
      
      <HeaderBar customTitle="Acerca de nosotros" />


      <ScrollView style={styles.container}>
        {/* ✅ Botón de regreso fijo al fondo de la pantalla */}
      <View style={styles.fixedBackButton}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
        {/* ¿Quiénes somos? */}
        <View style={styles.section}>
          <Text style={styles.title}>¿Quiénes somos?</Text>
          <Text style={styles.text}>
            En <Text style={styles.neon}>NexusCode Evolution</Text> somos apasionados por la innovación. Diseñamos soluciones tecnológicas inteligentes que ayudan a pequeñas y medianas empresas a tomar decisiones basadas en datos reales y automatización.
          </Text>
          <Text style={styles.text}>
            Nuestro equipo combina experiencia en desarrollo, inteligencia artificial e IoT para ofrecer productos como <Text style={styles.neon}>NexStock</Text>, que transforman procesos complejos en soluciones simples y efectivas.
          </Text>
        </View>

        {/* Nuestros productos */}
        <View style={styles.section}>
          <Text style={styles.title}>Nuestros productos</Text>
          <Text style={styles.text}>Creamos soluciones que combinan tecnología, análisis y experiencia para transformar negocios.</Text>
          <View style={styles.cardGrid}>
            {productos.map((item, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                <Text style={styles.cardText}>{item.descripcion}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ¿Por qué elegirnos? */}
        <View style={styles.section}>
          <Text style={styles.title}>¿Por qué elegirnos?</Text>
          <Text style={styles.text}>Te ofrecemos más que software: una solución enfocada en tu crecimiento.</Text>
          <View style={styles.cardGrid}>
            {beneficios.map((b, idx) => (
              <View key={idx} style={styles.benefitCard}>
                <Text style={styles.benefitText}>✔ <Text style={styles.neon}>{b}</Text></Text>
              </View>
            ))}
          </View>
        </View>

        {/* Testimonios */}
        <View style={styles.section}>
          <Text style={styles.title}>Lo que dicen nuestros clientes</Text>
          {testimonios.map((t, idx) => (
            <View key={idx} style={styles.testimonialCard}>
              <Text style={styles.testimonialText}>“{t.frase}”</Text>
              <Text style={styles.testimonialAutor}>— {t.autor}</Text>
            </View>
          ))}
        </View>

        {/* Nuestro equipo */}
        <View style={styles.section}>
          <Text style={styles.title}>Nuestro equipo</Text>
          <View style={styles.teamGrid}>
            {equipo.map((p, idx) => (
              <View key={idx} style={styles.profileCard}>
                <Image source={p.foto} style={styles.image} />
                <Text style={styles.name}>{p.nombre}</Text>
                <Text style={styles.role}>{p.rol}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <TabNavigator />

      
    </View>
  );
}

const productos = [
  { nombre: 'NexStock', descripcion: 'Sistema inteligente para gestionar inventarios, finanzas y operaciones. Potenciado por IA y análisis de datos.' },
  { nombre: 'NextData (próximamente)', descripcion: 'Plataforma analítica para convertir datos en decisiones estratégicas.' },
  { nombre: 'NextCloud (en desarrollo)', descripcion: 'Infraestructura privada para que tus procesos corran en la nube con seguridad.' }
];

const beneficios = [
  'IA + IoT Integrado',
  '100% personalizable',
  'Infraestructura en la nube',
  'Seguridad profesional',
  'Implementación rápida',
  'Decisiones con datos'
];

const testimonios = [
  {
    frase: 'NexStock nos ayudó a reducir mermas y controlar el inventario como nunca antes. ¡Lo recomiendo totalmente!',
    autor: 'Carlos Méndez, Dueño de restaurante'
  },
  {
    frase: 'Desde que usamos NexusCode, nuestras decisiones son más rápidas y basadas en datos reales.',
    autor: 'Laura Torres, Gerente de operaciones'
  }
];

const imgAntonio = require('../../assets/team/antonio.jpg');
const imgJose = require('../../assets/team/jose.jpg');
const imgIdaly = require('../../assets/team/idaly.jpg');
const imgGustavo = require('../../assets/team/gustavo.jpg');
const imgJessica = require('../../assets/team/jessica.jpg');

const equipo = [
  { nombre: 'Antonio Delgado', rol: 'Cloud Architect', foto: imgAntonio },
  { nombre: 'José Rodríguez', rol: 'iOS Developer', foto: imgJose },
  { nombre: 'Idaly García', rol: 'Mobile Developer', foto: imgIdaly },
  { nombre: 'Gustavo Ocampo', rol: 'Backend Developer', foto: imgGustavo },
  { nombre: 'Jessica Malacara', rol: 'Frontend Developer', foto: imgJessica },
];



const styles = StyleSheet.create({
  container: { padding: 20 },
  section: { marginBottom: 40 },
  title: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#0ff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: '#00ffffaa',
    textShadowRadius: 12,
  },
  text: {
    color: '#ccc',
    fontFamily: 'Urbanist-Regular',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  neon: {
    color: '#0ff',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#0ff',
    shadowRadius: 8,
    shadowOpacity: 0.4,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    color: '#0ff',
    marginBottom: 6,
  },
  cardText: {
    color: '#ccc',
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
  },
  benefitCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#141414',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#0ff2',
    borderWidth: 1,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#ccc',
  },
  testimonialCard: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0ff3',
  },
  testimonialText: {
    fontSize: 15,
    color: '#ccc',
    fontStyle: 'italic',
    marginBottom: 6,
    textAlign: 'center',
  },
  testimonialAutor: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
    marginTop: 10,
  },
  profileCard: {
    width: 160,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#111',
    borderRadius: 12,
    borderColor: '#0ff',
    borderWidth: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#0ff',
    borderWidth: 2,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    color: '#0ff',
    fontFamily: 'Urbanist-Bold',
    textAlign: 'center',
  },
  role: {
    fontSize: 13,
    color: '#bbb',
    fontFamily: 'Urbanist-Regular',
    textAlign: 'center',
  },

  // ✅ Flecha fija arriba de todo
  fixedBackButton: {
    position: 'absolute',
    top: -3,
    left: 5,
    zIndex: 9999,
    backgroundColor: 'transparent',
  },
});
