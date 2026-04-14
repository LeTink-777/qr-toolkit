import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { SupportedLanguage } from '@/shared/i18n';
import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';
import { Text } from '@/shared/ui/Text';

import { useSettingsStore } from '../model/settings.store';

const LANGUAGE_OPTIONS: { key: SupportedLanguage; labelKey: string }[] = [
  { key: 'ru', labelKey: 'settings.languageRu' },
  { key: 'en', labelKey: 'settings.languageEn' },
];

/** Переключатель языка */
export function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const handleChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    void i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Text variant="headline" style={styles.label}>
        {t('settings.language')}
      </Text>
      <View style={styles.options}>
        {LANGUAGE_OPTIONS.map(({ key, labelKey }) => (
          <TouchableOpacity
            key={key}
            style={[styles.option, language === key && styles.optionActive]}
            onPress={() => handleChange(key)}
          >
            <Text
              variant="subhead"
              color={language === key ? '#FFFFFF' : '#000000'}
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
