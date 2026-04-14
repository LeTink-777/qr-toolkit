/** Название приложения */
export const APP_NAME = 'QR Toolkit';

/** Версия приложения */
export const APP_VERSION = '1.0.0';

/** Максимальное количество записей в истории */
export const MAX_HISTORY_ITEMS = 1000;

/** Debounce между сканированиями одного и того же кода (мс) */
export const SCAN_DEBOUNCE_MS = 1500;

/** Размер QR-кода по умолчанию (px) */
export const DEFAULT_QR_SIZE = 280;

/** Минимальный размер QR-кода */
export const MIN_QR_SIZE = 150;

/** Максимальный размер QR-кода */
export const MAX_QR_SIZE = 400;

/** Имя файла БД */
export const DATABASE_NAME = 'qr-toolkit.db';

/** Опции автоочистки (в днях, 0 = никогда) */
export const AUTO_CLEANUP_OPTIONS = [0, 7, 30] as const;
export type AutoCleanupDays = (typeof AUTO_CLEANUP_OPTIONS)[number];
