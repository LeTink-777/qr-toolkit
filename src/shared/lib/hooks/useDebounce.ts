import { useEffect, useState } from 'react';

/**
 * Debounce хук — задерживает обновление значения на указанное время.
 *
 * @param value - значение для debounce
 * @param delayMs - задержка в миллисекундах
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
