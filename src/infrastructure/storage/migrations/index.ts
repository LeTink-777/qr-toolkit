import type * as SQLite from 'expo-sqlite';

import { logger } from '@/shared/lib/logger';

import { up as migration001 } from './001_init';

/** Список миграций в порядке применения */
const MIGRATIONS = [migration001];

/**
 * Применяет все миграции последовательно.
 * Использует user_version для отслеживания текущей версии.
 */
export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  const versionResult = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );
  const currentVersion = versionResult?.user_version ?? 0;

  const pendingMigrations = MIGRATIONS.slice(currentVersion);

  if (pendingMigrations.length === 0) {
    logger.debug('Миграции: все актуальны');
    return;
  }

  logger.info(`Миграции: применяю ${String(pendingMigrations.length)} миграций`);

  for (let i = 0; i < pendingMigrations.length; i++) {
    const migration = pendingMigrations[i];
    if (!migration) continue;

    const version = currentVersion + i + 1;
    logger.debug(`Миграция ${String(version)}...`);
    await migration(db);
    await db.execAsync(`PRAGMA user_version = ${String(version)}`);
  }

  logger.info(`Миграции: БД обновлена до версии ${String(currentVersion + pendingMigrations.length)}`);
}
