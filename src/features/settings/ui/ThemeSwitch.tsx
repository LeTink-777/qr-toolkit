import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';
import { Text } from '@/shared/ui/Text';

import { useSettingsStore } from '../model/settings.store';

type ThemeMode = 'system' | 'light' | 'dark';

const THEME_OPTIONS: { key: ThemeMode; labelKey: string }[] = [
  { key: 'system', labelKey: 'settings.themeSystem' },
  { key: 'light', labelKey: 'settings.themeLight' },
  { key: 'dark', labelKey: 'settings.themeDark' },
];

/** Переключатель темы */
export function ThemeSwitch() {
  const { t } = useTranslation();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <View style={styles.container}>
      <Text variant="headline" style={styles.label}>
        {t('settings.theme')}
      </Text>
      <View style={styles.options}>
        {THEME_OPTIONS.map(({ key, labelKey }) => (
          <TouchableOpacity
            key={key}
            style={[styles.option, theme === key && styles.optionActive]}
            onPress={() => setTheme(key)}
          >
            <Text
              variant="subhead"
              color={theme === key ? '#FFFFFF' : '#000000'}
            >
              {t(labelKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  label: { marginBottom: spacing.xs },
  options: { flexDirection: 'row', gap: spacing.sm },
  option: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: '#E5E5EA',
  },
  optionActive: {
    backgroundColor: '#007AFF',
  },
});
