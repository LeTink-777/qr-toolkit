import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Подписывается на изменения состояния приложения (active / background / inactive).
 *
 * @param onChange - колбэк при смене состояния
 */
export function useAppState(onChange: (state: AppStateStatus) => void): void {
  const callbackRef = useRef(onChange);
  callbackRef.current = onChange;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      callbackRef.current(state);
    });
    return () => subscription.remove();
  }, []);
}
