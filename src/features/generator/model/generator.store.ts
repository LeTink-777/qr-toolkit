import { create } from 'zustand';

import type { GeneratablePayloadType } from '@/entities/qr-payload';
import { DEFAULT_QR_SIZE } from '@/app/config/constants';

/** Настройки внешнего вида QR-кода */
export interface QrCustomization {
  foregroundColor: string;
  backgroundColor: string;
  size: number;
}

interface GeneratorState {
  /** Текущий выбранный тип пейлоада */
  payloadType: GeneratablePayloadType;
  /** Настройки внешнего вида */
  customization: QrCustomization;
  /** Сгенерированное значение (строка для QR-кода) */
  qrValue: string | null;

  /** Установить тип пейлоада */
  setPayloadType: (type: GeneratablePayloadType) => void;
  /** Установить значение QR-кода */
  setQrValue: (value: string | null) => void;
  /** Обновить настройки внешнего вида */
  updateCustomization: (patch: Partial<QrCustomization>) => void;
  /** Сбросить генератор */
  reset: () => void;
}

const INITIAL_CUSTOMIZATION: QrCustomization = {
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF',
  size: DEFAULT_QR_SIZE,
};

export const useGeneratorStore = create<GeneratorState>((set) => ({
  payloadType: 'url',
  customization: INITIAL_CUSTOMIZATION,
  qrValue: null,

  setPayloadType: (type) => set({ payloadType: type, qrValue: null }),
  setQrValue: (value) => set({ qrValue: value }),
  updateCustomization: (patch) =>
    set((state) => ({
      customization: { ...state.customization, ...patch },
    })),
  reset: () => set({ payloadType: 'url', qrValue: null, customization: INITIAL_CUSTOMIZATION }),
}));
