/**
 * Валидация URL на подозрительность.
 * Проверяет: punycode, IP-адреса, URL-шортнеры, подозрительные TLD.
 */

/** Результат валидации URL */
export interface UrlValidationResult {
  /** Безопасен ли URL */
  safe: boolean;
  /** Код причины (для локализации) */
  reasonKey?: string;
}

/** Известные URL-шортнеры */
const URL_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'rebrand.ly',
  'shorturl.at',
  'cutt.ly',
  'rb.gy',
  'clck.ru',
  'vk.cc',
]);

/** Подозрительные TLD */
const SUSPICIOUS_TLDS = new Set([
  '.tk',
  '.ml',
  '.ga',
  '.cf',
  '.gq',
  '.xyz',
  '.top',
  '.work',
  '.click',
  '.loan',
  '.racing',
  '.win',
  '.bid',
  '.download',
]);

/** Regex для IPv4 адресов */
const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;

/** Regex для IPv6 адресов (упрощённый) */
const IPV6_REGEX = /^\[?[a-fA-F0-9:]+\]?$/;

/**
 * Проверяет URL на подозрительность.
 * Возвращает `{ safe: false, reasonKey }` если URL подозрителен.
 */
export function validateUrl(url: string): UrlValidationResult {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return { safe: false, reasonKey: 'suspiciousTld' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Punycode (xn--) — потенциальная подмена символов
  if (hostname.includes('xn--')) {
    return { safe: false, reasonKey: 'punycode' };
  }

  // IP-адрес вместо домена
  if (IPV4_REGEX.test(hostname) || IPV6_REGEX.test(hostname)) {
    return { safe: false, reasonKey: 'ipAddress' };
  }

  // Известные URL-шортнеры
  if (URL_SHORTENERS.has(hostname)) {
    return { safe: false, reasonKey: 'shortener' };
  }

  // Подозрительные TLD
  for (const tld of SUSPICIOUS_TLDS) {
    if (hostname.endsWith(tld)) {
      return { safe: false, reasonKey: 'suspiciousTld' };
    }
  }

  return { safe: true };
}
