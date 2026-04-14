import { useCallback } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { ScanRecord } from '@/entities/scan-record';
import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';
import { Button } from '@/shared/ui/Button';

import { useHistory } from '../model/useHistory';
import { EmptyState } from './EmptyState';
import { HistoryFilters } from './HistoryFilters';
import { HistoryItem } from './HistoryItem';

/** Экран истории сканирований и генераций */
export function HistoryScreen() {
  const { t } = useTranslation();
  const {
    records,
    sourceFilter,
    searchQuery,
    selectedIds,
    setSourceFilter,
    setSearchQuery,
    removeRecord,
    removeSelected,
    clearAll,
    toggleSelection,
    clearSelection,
  } = useHistory();

  const hasSelection = selectedIds.size > 0;

  const handlePress = useCallback(
    (id: string) => {
      if (hasSelection) {
        toggleSelection(id);
      }
    },
    [hasSelection, toggleSelection],
  );

  const handleLongPress = useCallback(
    (id: string) => {
      toggleSelection(id);
    },
    [toggleSelection],
  );

  const handleClearHistory = useCallback(() => {
    Alert.alert(t('history.clearHistory'), t('history.clearHistoryConfirm'), [
      { text: t('history.cancel'), style: 'cancel' },
      {
        text: t('history.clearHistoryButton'),
        style: 'destructive',
        onPress: () => void clearAll(),
      },
    ]);
  }, [t, clearAll]);

  const handleDeleteSelected = useCallback(() => {
    void removeSelected();
  }, [removeSelected]);

  const renderItem = useCallback(
    ({ item }: { item: ScanRecord }) => (
      <HistoryItem
        record={item}
        isSelected={selectedIds.has(item.id)}
        onPress={handlePress}
        onLongPress={handleLongPress}
      />
    ),
    [selectedIds, handlePress, handleLongPress],
  );

  const keyExtractor = useCallback((item: ScanRecord) => item.id, []);

  return (
    <View style={styles.container}>
      {/* Поиск */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('history.search')}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Фильтры */}
      <HistoryFilters selected={sourceFilter} onSelect={setSourceFilter} />

      {/* Действия при мультивыборе */}
      {hasSelection && (
        <View style={styles.selectionActions}>
          <Button
            title={t('history.deleteSelected')}
            variant="destructive"
            onPress={handleDeleteSelected}
          />
          <Button
            title={t('history.cancel')}
            variant="ghost"
            onPress={clearSelection}
          />
        </View>
      )}

      {/* Список */}
      <FlatList
        data={records}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={records.length === 0 ? styles.emptyList : undefined}
      />

      {/* Кнопка очистки */}
      {records.length > 0 && !hasSelection && (
        <View style={styles.clearButton}>
          <Button
            title={t('history.clearHistory')}
            variant="destructive"
            onPress={handleClearHistory}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  searchInput: {
    backgroundColor: '#E5E5EA',
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
  },
  selectionActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  emptyList: { flex: 1 },
  clearButton: {
    padding: spacing.lg,
  },
});
