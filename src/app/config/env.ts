import { z } from 'zod';

import { logger } from '@/shared/lib/logger';

/**
 * Zod-схема для валидации переменных окружения.
 * Приложение не запустится, если env невалиден.
 */
const envSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

function parseEnv() {
  const result = envSchema.safeParse({
    APP_ENV: process.env.APP_ENV,
  });

  if (!result.success) {
    logger.error('Невалидные переменные окружения', result.error.flatten());
    throw new Error(`Invalid environment variables: ${result.error.message}`);
  }

  return result.data;
}

/** Валидированные переменные окружения */
export const env = parseEnv();

/** true в development-режиме */
export const isDev = env.APP_ENV === 'development';

/** true в production-режиме */
export const isProd = env.APP_ENV === 'production';
