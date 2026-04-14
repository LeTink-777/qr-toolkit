import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/shared/theme/spacing';
import { Button } from '@/shared/ui/Button';

import type { SourceFilter } from '../model/types';

const FILTERS: { key: SourceFilter; labelKey: string }[] = [
  { key: 'all', labelKey: 'history.filterAll' },
  { key: 'scanned', labelKey: 'history.filterScanned' },
  { key: 'generated', labelKey: 'history.filterGenerated' },
];

interface HistoryFiltersProps {
  selected: SourceFilter;
  onSelect: (filter: SourceFilter) => void;
}

/** Фильтры по источнику записи */
export function HistoryFilters({ selected, onSelect }: HistoryFiltersProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map(({ key, labelKey }) => (
        <View key={key} style={styles.chip}>
          <Button
            title={t(labelKey)}
            variant={selected === key ? 'primary' : 'secondary'}
            onPress={() => onSelect(key)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    minWidth: 80,
  },
});
