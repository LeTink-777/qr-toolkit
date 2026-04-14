import * as Haptics from 'expo-haptics';

import { logger } from '@/shared/lib/logger';

/** Лёгкая тактильная обратная связь (нажатие кнопки) */
export function lightHaptic(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch((e: unknown) => {
    logger.debug('Haptic feedback не доступен', { error: e });
  });
}

/** Средняя тактильная обратная связь */
export function mediumHaptic(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((e: unknown) => {
    logger.debug('Haptic feedback не доступен', { error: e });
  });
}

/** Обратная связь при успешном действии */
export function successHaptic(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch((e: unknown) => {
    logger.debug('Haptic feedback не доступен', { error: e });
  });
}

/** Обратная связь при ошибке */
export function errorHaptic(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch((e: unknown) => {
    logger.debug('Haptic feedback не доступен', { error: e });
  });
}
