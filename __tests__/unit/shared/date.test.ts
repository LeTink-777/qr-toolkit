import { formatDate, formatTime, formatDateTime } from '../../../src/shared/lib/date';

describe('date utilities', () => {
  const timestamp = new Date('2024-06-15T14:30:00Z').getTime();

  describe('formatDate', () => {
    it('should format date', () => {
      const result = formatDate(timestamp, 'en-US');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatTime', () => {
    it('should format time', () => {
      const result = formatTime(timestamp, 'en-US');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatDateTime', () => {
    it('should combine date and time', () => {
      const result = formatDateTime(timestamp, 'en-US');
      expect(result).toContain(',');
    });
  });
});
