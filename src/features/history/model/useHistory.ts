import { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useHistoryStore } from './history.store';

/** Хук для экрана истории — загружает записи при фокусе */
export function useHistory() {
  const store = useHistoryStore();

  // Загружаем записи при фокусе экрана
  useFocusEffect(
    useCallback(() => {
      void store.loadRecords();
    }, [store]),
  );

  return store;
}
