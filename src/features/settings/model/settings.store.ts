import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AutoCleanupDays } from '@/app/config/constants';
import type { SupportedLanguage } from '@/shared/i18n';

type ThemeMode = 'system' | 'light' | 'dark';

interface SettingsState {
  /** Режим темы */
  theme: ThemeMode;
  /** Язык интерфейса */
  language: SupportedLanguage;
  /** Автоочистка истории (0 = никогда) */
  autoCleanupDays: AutoCleanupDays;
  /** Запрет скриншотов на экранах с паролями */
  preventScreenshots: boolean;

  /** Установить тему */
  setTheme: (theme: ThemeMode) => void;
  /** Установить язык */
  setLanguage: (language: SupportedLanguage) => void;
  /** Установить автоочистку */
  setAutoCleanupDays: (days: AutoCleanupDays) => void;
  /** Установить запрет скриншотов */
  setPreventScreenshots: (value: boolean) => void;
}

/**
 * Стор настроек с персистенцией.
 * Secure defaults: приватность включена по умолчанию.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'ru',
      autoCleanupDays: 30,
      preventScreenshots: true,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setAutoCleanupDays: (days) => set({ autoCleanupDays: days }),
      setPreventScreenshots: (value) => set({ preventScreenshots: value }),
    }),
    {
      name: 'qr-toolkit-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
