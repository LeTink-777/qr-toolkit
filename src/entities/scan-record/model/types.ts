import type { PayloadType } from '@/entities/qr-payload';

/** Источник записи */
export type RecordSource = 'scanned' | 'generated';

/** Запись из истории сканирований/генераций */
export interface ScanRecord {
  readonly id: string;
  /** Сырые данные QR-кода */
  readonly data: string;
  /** Тип пейлоада */
  readonly payloadType: PayloadType;
  /** Источник: сканирован или сгенерирован */
  readonly source: RecordSource;
  /** Timestamp создания */
  readonly createdAt: number;
  /** SHA-256 хеш контента для дедупликации */
  readonly contentHash: string;
}
