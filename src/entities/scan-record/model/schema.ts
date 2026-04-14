import { z } from 'zod';

/** Zod-схема для валидации записи из БД */
export const scanRecordSchema = z.object({
  id: z.string().uuid(),
  data: z.string(),
  payloadType: z.enum(['url', 'text', 'wifi', 'vcard', 'email', 'phone', 'unknown']),
  source: z.enum(['scanned', 'generated']),
  createdAt: z.number(),
  contentHash: z.string(),
});

/** Схема для вставки — id и createdAt генерируются автоматически */
export const insertScanRecordSchema = scanRecordSchema.omit({
  id: true,
  createdAt: true,
  contentHash: true,
});
