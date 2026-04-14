import type {
  EmailPayload,
  PhonePayload,
  QrPayload,
  UrlPayload,
  VCardPayload,
  WifiPayload,
} from '@/entities/qr-payload';
import { logger } from '@/shared/lib/logger';

/**
 * Парсит сырую строку QR-кода в типизированный пейлоад.
 * Использует дискриминированные юнионы — невалидные данные
 * попадают в ветку `{ type: 'unknown' }`.
 */
export function parseQrPayload(raw: string): QrPayload {
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return { type: 'unknown', raw };
  }

  // Wi-Fi: WIFI:T:WPA;S:MyNetwork;P:password;H:false;;
  if (trimmed.startsWith('WIFI:')) {
    return parseWifi(trimmed);
  }

  // vCard: BEGIN:VCARD
  if (trimmed.startsWith('BEGIN:VCARD')) {
    return parseVCard(trimmed);
  }

  // Email: mailto:
  if (trimmed.toLowerCase().startsWith('mailto:')) {
    return parseEmail(trimmed);
  }

  // Phone: tel:
  if (trimmed.toLowerCase().startsWith('tel:')) {
    return parsePhone(trimmed);
  }

  // URL
  if (isUrl(trimmed)) {
    return parseUrl(trimmed);
  }

  // Текст по умолчанию
  return { type: 'text', text: trimmed, raw };
}

function isUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseUrl(raw: string): UrlPayload {
  return { type: 'url', url: raw, raw };
}

function parseWifi(raw: string): WifiPayload {
  const params = new Map<string, string>();

  // Формат: WIFI:T:WPA;S:MySSID;P:MyPass;H:true;;
  const body = raw.slice(5); // убираем "WIFI:"
  const parts = body.split(';');

  for (const part of parts) {
    const colonIndex = part.indexOf(':');
    if (colonIndex === -1) continue;
    const key = part.slice(0, colonIndex);
    const value = part.slice(colonIndex + 1);
    if (key) params.set(key, value);
  }

  const encryption = params.get('T') ?? 'WPA';
  const validEncryption =
    encryption === 'WPA' || encryption === 'WEP' || encryption === 'nopass'
      ? encryption
      : 'WPA';

  return {
    type: 'wifi',
    ssid: params.get('S') ?? '',
    password: params.get('P') ?? '',
    encryption: validEncryption,
    hidden: params.get('H') === 'true',
    raw,
  };
}

function parseVCard(raw: string): VCardPayload {
  const getValue = (field: string): string => {
    const regex = new RegExp(`^${field}[;:](.+)$`, 'im');
    const match = raw.match(regex);
    return match?.[1]?.trim() ?? '';
  };

  return {
    type: 'vcard',
    name: getValue('FN'),
    phone: getValue('TEL'),
    email: getValue('EMAIL'),
    org: getValue('ORG'),
    raw,
  };
}

function parseEmail(raw: string): EmailPayload {
  try {
    const mailtoUrl = new URL(raw);
    const address = mailtoUrl.pathname || '';
    const subject = mailtoUrl.searchParams.get('subject') ?? '';
    const body = mailtoUrl.searchParams.get('body') ?? '';

    return { type: 'email', address, subject, body, raw };
  } catch {
    logger.debug('Не удалось распарсить mailto', { raw });
    return { type: 'email', address: raw.slice(7), subject: '', body: '', raw };
  }
}

function parsePhone(raw: string): PhonePayload {
  const number = raw.slice(4).replace(/\s+/g, '');
  return { type: 'phone', number, raw };
}
