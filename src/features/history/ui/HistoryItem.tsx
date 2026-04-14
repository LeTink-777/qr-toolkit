import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { ScanRecord } from '@/entities/scan-record';
import { formatDateTime } from '@/shared/lib/date';
import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';
import { Text } from '@/shared/ui/Text';

interface HistoryItemProps {
  record: ScanRecord;
  isSelected: boolean;
  onPress: (id: string) => void;
  onLongPress: (id: string) => void;
}

/** Одна запись в списке истории */
export function HistoryItem({ record, isSelected, onPress, onLongPress }: HistoryItemProps) {
  const { t } = useTranslation();

  const handlePress = useCallback(() => onPress(record.id), [onPress, record.id]);
  const handleLongPress = useCallback(() => onLongPress(record.id), [onLongPress, record.id]);

  const sourceLabel = record.source === 'scanned' ? t('history.scanned') : t('history.generated');

  return (
    <Pressable
      style={[styles.container, isSelected && styles.selected]}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <View style={styles.typeTag}>
        <Text variant="caption2" color="#FFFFFF">
          {record.payloadType.toUpperCase()}
        </Text>
      </View>
      <View style={styles.content}>
        <Text variant="body" numberOfLines={1}>
          {record.data}
        </Text>
        <Text variant="caption1" color="#8E8E93">
          {sourceLabel} · {formatDateTime(record.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    gap: spacing.md,
  },
  selected: {
    backgroundColor: '#E8F2FF',
  },
  typeTag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    minWidth: 44,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
});
