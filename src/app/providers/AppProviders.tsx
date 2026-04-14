import { type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useSettingsStore } from '@/features/settings/model/settings.store';

import { ErrorBoundary } from './ErrorBoundary';
import { I18nProvider } from './I18nProvider';
import { ThemeProvider } from './ThemeProvider';

interface AppProvidersProps {
  children: ReactNode;
}

/** Композиция всех провайдеров приложения */
export function AppProviders({ children }: AppProvidersProps) {
  const themeMode = useSettingsStore((s) => s.theme);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <I18nProvider>
            <ThemeProvider mode={themeMode}>{children}</ThemeProvider>
          </I18nProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
