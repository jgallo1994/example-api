import { ValueObject } from './ValueObject';
import { EmptyValueError, InvalidEmailFormatError } from '../errors';

export class UserEmail extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new EmptyValueError('Email');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      throw new InvalidEmailFormatError(value.trim());
    }

    super(value.trim().toLowerCase());
  }
}
