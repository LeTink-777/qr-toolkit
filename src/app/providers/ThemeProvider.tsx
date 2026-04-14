import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { colors, type ThemeColors } from '@/shared/theme/colors';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  /** Текущая разрешённая тема */
  theme: ResolvedTheme;
  /** Палитра цветов для текущей темы */
  palette: ThemeColors;
  /** Настройка режима темы */
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  palette: colors.light,
  mode: 'system',
});

/** Хук для доступа к текущей теме */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
  /** Режим темы из настроек */
  mode?: ThemeMode;
}

/** Провайдер темы — определяет палитру цветов на основе режима */
export function ThemeProvider({ children, mode = 'system' }: ThemeProviderProps) {
  const systemScheme = useColorScheme();

  const value = useMemo<ThemeContextValue>(() => {
    let resolved: ResolvedTheme;

    if (mode === 'system') {
      resolved = systemScheme === 'dark' ? 'dark' : 'light';
    } else {
      resolved = mode;
    }

    return {
      theme: resolved,
      palette: colors[resolved],
      mode,
    };
  }, [mode, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
