// src/screens/config/LanguageSelector.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import i18n from '../../i18n';

const languages = [
  { code: 'es', name: 'Español', image: require('../../../assets/es.png') },
  { code: 'en', name: 'English', image: require('../../../assets/en.png') },
  { code: 'fr', name: 'Français', image: require('../../../assets/fr.png') },
  { code: 'de', name: 'Deutsch', image: require('../../../assets/de.png') },
  { code: 'pt', name: 'Português', image: require('../../../assets/pt.png') },
  { code: 'zh', name: '中文', image: require('../../../assets/zh.png') },
  { code: 'jp', name: '日本語', image: require('../../../assets/jp.png') },
  { code: 'ar', name: 'العربية', image: require('../../../assets/ar.png') },
  { code: 'ru', name: 'Русский', image: require('../../../assets/ru.png') },
  { code: 'it', name: 'Italiano', image: require('../../../assets/it.png') },
];

export default function LanguageSelector() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('select_language') || 'Selecciona un idioma'}
      </Text>
      <View style={styles.flagContainer}>
        {languages.map((lang) => (
          <TouchableOpacity key={lang.code} onPress={() => handleLanguageChange(lang.code)} style={styles.flagButton}>
            <Image source={lang.image} style={styles.flagImage} />
            <Text style={[styles.flagText, { color: colors.text }]}>{lang.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  flagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  flagButton: {
    alignItems: 'center',
    margin: 10,
  },
  flagImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  flagText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
