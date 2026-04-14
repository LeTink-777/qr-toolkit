import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/shared/theme/spacing';
import { Text } from '@/shared/ui/Text';

/** Пустое состояние списка истории */
export function EmptyState() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text variant="title3" color="#8E8E93" style={styles.title}>
        {t('history.empty')}
      </Text>
      <Text variant="body" color="#AEAEB2" style={styles.description}>
        {t('history.emptyDescription')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['4xl'],
    marginTop: spacing['5xl'],
  },
  title: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
