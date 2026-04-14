import { useCallback, useRef } from 'react';
import type { BarcodeScanningResult } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';

import type { ScanRecord } from '@/entities/scan-record';
import { SCAN_DEBOUNCE_MS } from '@/app/config/constants';
import { hashContent } from '@/infrastructure/crypto/hash';
import { insertRecord } from '@/infrastructure/storage/repositories/scanRepository';
import { logger } from '@/shared/lib/logger';
import { usePermission } from '@/shared/lib/hooks/usePermission';
import { successHaptic } from '@/shared/ui/HapticFeedback';

import { parseQrPayload } from '../lib/parseQrPayload';
import { useScannerStore } from './scanner.store';

/** Хук с логикой сканирования QR-кодов */
export function useScanner() {
  const permission = usePermission('camera');
  const { status, lastPayload, lastScannedHash, lastScannedAt, setResult, resetResult } =
    useScannerStore();

  const isProcessingRef = useRef(false);

  /** Обработчик события сканирования штрих-кода */
  const onBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (isProcessingRef.current) return;
      if (status !== 'scanning') return;

      const raw = result.data;
      const hash = hashContent(raw);

      // Debounce: не сканируем тот же код повторно в течение SCAN_DEBOUNCE_MS
      if (hash === lastScannedHash && Date.now() - lastScannedAt < SCAN_DEBOUNCE_MS) {
        return;
      }

      isProcessingRef.current = true;

      const payload = parseQrPayload(raw);
      successHaptic();
      setResult(payload, hash);

      // Сохраняем в историю
      const record: ScanRecord = {
        id: generateId(),
        data: raw,
        payloadType: payload.type,
        source: 'scanned',
        createdAt: Date.now(),
        contentHash: hash,
      };

      insertRecord(record)
        .then((insertResult) => {
          if (!insertResult.ok) {
            logger.warn('Не удалось сохранить в историю', { error: insertResult.error.message });
          }
        })
        .catch((e: unknown) => {
          logger.error('Ошибка сохранения в историю', { error: e });
        })
        .finally(() => {
          isProcessingRef.current = false;
        });
    },
    [status, lastScannedHash, lastScannedAt, setResult],
  );

  /** Скопировать данные в буфер обмена */
  const copyToClipboard = useCallback(async (text: string) => {
    await Clipboard.setStringAsync(text);
  }, []);

  /** Открыть URL */
  const openUrl = useCallback(async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  }, []);

  /** Поделиться текстом */
  const share = useCallback(async (text: string) => {
    if (await Sharing.isAvailableAsync()) {
      // Sharing.shareAsync requires a file URI — use native share
      // For text sharing, we use Clipboard as fallback
      await Clipboard.setStringAsync(text);
    }
  }, []);

  return {
    permission,
    status,
    lastPayload,
    onBarcodeScanned,
    resetResult,
    copyToClipboard,
    openUrl,
    share,
  };
}

/** Генерация UUID v4 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
