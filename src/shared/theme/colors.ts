/** Палитра цветов для светлой и тёмной темы */
export const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F2F2F7',
    surfaceSecondary: '#E5E5EA',
    text: '#000000',
    textSecondary: '#8E8E93',
    textTertiary: '#AEAEB2',
    primary: '#007AFF',
    primaryLight: '#E8F2FF',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    border: '#C6C6C8',
    overlay: 'rgba(0, 0, 0, 0.4)',
    card: '#FFFFFF',
    tabBar: '#F8F8F8',
  },
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#636366',
    primary: '#0A84FF',
    primaryLight: '#1A3A5C',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    border: '#38383A',
    overlay: 'rgba(0, 0, 0, 0.6)',
    card: '#1C1C1E',
    tabBar: '#1C1C1E',
  },
} as const;

export type ThemeColors = (typeof colors)['light'];
