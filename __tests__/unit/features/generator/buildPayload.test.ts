import { buildPayload } from '../../../../src/features/generator/lib/buildPayload';
import type { WifiBuildData, VCardBuildData, EmailBuildData } from '../../../../src/features/generator/lib/buildPayload';

describe('buildPayload', () => {
  describe('URL', () => {
    it('should return URL as-is', () => {
      expect(buildPayload('url', 'https://example.com')).toBe('https://example.com');
    });
  });

  describe('Text', () => {
    it('should return text as-is', () => {
      expect(buildPayload('text', 'Hello world')).toBe('Hello world');
    });
  });

  describe('WiFi', () => {
    it('should build WiFi payload with WPA', () => {
      const data: WifiBuildData = {
        ssid: 'MyNetwork',
        password: 'secret123',
        encryption: 'WPA',
        hidden: false,
      };
      const result = buildPayload('wifi', data);
      expect(result).toContain('WIFI:');
      expect(result).toContain('T:WPA');
      expect(result).toContain('S:MyNetwork');
      expect(result).toContain('P:secret123');
      expect(result).toEndWith(';;');
    });

    it('should build WiFi payload with hidden network', () => {
      const data: WifiBuildData = {
        ssid: 'Hidden',
        password: 'pass',
        encryption: 'WPA',
        hidden: true,
      };
      const result = buildPayload('wifi', data);
      expect(result).toContain('H:true');
    });

    it('should omit password for nopass encryption', () => {
      const data: WifiBuildData = {
        ssid: 'OpenNet',
        password: '',
        encryption: 'nopass',
        hidden: false,
      };
      const result = buildPayload('wifi', data);
      expect(result).toContain('T:nopass');
      expect(result).not.toContain('P:');
    });

    it('should escape special characters in SSID', () => {
      const data: WifiBuildData = {
        ssid: 'My;Network',
        password: 'pass',
        encryption: 'WPA',
        hidden: false,
      };
      const result = buildPayload('wifi', data);
      expect(result).toContain('S:My\\;Network');
    });
  });

  describe('vCard', () => {
    it('should build vCard with all fields', () => {
      const data: VCardBuildData = {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        org: 'Acme Inc.',
      };
      const result = buildPayload('vcard', data);
      expect(result).toContain('BEGIN:VCARD');
      expect(result).toContain('VERSION:3.0');
      expect(result).toContain('FN:John Doe');
      expect(result).toContain('TEL:+1234567890');
      expect(result).toContain('EMAIL:john@example.com');
      expect(result).toContain('ORG:Acme Inc.');
      expect(result).toContain('END:VCARD');
    });

    it('should omit empty fields', () => {
      const data: VCardBuildData = {
        name: 'Jane',
        phone: '',
        email: '',
        org: '',
      };
      const result = buildPayload('vcard', data);
      expect(result).toContain('FN:Jane');
      expect(result).not.toContain('TEL:');
      expect(result).not.toContain('EMAIL:');
    });
  });

  describe('Email', () => {
    it('should build mailto with subject and body', () => {
      const data: EmailBuildData = {
        address: 'user@example.com',
        subject: 'Hello',
        body: 'World',
      };
      const result = buildPayload('email', data);
      expect(result).toBe('mailto:user@example.com?subject=Hello&body=World');
    });

    it('should build mailto without optional params', () => {
      const data: EmailBuildData = {
        address: 'user@example.com',
        subject: '',
        body: '',
      };
      const result = buildPayload('email', data);
      expect(result).toBe('mailto:user@example.com');
    });
  });

  describe('Phone', () => {
    it('should build tel URI', () => {
      expect(buildPayload('phone', '+1234567890')).toBe('tel:+1234567890');
    });
  });
});
