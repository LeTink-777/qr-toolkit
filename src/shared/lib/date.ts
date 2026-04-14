/** Форматирует timestamp в локализованную дату */
export function formatDate(timestamp: number, locale = 'ru-RU'): string {
  return new Date(timestamp).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Форматирует timestamp в локализованное время */
export function formatTime(timestamp: number, locale = 'ru-RU'): string {
  return new Date(timestamp).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Форматирует timestamp в дату + время */
export function formatDateTime(timestamp: number, locale = 'ru-RU'): string {
  return `${formatDate(timestamp, locale)}, ${formatTime(timestamp, locale)}`;
}
