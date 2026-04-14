import type { PayloadType } from '@/entities/qr-payload';
import type { RecordSource, ScanRecord } from '@/entities/scan-record';
import { logger } from '@/shared/lib/logger';
import { err, ok, type Result, tryCatch } from '@/shared/lib/result';

import { getDatabase } from '../database';

/** Строка из SQLite до маппинга в доменный тип */
interface ScanRecordRow {
  id: string;
  data: string;
  payload_type: string;
  source: string;
  created_at: number;
  content_hash: string;
}

/** Конвертирует строку БД в доменный тип */
function mapRowToRecord(row: ScanRecordRow): ScanRecord {
  return {
    id: row.id,
    data: row.data,
    payloadType: row.payload_type as PayloadType,
    source: row.source as RecordSource,
    createdAt: row.created_at,
    contentHash: row.content_hash,
  };
}

/** Получить все записи, отсортированные по дате */
export async function getAllRecords(): Promise<Result<ScanRecord[]>> {
  return tryCatch(async () => {
    const db = getDatabase();
    const rows = await db.getAllAsync<ScanRecordRow>(
      'SELECT * FROM scan_records ORDER BY created_at DESC',
    );
    return rows.map(mapRowToRecord);
  });
}

/** Получить записи с фильтрацией */
export async function getFilteredRecords(
  source?: RecordSource,
  payloadType?: PayloadType,
  searchQuery?: string,
): Promise<Result<ScanRecord[]>> {
  return tryCatch(async () => {
    const db = getDatabase();
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (source) {
      conditions.push('source = ?');
      params.push(source);
    }
    if (payloadType) {
      conditions.push('payload_type = ?');
      params.push(payloadType);
    }
    if (searchQuery) {
      conditions.push('data LIKE ?');
      params.push(`%${searchQuery}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM scan_records ${whereClause} ORDER BY created_at DESC`;

    const rows = await db.getAllAsync<ScanRecordRow>(query, params);
    return rows.map(mapRowToRecord);
  });
}

/** Вставить запись с дедупликацией по content_hash */
export async function insertRecord(record: ScanRecord): Promise<Result<void>> {
  return tryCatch(async () => {
    const db = getDatabase();

    const existing = await db.getFirstAsync<{ id: string }>(
      'SELECT id FROM scan_records WHERE content_hash = ?',
      [record.contentHash],
    );

    if (existing) {
      logger.debug('Дубликат записи, пропускаю', { hash: record.contentHash });
      return;
    }

    await db.runAsync(
      `INSERT INTO scan_records (id, data, payload_type, source, created_at, content_hash)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.data,
        record.payloadType,
        record.source,
        record.createdAt,
        record.contentHash,
      ],
    );
  });
}

/** Удалить запись по id */
export async function deleteRecord(id: string): Promise<Result<void>> {
  return tryCatch(async () => {
    const db = getDatabase();
    await db.runAsync('DELETE FROM scan_records WHERE id = ?', [id]);
  });
}

/** Удалить несколько записей */
export async function deleteRecords(ids: string[]): Promise<Result<void>> {
  if (ids.length === 0) return ok(undefined);

  return tryCatch(async () => {
    const db = getDatabase();
    const placeholders = ids.map(() => '?').join(', ');
    await db.runAsync(`DELETE FROM scan_records WHERE id IN (${placeholders})`, ids);
  });
}

/** Очистить всю историю */
export async function clearAllRecords(): Promise<Result<void>> {
  return tryCatch(async () => {
    const db = getDatabase();
    await db.runAsync('DELETE FROM scan_records');
  });
}

/** Удалить записи старше указанного количества дней */
export async function deleteOldRecords(olderThanDays: number): Promise<Result<number>> {
  return tryCatch(async () => {
    const db = getDatabase();
    const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
    const result = await db.runAsync(
      'DELETE FROM scan_records WHERE created_at < ?',
      [cutoff],
    );
    return result.changes;
  });
}
