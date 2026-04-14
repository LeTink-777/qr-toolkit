/**
 * Discriminated union для безопасной обработки операций,
 * которые могут завершиться ошибкой (БД, FS, камера).
 *
 * @example
 * ```ts
 * const result = await fetchUser(id);
 * if (!result.ok) {
 *   logger.error(result.error);
 *   return;
 * }
 * // result.value — типобезопасно доступен
 * ```
 */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

/** Создать успешный результат */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

/** Создать результат с ошибкой */
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Обернуть Promise в Result — ловит любые исключения.
 *
 * @example
 * ```ts
 * const result = await tryCatch(() => db.getAllAsync(query));
 * ```
 */
export async function tryCatch<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    const value = await fn();
    return ok(value);
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e));
    return err(error);
  }
}
