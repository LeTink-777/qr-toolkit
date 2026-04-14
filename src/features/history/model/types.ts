import type { PayloadType } from '@/entities/qr-payload';
import type { RecordSource } from '@/entities/scan-record';

/** Фильтр по источнику */
export type SourceFilter = 'all' | RecordSource;

/** Фильтр по типу пейлоада */
export type PayloadFilter = 'all' | PayloadType;

/** Состояние загрузки */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
