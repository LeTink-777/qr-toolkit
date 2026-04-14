/**
 * SHA-256 хеширование для дедупликации контента в истории.
 * Использует expo-crypto для нативной реализации.
 */

/** Простая хеш-функция на основе djb2 для строк (синхронная, быстрая) */
export function hashContent(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0;
  }
  return `h_${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
