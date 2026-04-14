/**
 * Дискриминированный юнион типов QR-пейлоадов.
 * Каждый тип содержит свои специфичные поля.
 */

/** URL-ссылка */
export interface UrlPayload {
  readonly type: 'url';
  readonly url: string;
  readonly raw: string;
}

/** Произвольный текст */
export interface TextPayload {
  readonly type: 'text';
  readonly text: string;
  readonly raw: string;
}

/** Wi-Fi конфигурация */
export interface WifiPayload {
  readonly type: 'wifi';
  readonly ssid: string;
  readonly password: string;
  readonly encryption: 'WPA' | 'WEP' | 'nopass';
  readonly hidden: boolean;
  readonly raw: string;
}

/** Контактная карточка vCard */
export interface VCardPayload {
  readonly type: 'vcard';
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly org: string;
  readonly raw: string;
}

/** Email-ссылка */
export interface EmailPayload {
  readonly type: 'email';
  readonly address: string;
  readonly subject: string;
  readonly body: string;
  readonly raw: string;
}

/** Телефонный номер */
export interface PhonePayload {
  readonly type: 'phone';
  readonly number: string;
  readonly raw: string;
}

/** Нераспознанный формат */
export interface UnknownPayload {
  readonly type: 'unknown';
  readonly raw: string;
}

/** Все возможные QR-пейлоады */
export type QrPayload =
  | UrlPayload
  | TextPayload
  | WifiPayload
  | VCardPayload
  | EmailPayload
  | PhonePayload
  | UnknownPayload;

/** Все типы пейлоадов */
export type PayloadType = QrPayload['type'];

/** Типы, доступные для генерации QR-кодов */
export type GeneratablePayloadType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'phone';
