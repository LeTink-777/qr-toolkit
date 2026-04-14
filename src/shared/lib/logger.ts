/**
 * Логгер с уровнями. В production режиме выводит только warn и error.
 * Автоматически фильтрует чувствительные поля (password, secure, token).
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const SENSITIVE_KEYS = new Set(['password', 'token', 'secret', 'secure', 'wifi.password']);

const MIN_LEVEL: LogLevel = __DEV__ ? 'debug' : 'warn';

/** Рекурсивно маскирует чувствительные поля в объектах */
function sanitize(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return value;

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(val);
      }
    }
    return sanitized;
  }

  return String(value);
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[MIN_LEVEL];
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  if (!shouldLog(level)) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  const sanitizedArgs = args.map(sanitize);

  switch (level) {
    case 'debug':
    case 'info':
      // eslint-disable-next-line no-console
      console.log(prefix, message, ...sanitizedArgs);
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(prefix, message, ...sanitizedArgs);
      break;
    case 'error':
      // eslint-disable-next-line no-console
      console.error(prefix, message, ...sanitizedArgs);
      break;
  }
}

export const logger = {
  /** Отладочные сообщения — только в development */
  debug: (message: string, ...args: unknown[]) => log('debug', message, ...args),
  /** Информационные сообщения */
  info: (message: string, ...args: unknown[]) => log('info', message, ...args),
  /** Предупреждения */
  warn: (message: string, ...args: unknown[]) => log('warn', message, ...args),
  /** Ошибки */
  error: (message: string, ...args: unknown[]) => log('error', message, ...args),
};
