import { hashContent } from '../../../src/infrastructure/crypto/hash';

describe('hashContent', () => {
  it('should return consistent hash for same input', () => {
    const hash1 = hashContent('hello');
    const hash2 = hashContent('hello');
    expect(hash1).toBe(hash2);
  });

  it('should return different hashes for different inputs', () => {
    const hash1 = hashContent('hello');
    const hash2 = hashContent('world');
    expect(hash1).not.toBe(hash2);
  });

  it('should return string starting with h_', () => {
    const hash = hashContent('test');
    expect(hash).toMatch(/^h_[a-f0-9]{8}$/);
  });

  it('should handle empty string', () => {
    const hash = hashContent('');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });

  it('should handle unicode', () => {
    const hash = hashContent('Привет мир 🌍');
    expect(hash).toMatch(/^h_[a-f0-9]{8}$/);
  });
});
