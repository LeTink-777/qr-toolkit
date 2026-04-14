import type { QrPayload } from '@/entities/qr-payload';

/** Состояния сканера */
export type ScanStatus = 'idle' | 'scanning' | 'paused' | 'result';

/** Результат сканирования */
export interface ScanResult {
  /** Распарсенный пейлоад */
  payload: QrPayload;
  /** Timestamp сканирования */
  timestamp: number;
}
