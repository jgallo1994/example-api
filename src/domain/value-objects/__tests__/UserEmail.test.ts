import { UserEmail } from '../UserEmail';
import { EmptyValueError, InvalidEmailFormatError } from '../../errors';

describe('UserEmail Value Object', () => {
  describe('constructor', () => {
    it('should create a valid UserEmail with a valid email', () => {
      const email = 'test@example.com';
      const userEmail = new UserEmail(email);

      expect(userEmail.value).toBe(email.toLowerCase());
    });

    it('should normalize email to lowercase', () => {
      const email = 'TEST@EXAMPLE.COM';
      const userEmail = new UserEmail(email);

      expect(userEmail.value).toBe('test@example.com');
    });

    it('should throw error when an empty string is passed', () => {
      expect(() => new UserEmail('')).toThrow(EmptyValueError);
    });

    it('should throw error when only whitespace is passed', () => {
      expect(() => new UserEmail('   ')).toThrow(EmptyValueError);
    });

    it('should throw error for emails with invalid format', () => {
      expect(() => new UserEmail('invalid-email')).toThrow(
        InvalidEmailFormatError
      );
      expect(() => new UserEmail('test@')).toThrow(InvalidEmailFormatError);
      expect(() => new UserEmail('@example.com')).toThrow(
        InvalidEmailFormatError
      );
      expect(() => new UserEmail('test.example.com')).toThrow(
        InvalidEmailFormatError
      );
    });

    it('should accept valid emails with different formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com',
      ];

      validEmails.forEach(email => {
        expect(() => new UserEmail(email)).not.toThrow();
      });
    });
  });

  describe('equals', () => {
    it('should return true for UserEmails with the same value', () => {
      const email = 'test@example.com';
      const userEmail1 = new UserEmail(email);
      const userEmail2 = new UserEmail(email);

      expect(userEmail1.equals(userEmail2)).toBe(true);
    });

    it('should return false for UserEmails with different values', () => {
      const userEmail1 = new UserEmail('test1@example.com');
      const userEmail2 = new UserEmail('test2@example.com');

      expect(userEmail1.equals(userEmail2)).toBe(false);
    });
  });
});
