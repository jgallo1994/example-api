import { UserName } from '../UserName';
import { EmptyValueError, InvalidNameLengthError } from '../../errors';

describe('UserName Value Object', () => {
  describe('constructor', () => {
    it('should create a valid UserName with valid name', () => {
      const name = 'Juan';
      const userName = new UserName(name);

      expect(userName.value).toBe(name);
    });

    it('should trim whitespace from name', () => {
      const name = '  Juan  ';
      const userName = new UserName(name);

      expect(userName.value).toBe('Juan');
    });

    it('should throw EmptyValueError when empty string is passed', () => {
      expect(() => new UserName('')).toThrow(EmptyValueError);
    });

    it('should throw EmptyValueError when only whitespace is passed', () => {
      expect(() => new UserName('   ')).toThrow(EmptyValueError);
    });

    it('should throw EmptyValueError when null is passed', () => {
      expect(() => new UserName(null as any)).toThrow(EmptyValueError);
    });

    it('should throw EmptyValueError when undefined is passed', () => {
      expect(() => new UserName(undefined as any)).toThrow(EmptyValueError);
    });

    it('should throw InvalidNameLengthError when name is too short', () => {
      expect(() => new UserName('A')).toThrow(InvalidNameLengthError);
    });

    it('should throw InvalidNameLengthError when name is too long', () => {
      const longName = 'A'.repeat(51);
      expect(() => new UserName(longName)).toThrow(InvalidNameLengthError);
    });

    it('should accept names with minimum length', () => {
      expect(() => new UserName('AB')).not.toThrow();
    });

    it('should accept names with maximum length', () => {
      const maxLengthName = 'A'.repeat(50);
      expect(() => new UserName(maxLengthName)).not.toThrow();
    });

    it('should accept names with special characters', () => {
      expect(() => new UserName('Jean-Pierre')).not.toThrow();
      expect(() => new UserName('María José')).not.toThrow();
      expect(() => new UserName("O'Connor")).not.toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for UserNames with the same value', () => {
      const userName1 = new UserName('Juan');
      const userName2 = new UserName('Juan');

      expect(userName1.equals(userName2)).toBe(true);
    });

    it('should return false for UserNames with different values', () => {
      const userName1 = new UserName('Juan');
      const userName2 = new UserName('María');

      expect(userName1.equals(userName2)).toBe(false);
    });

    it('should return false when comparing with null', () => {
      const userName = new UserName('Juan');

      expect(userName.equals(null as any)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const userName = new UserName('Juan');

      expect(userName.equals(undefined as any)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the name value as string', () => {
      const name = 'Juan';
      const userName = new UserName(name);

      expect(userName.toString()).toBe(name);
    });
  });
});
