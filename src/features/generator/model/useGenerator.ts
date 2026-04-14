import { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { ScanRecord } from '@/entities/scan-record';
import { hashContent } from '@/infrastructure/crypto/hash';
import { insertRecord } from '@/infrastructure/storage/repositories/scanRepository';
import { logger } from '@/shared/lib/logger';
import { successHaptic } from '@/shared/ui/HapticFeedback';

import { saveQrToGallery, shareQr } from '../lib/exportQr';
import { useGeneratorStore } from './generator.store';

/** Хук с логикой генерации QR-кодов */
export function useGenerator() {
  const { t } = useTranslation();
  const store = useGeneratorStore();
  const svgRef = useRef<{ toDataURL: (callback: (data: string) => void) => void } | null>(null);

  /** Сохранить сгенерированный QR-код в историю */
  const saveToHistory = useCallback(
    async (data: string) => {
      const record: ScanRecord = {
        id: generateId(),
        data,
        payloadType: store.payloadType,
        source: 'generated',
        createdAt: Date.now(),
        contentHash: hashContent(data),
      };

      const result = await insertRecord(record);
      if (!result.ok) {
        logger.warn('Не удалось сохранить в историю', { error: result.error.message });
      }
    },
    [store.payloadType],
  );

  /** Установить QR-значение и сохранить в историю */
  const generate = useCallback(
    (value: string) => {
      store.setQrValue(value);
      successHaptic();
      void saveToHistory(value);
    },
    [store, saveToHistory],
  );

  /** Сохранить QR-код в галерею */
  const handleSaveToGallery = useCallback(() => {
    if (!svgRef.current) return;
    svgRef.current.toDataURL(async (dataUrl: string) => {
      const result = await saveQrToGallery(dataUrl);
      if (result.ok) {
        Alert.alert(t('generator.saved'));
      } else {
        Alert.alert(t('common.error'), result.error.message);
      }
    });
  }, [t]);

  /** Поделиться QR-кодом */
  const handleShare = useCallback(() => {
    if (!svgRef.current) return;
    svgRef.current.toDataURL(async (dataUrl: string) => {
      const result = await shareQr(dataUrl);
      if (!result.ok) {
        logger.warn('Ошибка при share', { error: result.error.message });
      }
    });
  }, []);

  return {
    payloadType: store.payloadType,
    setPayloadType: store.setPayloadType,
    customization: store.customization,
    updateCustomization: store.updateCustomization,
    qrValue: store.qrValue,
    generate,
    svgRef,
    handleSaveToGallery,
    handleShare,
    reset: store.reset,
  };
}

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
