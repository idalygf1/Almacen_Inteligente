import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
  es: {
    login_user: 'Usuario',
    login_password: 'Contraseña',
    login_button: 'Iniciar sesión',
    finances: 'F I N A N Z A S',
    utility: 'Utilidad',
    monitoring: 'M O N I T O R E O',
    temperature: 'Temperatura',
    humidity: 'Humedad',
    alerts: 'A L E R T A S',
    see_more: 'Ver más',
    system_config: 'Configuración del sistema',
    logo: 'Logo actual',
    color_palette: 'Paleta de colores',
    primary: 'Primario',
    secondary: 'Secundario',
    tertiary: 'Terciario',
    save_changes: 'Guardar cambios',
    language: 'Idioma',
    users: 'U S U A R I O S',
    preferences: 'P R E F E R E N C I A S',
    config: 'C O N F I G U R A C I Ó N',
  },
  en: {
    login_user: 'User',
    login_password: 'Password',
    login_button: 'Sign In',
    finances: 'F I N A N C E S',
    utility: 'Profit',
    monitoring: 'M O N I T O R I N G',
    temperature: 'Temperature',
    humidity: 'Humidity',
    alerts: 'A L E R T S',
    see_more: 'See more',
    system_config: 'System Configuration',
    logo: 'Logo',
    color_palette: 'Color palette',
    primary: 'Primary',
    secondary: 'Secondary',
    tertiary: 'Tertiary',
    save_changes: 'Save changes',
    language: 'Language',
    users: 'U S E R S',
    preferences: 'P R E F E R E N C E S',
    config: 'C O N F I G U R A T I O N',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    const loadLang = async () => {
      const stored = await AsyncStorage.getItem('language');
      if (stored) setLanguage(stored);
    };
    loadLang();
  }, []);

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
