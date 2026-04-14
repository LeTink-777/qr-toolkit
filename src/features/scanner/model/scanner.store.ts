import { create } from 'zustand';

import type { QrPayload } from '@/entities/qr-payload';

import type { ScanStatus } from './types';

interface ScannerState {
  /** Текущий статус сканера */
  status: ScanStatus;
  /** Последний отсканированный пейлоад */
  lastPayload: QrPayload | null;
  /** Хеш последнего отсканированного кода (для debounce) */
  lastScannedHash: string | null;
  /** Timestamp последнего сканирования */
  lastScannedAt: number;

  /** Установить результат сканирования */
  setResult: (payload: QrPayload, hash: string) => void;
  /** Сбросить результат и вернуться к сканированию */
  resetResult: () => void;
  /** Приостановить сканирование */
  pause: () => void;
  /** Возобновить сканирование */
  resume: () => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
  status: 'scanning',
  lastPayload: null,
  lastScannedHash: null,
  lastScannedAt: 0,

  setResult: (payload, hash) =>
    set({
      status: 'result',
      lastPayload: payload,
      lastScannedHash: hash,
      lastScannedAt: Date.now(),
    }),

  resetResult: () =>
    set({
      status: 'scanning',
      lastPayload: null,
    }),

  pause: () => set({ status: 'paused' }),
  resume: () => set({ status: 'scanning' }),
}));
