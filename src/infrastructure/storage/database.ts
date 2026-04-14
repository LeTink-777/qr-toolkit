import * as SQLite from 'expo-sqlite';

import { DATABASE_NAME } from '@/app/config/constants';
import { logger } from '@/shared/lib/logger';
import { err, ok, type Result } from '@/shared/lib/result';

import { runMigrations } from './migrations';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Открывает БД и применяет миграции.
 * Возвращает Result — приложение может обработать ошибку gracefully.
 */
export async function initDatabase(): Promise<Result<SQLite.SQLiteDatabase>> {
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await runMigrations(db);
    logger.info('База данных инициализирована');
    return ok(db);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    logger.error('Ошибка инициализации БД', { error: error.message });
    return err(error);
  }
}

/**
 * Получить экземпляр БД.
 * @throws если БД не инициализирована
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}
