import { UserId } from '../UserId';
import { EmptyValueError } from '../../errors';

describe('UserId Value Object', () => {
  describe('constructor', () => {
    it('should create a valid UserId with valid id', () => {
      const id = 'user-123';
      const userId = new UserId(id);

      expect(userId.value).toBe(id);
    });

    it('should throw EmptyValueError when empty string is passed', () => {
      expect(() => new UserId('')).toThrow(EmptyValueError);
    });

    it('should throw EmptyValueError when only whitespace is passed', () => {
      expect(() => new UserId('   ')).toThrow(EmptyValueError);
    });

    it('should throw EmptyValueError when null is passed', () => {
      expect(() => new UserId(null as unknown as string)).toThrow(
        EmptyValueError
      );
    });

    it('should throw EmptyValueError when undefined is passed', () => {
      expect(() => new UserId(undefined as unknown as string)).toThrow(
        EmptyValueError
      );
    });

    it('should accept various valid ID formats', () => {
      expect(() => new UserId('user-123')).not.toThrow();
      expect(() => new UserId('123456789')).not.toThrow();
      expect(() => new UserId('abc-def-ghi')).not.toThrow();
      expect(() => new UserId('user_123')).not.toThrow();
    });
  });

  describe('generate', () => {
    it('should generate a unique UserId', () => {
      const userId1 = UserId.generate();
      const userId2 = UserId.generate();

      expect(userId1.value).toBeDefined();
      expect(userId1.value.length).toBeGreaterThan(0);
      expect(userId1.value).not.toBe(userId2.value);
    });

    it('should generate UserIds with consistent format', () => {
      const userId1 = UserId.generate();
      const userId2 = UserId.generate();

      expect(typeof userId1.value).toBe('string');
      expect(typeof userId2.value).toBe('string');
    });
  });

  describe('equals', () => {
    it('should return true for UserIds with the same value', () => {
      const userId1 = new UserId('user-123');
      const userId2 = new UserId('user-123');

      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should return false for UserIds with different values', () => {
      const userId1 = new UserId('user-123');
      const userId2 = new UserId('user-456');

      expect(userId1.equals(userId2)).toBe(false);
    });

    it('should return false when comparing with null', () => {
      const userId = new UserId('user-123');

      expect(userId.equals(null as unknown as UserId)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const userId = new UserId('user-123');

      expect(userId.equals(undefined as unknown as UserId)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the id value as string', () => {
      const id = 'user-123';
      const userId = new UserId(id);

      expect(userId.toString()).toBe(id);
    });
  });
});
