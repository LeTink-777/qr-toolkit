import { z } from 'zod';

/** Zod-схемы для валидации QR-пейлоадов */
export const urlPayloadSchema = z.object({
  type: z.literal('url'),
  url: z.string().url(),
  raw: z.string(),
});

export const textPayloadSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1),
  raw: z.string(),
});

export const wifiPayloadSchema = z.object({
  type: z.literal('wifi'),
  ssid: z.string().min(1),
  password: z.string(),
  encryption: z.enum(['WPA', 'WEP', 'nopass']),
  hidden: z.boolean(),
  raw: z.string(),
});

export const vcardPayloadSchema = z.object({
  type: z.literal('vcard'),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  org: z.string(),
  raw: z.string(),
});

export const emailPayloadSchema = z.object({
  type: z.literal('email'),
  address: z.string().email(),
  subject: z.string(),
  body: z.string(),
  raw: z.string(),
});

export const phonePayloadSchema = z.object({
  type: z.literal('phone'),
  number: z.string().min(1),
  raw: z.string(),
});

export const unknownPayloadSchema = z.object({
  type: z.literal('unknown'),
  raw: z.string(),
});

/** Общая схема для любого QR-пейлоада */
export const qrPayloadSchema = z.discriminatedUnion('type', [
  urlPayloadSchema,
  textPayloadSchema,
  wifiPayloadSchema,
  vcardPayloadSchema,
  emailPayloadSchema,
  phonePayloadSchema,
  unknownPayloadSchema,
]);
