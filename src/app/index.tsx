import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { initDatabase } from '@/infrastructure/storage/database';
import { logger } from '@/shared/lib/logger';
import { Text } from '@/shared/ui/Text';

import { RootNavigator } from './navigation/RootNavigator';
import { AppProviders } from './providers/AppProviders';

/** Корневой компонент приложения */
export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      logger.info('Инициализация приложения...');

      const dbResult = await initDatabase();
      if (!dbResult.ok) {
        setInitError(dbResult.error.message);
        return;
      }

      logger.info('Приложение готово');
      setIsReady(true);
    }

    void init();
  }, []);

  if (initError) {
    return (
      <View style={styles.center}>
        <Text variant="title2">Ошибка инициализации</Text>
        <Text variant="body" color="#FF3B30" style={styles.errorText}>
          {initError}
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <AppProviders>
      <RootNavigator />
      <StatusBar style="auto" />
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
  },
});
