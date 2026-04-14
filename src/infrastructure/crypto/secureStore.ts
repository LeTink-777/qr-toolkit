import * as SecureStore from 'expo-secure-store';

import { logger } from '@/shared/lib/logger';
import { err, ok, type Result } from '@/shared/lib/result';

/**
 * Обёртка над expo-secure-store с Result-паттерном.
 * Используется для хранения чувствительных данных.
 */

/** Сохранить значение в защищённом хранилище */
export async function saveSecure(key: string, value: string): Promise<Result<void>> {
  try {
    await SecureStore.setItemAsync(key, value);
    return ok(undefined);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    logger.error('SecureStore: ошибка сохранения', { key });
    return err(error);
  }
}

/** Получить значение из защищённого хранилища */
export async function getSecure(key: string): Promise<Result<string | null>> {
  try {
    const value = await SecureStore.getItemAsync(key);
    return ok(value);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    logger.error('SecureStore: ошибка чтения', { key });
    return err(error);
  }
}

/** Удалить значение из защищённого хранилища */
export async function deleteSecure(key: string): Promise<Result<void>> {
  try {
    await SecureStore.deleteItemAsync(key);
    return ok(undefined);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    logger.error('SecureStore: ошибка удаления', { key });
    return err(error);
  }
}
