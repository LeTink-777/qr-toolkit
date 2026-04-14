import { create } from 'zustand';

import type { ScanRecord } from '@/entities/scan-record';
import {
  clearAllRecords,
  deleteRecord,
  deleteRecords,
  getFilteredRecords,
} from '@/infrastructure/storage/repositories/scanRepository';
import { logger } from '@/shared/lib/logger';

import type { LoadingState, PayloadFilter, SourceFilter } from './types';

interface HistoryState {
  /** Список записей */
  records: ScanRecord[];
  /** Состояние загрузки */
  loadingState: LoadingState;
  /** Фильтр по источнику */
  sourceFilter: SourceFilter;
  /** Фильтр по типу пейлоада */
  payloadFilter: PayloadFilter;
  /** Поисковый запрос */
  searchQuery: string;
  /** ID выбранных записей (для мультивыбора) */
  selectedIds: Set<string>;

  /** Загрузить записи из БД */
  loadRecords: () => Promise<void>;
  /** Установить фильтр по источнику */
  setSourceFilter: (filter: SourceFilter) => void;
  /** Установить фильтр по типу */
  setPayloadFilter: (filter: PayloadFilter) => void;
  /** Установить поисковый запрос */
  setSearchQuery: (query: string) => void;
  /** Удалить одну запись */
  removeRecord: (id: string) => Promise<void>;
  /** Удалить выбранные записи */
  removeSelected: () => Promise<void>;
  /** Очистить всю историю */
  clearAll: () => Promise<void>;
  /** Переключить выбор записи */
  toggleSelection: (id: string) => void;
  /** Сбросить выбор */
  clearSelection: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  records: [],
  loadingState: 'idle',
  sourceFilter: 'all',
  payloadFilter: 'all',
  searchQuery: '',
  selectedIds: new Set(),

  loadRecords: async () => {
    set({ loadingState: 'loading' });

    const { sourceFilter, payloadFilter, searchQuery } = get();
    const source = sourceFilter === 'all' ? undefined : sourceFilter;
    const type = payloadFilter === 'all' ? undefined : payloadFilter;
    const query = searchQuery || undefined;

    const result = await getFilteredRecords(source, type, query);

    if (result.ok) {
      set({ records: result.value, loadingState: 'success' });
    } else {
      logger.error('Ошибка загрузки истории', { error: result.error.message });
      set({ loadingState: 'error' });
    }
  },

  setSourceFilter: (filter) => {
    set({ sourceFilter: filter });
    void get().loadRecords();
  },

  setPayloadFilter: (filter) => {
    set({ payloadFilter: filter });
    void get().loadRecords();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    void get().loadRecords();
  },

  removeRecord: async (id) => {
    const result = await deleteRecord(id);
    if (result.ok) {
      set((state) => ({ records: state.records.filter((r) => r.id !== id) }));
    }
  },

  removeSelected: async () => {
    const ids = Array.from(get().selectedIds);
    const result = await deleteRecords(ids);
    if (result.ok) {
      set((state) => ({
        records: state.records.filter((r) => !state.selectedIds.has(r.id)),
        selectedIds: new Set(),
      }));
    }
  },

  clearAll: async () => {
    const result = await clearAllRecords();
    if (result.ok) {
      set({ records: [], selectedIds: new Set() });
    }
  },

  toggleSelection: (id) => {
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next };
    });
  },

  clearSelection: () => set({ selectedIds: new Set() }),
}));
