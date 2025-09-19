import { ValueObject } from './ValueObject';
import { EmptyValueError } from '../errors';

export class UserId extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new EmptyValueError('User ID');
    }
    super(value);
  }

  static generate(): UserId {
    return new UserId(crypto.randomUUID());
  }
}
