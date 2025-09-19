import { UserLastName } from '../UserLastName';
import { EmptyValueError, InvalidNameLengthError } from '../../errors';

describe('UserLastName Value Object', () => {
  describe('constructor', () => {
    it('should create a valid UserLastName with valid last name', () => {
      const lastName = 'Pérez';
      const userLastName = new UserLastName(lastName);

      expect(userLastName.value).toBe(lastName);
    });

    it('should trim whitespace from last name', () => {
      const lastName = '  Pérez  ';
      const userLastName = new UserLastName(lastName);

      expect(userLastName.value).toBe('Pérez');
    });

    it('should throw EmptyValueError when empty string is passed', () => {
      expect(() => new UserLastName('')).toThrow(EmptyValueError);
    });

    it('should throw EmptyValueError when only whitespace is passed', () => {
      expect(() => new UserLastName('   ')).toThrow(EmptyValueError);
    });

    it('should throw EmptyValueError when null is passed', () => {
      expect(() => new UserLastName(null as any)).toThrow(EmptyValueError);
    });

    it('should throw EmptyValueError when undefined is passed', () => {
      expect(() => new UserLastName(undefined as any)).toThrow(EmptyValueError);
    });

    it('should throw InvalidNameLengthError when last name is too short', () => {
      expect(() => new UserLastName('A')).toThrow(InvalidNameLengthError);
    });

    it('should throw InvalidNameLengthError when last name is too long', () => {
      const longLastName = 'A'.repeat(51);
      expect(() => new UserLastName(longLastName)).toThrow(
        InvalidNameLengthError
      );
    });

    it('should accept last names with minimum length', () => {
      expect(() => new UserLastName('AB')).not.toThrow();
    });

    it('should accept last names with maximum length', () => {
      const maxLengthLastName = 'A'.repeat(50);
      expect(() => new UserLastName(maxLengthLastName)).not.toThrow();
    });

    it('should accept last names with special characters', () => {
      expect(() => new UserLastName("O'Connor")).not.toThrow();
      expect(() => new UserLastName('van der Berg')).not.toThrow();
      expect(() => new UserLastName('García-López')).not.toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for UserLastNames with the same value', () => {
      const userLastName1 = new UserLastName('Pérez');
      const userLastName2 = new UserLastName('Pérez');

      expect(userLastName1.equals(userLastName2)).toBe(true);
    });

    it('should return false for UserLastNames with different values', () => {
      const userLastName1 = new UserLastName('Pérez');
      const userLastName2 = new UserLastName('García');

      expect(userLastName1.equals(userLastName2)).toBe(false);
    });

    it('should return false when comparing with null', () => {
      const userLastName = new UserLastName('Pérez');

      expect(userLastName.equals(null as any)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const userLastName = new UserLastName('Pérez');

      expect(userLastName.equals(undefined as any)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the last name value as string', () => {
      const lastName = 'Pérez';
      const userLastName = new UserLastName(lastName);

      expect(userLastName.toString()).toBe(lastName);
    });
  });
});
