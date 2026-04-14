import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AUTO_CLEANUP_OPTIONS, type AutoCleanupDays, APP_VERSION } from '@/app/config/constants';
import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';
import { Text } from '@/shared/ui/Text';

import { useSettingsStore } from '../model/settings.store';
import { LanguageSwitch } from './LanguageSwitch';
import { ThemeSwitch } from './ThemeSwitch';

/** Экран настроек */
export function SettingsScreen() {
  const { t } = useTranslation();
  const {
    autoCleanupDays,
    preventScreenshots,
    setAutoCleanupDays,
    setPreventScreenshots,
  } = useSettingsStore();

  const cleanupLabel = (days: AutoCleanupDays): string => {
    if (days === 0) return t('settings.autoCleanupNever');
    if (days === 7) return t('settings.autoCleanup7');
    return t('settings.autoCleanup30');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Оформление */}
      <Text variant="footnote" color="#8E8E93" style={styles.sectionHeader}>
        {t('settings.appearance').toUpperCase()}
      </Text>
      <View style={styles.section}>
        <ThemeSwitch />
        <View style={styles.divider} />
        <LanguageSwitch />
      </View>

      {/* Приватность */}
      <Text variant="footnote" color="#8E8E93" style={styles.sectionHeader}>
        {t('settings.privacy').toUpperCase()}
      </Text>
      <View style={styles.section}>
        {/* Автоочистка */}
        <View>
          <Text variant="headline" style={styles.settingLabel}>
            {t('settings.autoCleanup')}
          </Text>
          <View style={styles.optionRow}>
            {AUTO_CLEANUP_OPTIONS.map((days) => (
              <View
                key={days}
                style={[
                  styles.cleanupChip,
                  autoCleanupDays === days && styles.cleanupChipActive,
                ]}
              >
                <Text
                  variant="caption1"
                  color={autoCleanupDays === days ? '#FFFFFF' : '#000000'}
                  onPress={() => setAutoCleanupDays(days)}
                >
                  {cleanupLabel(days)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.divider} />
        {/* Запрет скриншотов */}
        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text variant="body">{t('settings.preventScreenshots')}</Text>
            <Text variant="caption1" color="#8E8E93">
              {t('settings.preventScreenshotsHint')}
            </Text>
          </View>
          <Switch value={preventScreenshots} onValueChange={setPreventScreenshots} />
        </View>
      </View>

      {/* О приложении */}
      <Text variant="footnote" color="#8E8E93" style={styles.sectionHeader}>
        {t('settings.about').toUpperCase()}
      </Text>
      <View style={styles.section}>
        <View style={styles.aboutRow}>
          <Text variant="body">{t('settings.appName')}</Text>
          <Text variant="body" color="#8E8E93">
            {t('settings.version')} {APP_VERSION}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { paddingBottom: spacing['5xl'] },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
  },
  settingLabel: { marginBottom: spacing.sm },
  optionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cleanupChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: '#E5E5EA',
  },
  cleanupChipActive: {
    backgroundColor: '#007AFF',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
