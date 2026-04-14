import { validateUrl } from '../../../../src/features/scanner/lib/validateUrl';

describe('validateUrl', () => {
  describe('safe URLs', () => {
    it('should accept standard https URL', () => {
      expect(validateUrl('https://example.com')).toEqual({ safe: true });
    });

    it('should accept URL with path and query', () => {
      expect(validateUrl('https://example.com/path?q=hello')).toEqual({ safe: true });
    });

    it('should accept known domains', () => {
      expect(validateUrl('https://google.com')).toEqual({ safe: true });
      expect(validateUrl('https://github.com/user/repo')).toEqual({ safe: true });
    });
  });

  describe('punycode detection', () => {
    it('should flag punycode domains', () => {
      const result = validateUrl('https://xn--80ak6aa92e.com');
      expect(result.safe).toBe(false);
      expect(result.reasonKey).toBe('punycode');
    });
  });

  describe('IP address detection', () => {
    it('should flag IPv4 addresses', () => {
      const result = validateUrl('https://192.168.1.1/phishing');
      expect(result.safe).toBe(false);
      expect(result.reasonKey).toBe('ipAddress');
    });

    it('should flag localhost', () => {
      const result = validateUrl('http://127.0.0.1');
      expect(result.safe).toBe(false);
      expect(result.reasonKey).toBe('ipAddress');
    });
  });

  describe('URL shorteners', () => {
    it('should flag bit.ly', () => {
      const result = validateUrl('https://bit.ly/abc123');
      expect(result.safe).toBe(false);
      expect(result.reasonKey).toBe('shortener');
    });

    it('should flag tinyurl.com', () => {
      const result = validateUrl('https://tinyurl.com/xyz');
      expect(result.safe).toBe(false);
      expect(result.reasonKey).toBe('shortener');
    });

    it('should flag t.co', () => {
      const result = validateUrl('https://t.co/abc');
      expect(result.safe).toBe(false);
      expect(result.reasonKey).toBe('shortener');
    });
  });

  describe('suspicious TLDs', () => {
    it('should flag .tk domains', () => {
      const result = validateUrl('https://free-iphone.tk');
      expect(result.safe).toBe(false);
      expect(result.reasonKey).toBe('suspiciousTld');
    });

    it('should flag .xyz domains', () => {
      const result = validateUrl('https://phishing.xyz');
      expect(result.safe).toBe(false);
      expect(result.reasonKey).toBe('suspiciousTld');
    });
  });

  describe('invalid URLs', () => {
    it('should flag invalid URL', () => {
      const result = validateUrl('not a url');
      expect(result.safe).toBe(false);
    });
  });
});
