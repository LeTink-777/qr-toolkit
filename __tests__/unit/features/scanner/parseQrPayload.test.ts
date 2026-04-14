import { parseQrPayload } from '../../../../src/features/scanner/lib/parseQrPayload';

describe('parseQrPayload', () => {
  describe('URL', () => {
    it('should parse https URL', () => {
      const result = parseQrPayload('https://example.com');
      expect(result.type).toBe('url');
      if (result.type === 'url') {
        expect(result.url).toBe('https://example.com');
      }
    });

    it('should parse http URL', () => {
      const result = parseQrPayload('http://example.com/path?q=1');
      expect(result.type).toBe('url');
    });

    it('should not parse non-http URLs as url type', () => {
      const result = parseQrPayload('ftp://example.com');
      expect(result.type).toBe('text');
    });
  });

  describe('WiFi', () => {
    it('should parse WiFi with WPA encryption', () => {
      const result = parseQrPayload('WIFI:T:WPA;S:MyNetwork;P:mypassword;;');
      expect(result.type).toBe('wifi');
      if (result.type === 'wifi') {
        expect(result.ssid).toBe('MyNetwork');
        expect(result.password).toBe('mypassword');
        expect(result.encryption).toBe('WPA');
        expect(result.hidden).toBe(false);
      }
    });

    it('should parse WiFi with hidden network', () => {
      const result = parseQrPayload('WIFI:T:WPA;S:Hidden;P:pass;H:true;;');
      expect(result.type).toBe('wifi');
      if (result.type === 'wifi') {
        expect(result.hidden).toBe(true);
      }
    });

    it('should parse WiFi without password (nopass)', () => {
      const result = parseQrPayload('WIFI:T:nopass;S:OpenNet;;');
      expect(result.type).toBe('wifi');
      if (result.type === 'wifi') {
        expect(result.encryption).toBe('nopass');
        expect(result.password).toBe('');
      }
    });

    it('should default encryption to WPA for unknown values', () => {
      const result = parseQrPayload('WIFI:T:UNKNOWN;S:Net;P:pass;;');
      expect(result.type).toBe('wifi');
      if (result.type === 'wifi') {
        expect(result.encryption).toBe('WPA');
      }
    });
  });

  describe('vCard', () => {
    it('should parse vCard with full data', () => {
      const raw = 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nORG:Acme\nEND:VCARD';
      const result = parseQrPayload(raw);
      expect(result.type).toBe('vcard');
      if (result.type === 'vcard') {
        expect(result.name).toBe('John Doe');
        expect(result.phone).toBe('+1234567890');
        expect(result.email).toBe('john@example.com');
        expect(result.org).toBe('Acme');
      }
    });

    it('should handle vCard with missing fields', () => {
      const raw = 'BEGIN:VCARD\nVERSION:3.0\nFN:Jane\nEND:VCARD';
      const result = parseQrPayload(raw);
      expect(result.type).toBe('vcard');
      if (result.type === 'vcard') {
        expect(result.name).toBe('Jane');
        expect(result.phone).toBe('');
        expect(result.email).toBe('');
      }
    });
  });

  describe('Email', () => {
    it('should parse mailto link', () => {
      const result = parseQrPayload('mailto:user@example.com?subject=Hello&body=World');
      expect(result.type).toBe('email');
      if (result.type === 'email') {
        expect(result.address).toBe('user@example.com');
        expect(result.subject).toBe('Hello');
        expect(result.body).toBe('World');
      }
    });

    it('should parse mailto without params', () => {
      const result = parseQrPayload('mailto:test@mail.com');
      expect(result.type).toBe('email');
      if (result.type === 'email') {
        expect(result.address).toBe('test@mail.com');
        expect(result.subject).toBe('');
      }
    });
  });

  describe('Phone', () => {
    it('should parse tel link', () => {
      const result = parseQrPayload('tel:+1234567890');
      expect(result.type).toBe('phone');
      if (result.type === 'phone') {
        expect(result.number).toBe('+1234567890');
      }
    });
  });

  describe('Text / Unknown', () => {
    it('should parse plain text', () => {
      const result = parseQrPayload('Hello, world!');
      expect(result.type).toBe('text');
      if (result.type === 'text') {
        expect(result.text).toBe('Hello, world!');
      }
    });

    it('should handle empty string as unknown', () => {
      const result = parseQrPayload('');
      expect(result.type).toBe('unknown');
    });

    it('should handle whitespace as unknown', () => {
      const result = parseQrPayload('   ');
      expect(result.type).toBe('unknown');
    });

    it('should preserve raw data', () => {
      const raw = 'some random text';
      const result = parseQrPayload(raw);
      expect(result.raw).toBe(raw);
    });
  });
});
