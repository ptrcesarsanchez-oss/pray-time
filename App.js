import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

// Traducciones
const translations = {
  es: {
    title: 'Pray Time',
    verse: '“Acércate a Dios, y Él se acercará a ti.” (Santiago 4:8)',
    invite: 'Este es tu momento santo. Respira. Habla con tu Padre.\nNo performance. No máscaras. Solo tú y Él.',
    remind: 'Recordarme orar',
    ready: 'Listo 🙌',
    readyBody: 'Te recordaré orar en 1 minuto como prueba.\nLuego podrás escoger tu horario fijo.',
    needPerm: 'Permiso necesario',
    needPermBody: 'Para recordarte orar necesito permiso para notificaciones.',
    notifTitle: 'Es hora de orar 🙏',
    notifBody: 'Respira. Habla con Dios un momento.',
    status: 'Estado de notificaciones: ',
    footer: 'v0.0.1 — Ministerio de oración diaria',
    changeLang: 'Cambiar idioma'
  },
  en: {
    title: 'Pray Time',
    verse: '“Draw near to God, and He will draw near to you.” (James 4:8)',
    invite: 'This is your holy moment. Breathe. Speak with your Father.\nNo performance. No masks. Just you and Him.',
    remind: 'Remind me to pray',
    ready: 'Done 🙌',
    readyBody: "I'll remind you to pray in 1 minute as a test.\nLater you can choose a fixed schedule.",
    needPerm: 'Permission required',
    needPermBody: 'I need notification permission to remind you to pray.',
    notifTitle: "It's time to pray 🙏",
    notifBody: 'Breathe. Talk with God for a moment.',
    status: 'Notification status: ',
    footer: 'v0.0.1 — Daily prayer ministry',
    changeLang: 'Change language'
  }
};

// Configuración i18n
i18n.translations = translations;
i18n.fallbacks = true;
i18n.locale = Localization.getLocales()[0]?.languageCode || 'es';

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [currentLocale, setCurrentLocale] = useState(i18n.locale);

  async function askPermissionAndSchedule() {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);

    if (status !== 'granted') {
      Alert.alert(i18n.t('needPerm'), i18n.t('needPermBody'));
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('notifTitle'),
        body: i18n.t('notifBody'),
        sound: null,
      },
      trigger: { seconds: 60 },
    });

    Alert.alert(i18n.t('ready'), i18n.t('readyBody'));
  }

  function toggleLanguage() {
    const next = currentLocale.startsWith('es') ? 'en' : 'es';
    i18n.locale = next;
    setCurrentLocale(next);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>{i18n.t('title')}</Text>
        <Text style={styles.subtitle}>{i18n.t('verse')}</Text>
        <Text style={styles.paragraph}>{i18n.t('invite')}</Text>

        <TouchableOpacity style={styles.button} onPress={askPermissionAndSchedule}>
          <Text style={styles.buttonText}>{i18n.t('remind')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={toggleLanguage}>
          <Text style={styles.secondaryText}>{i18n.t('changeLang')}</Text>
        </TouchableOpacity>

        {permissionStatus && (
          <Text style={styles.note}>
            {i18n.t('status')} {permissionStatus}
          </Text>
        )}
      </View>

      <Text style={styles.footer}>{i18n.t('footer')}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  heading: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  paragraph: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#38bdf8',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
  },
  note: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    color: '#475569',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});
