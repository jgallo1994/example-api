import { ValueObject } from './ValueObject';
import { EmptyValueError, InvalidNameLengthError } from '../errors';

export class UserName extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new EmptyValueError('Name');
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length < 2) {
      throw new InvalidNameLengthError('Name', 2, 50, trimmedValue.length);
    }

    if (trimmedValue.length > 50) {
      throw new InvalidNameLengthError('Name', 2, 50, trimmedValue.length);
    }

    super(trimmedValue);
  }
}
