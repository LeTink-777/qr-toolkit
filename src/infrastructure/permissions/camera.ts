import { Camera } from 'expo-camera';

import { logger } from '@/shared/lib/logger';
import { err, ok, type Result } from '@/shared/lib/result';

/** Запросить разрешение на камеру */
export async function requestCameraPermission(): Promise<Result<boolean>> {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    const granted = status === 'granted';
    logger.info('Разрешение камеры', { granted });
    return ok(granted);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    logger.error('Ошибка запроса разрешения камеры', { error: error.message });
    return err(error);
  }
}

/** Проверить текущий статус разрешения камеры */
export async function checkCameraPermission(): Promise<Result<boolean>> {
  try {
    const { status } = await Camera.getCameraPermissionsAsync();
    return ok(status === 'granted');
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    return err(error);
  }
}
