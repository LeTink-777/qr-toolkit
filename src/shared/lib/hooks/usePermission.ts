import { useCallback, useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

import { logger } from '@/shared/lib/logger';

type PermissionType = 'camera' | 'mediaLibrary';
type PermissionStatus = 'undetermined' | 'granted' | 'denied';

interface UsePermissionResult {
  /** Текущий статус разрешения */
  status: PermissionStatus;
  /** Запросить разрешение у пользователя */
  request: () => Promise<void>;
  /** true, если разрешение выдано */
  isGranted: boolean;
  /** true, если разрешение запрошено, но отклонено */
  isDenied: boolean;
}

/**
 * Универсальный хук для запроса разрешений.
 * Камера запрашивается только при заходе на экран сканера — не на старте.
 */
export function usePermission(type: PermissionType): UsePermissionResult {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');

  const checkPermission = useCallback(async () => {
    try {
      if (type === 'camera') {
        const result = await Camera.getCameraPermissionsAsync();
        setStatus(result.granted ? 'granted' : result.canAskAgain ? 'undetermined' : 'denied');
      } else {
        const result = await MediaLibrary.getPermissionsAsync();
        setStatus(result.granted ? 'granted' : result.canAskAgain ? 'undetermined' : 'denied');
      }
    } catch (e) {
      logger.error('Ошибка проверки разрешения', { type, error: e });
      setStatus('denied');
    }
  }, [type]);

  const request = useCallback(async () => {
    try {
      if (type === 'camera') {
        const result = await Camera.requestCameraPermissionsAsync();
        setStatus(result.granted ? 'granted' : 'denied');
      } else {
        const result = await MediaLibrary.requestPermissionsAsync();
        setStatus(result.granted ? 'granted' : 'denied');
      }
    } catch (e) {
      logger.error('Ошибка запроса разрешения', { type, error: e });
      setStatus('denied');
    }
  }, [type]);

  useEffect(() => {
    void checkPermission();
  }, [checkPermission]);

  return {
    status,
    request,
    isGranted: status === 'granted',
    isDenied: status === 'denied',
  };
}
