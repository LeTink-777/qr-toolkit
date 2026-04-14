import type * as SQLite from 'expo-sqlite';

/** Начальная миграция — создание таблицы scan_records */
export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS scan_records (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      payload_type TEXT NOT NULL,
      source TEXT NOT NULL CHECK (source IN ('scanned', 'generated')),
      created_at INTEGER NOT NULL,
      content_hash TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_scan_records_created_at
      ON scan_records (created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_scan_records_payload_type
      ON scan_records (payload_type);

    CREATE INDEX IF NOT EXISTS idx_scan_records_source
      ON scan_records (source);

    CREATE UNIQUE INDEX IF NOT EXISTS idx_scan_records_content_hash
      ON scan_records (content_hash);
  `);
}
