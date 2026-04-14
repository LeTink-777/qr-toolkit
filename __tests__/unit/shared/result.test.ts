import { ok, err, tryCatch } from '../../../src/shared/lib/result';

describe('Result pattern', () => {
  describe('ok()', () => {
    it('should create success result', () => {
      const result = ok(42);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });
  });

  describe('err()', () => {
    it('should create error result', () => {
      const error = new Error('test error');
      const result = err(error);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('test error');
      }
    });
  });

  describe('tryCatch()', () => {
    it('should wrap successful async into ok', async () => {
      const result = await tryCatch(async () => 'hello');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('hello');
      }
    });

    it('should wrap thrown Error into err', async () => {
      const result = await tryCatch(async () => {
        throw new Error('boom');
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('boom');
      }
    });

    it('should wrap non-Error throw into Error', async () => {
      const result = await tryCatch(async () => {
        throw 'string error';  // eslint-disable-line no-throw-literal
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('string error');
      }
    });
  });
});
