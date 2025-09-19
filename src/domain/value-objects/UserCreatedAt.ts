import { ValueObject } from './ValueObject';

export class UserCreatedAt extends ValueObject<Date> {
  constructor(value?: Date) {
    const date = value || new Date();
    super(date);
  }

  static now(): UserCreatedAt {
    return new UserCreatedAt();
  }
}
