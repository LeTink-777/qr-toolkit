import type { GeneratablePayloadType } from '@/entities/qr-payload';

/** Данные для построения Wi-Fi пейлоада */
export interface WifiBuildData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

/** Данные для построения vCard пейлоада */
export interface VCardBuildData {
  name: string;
  phone: string;
  email: string;
  org: string;
}

/** Данные для построения Email пейлоада */
export interface EmailBuildData {
  address: string;
  subject: string;
  body: string;
}

type BuildData = string | WifiBuildData | VCardBuildData | EmailBuildData;

/**
 * Сериализует данные в строку для QR-кода.
 * Каждый тип пейлоада имеет свой формат.
 */
export function buildPayload(type: GeneratablePayloadType, data: BuildData): string {
  switch (type) {
    case 'url':
      return data as string;

    case 'text':
      return data as string;

    case 'wifi':
      return buildWifiPayload(data as WifiBuildData);

    case 'vcard':
      return buildVCardPayload(data as VCardBuildData);

    case 'email':
      return buildEmailPayload(data as EmailBuildData);

    case 'phone':
      return `tel:${data as string}`;
  }
}

function buildWifiPayload(data: WifiBuildData): string {
  const parts = [
    `T:${data.encryption}`,
    `S:${escapeWifiField(data.ssid)}`,
  ];

  if (data.encryption !== 'nopass' && data.password) {
    parts.push(`P:${escapeWifiField(data.password)}`);
  }

  if (data.hidden) {
    parts.push('H:true');
  }

  return `WIFI:${parts.join(';')};;`;
}

function escapeWifiField(value: string): string {
  return value.replace(/([\\;,:"'])/g, '\\$1');
}

function buildVCardPayload(data: VCardBuildData): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];

  if (data.name) lines.push(`FN:${data.name}`);
  if (data.phone) lines.push(`TEL:${data.phone}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.org) lines.push(`ORG:${data.org}`);

  lines.push('END:VCARD');
  return lines.join('\n');
}

function buildEmailPayload(data: EmailBuildData): string {
  const params = new URLSearchParams();
  if (data.subject) params.set('subject', data.subject);
  if (data.body) params.set('body', data.body);

  const query = params.toString();
  return `mailto:${data.address}${query ? `?${query}` : ''}`;
}
