import { ValueObject } from './ValueObject';

export class UserUpdatedAt extends ValueObject<Date> {
  constructor(value?: Date) {
    const date = value || new Date();
    super(date);
  }

  static now(): UserUpdatedAt {
    return new UserUpdatedAt();
  }

  update(): UserUpdatedAt {
    return new UserUpdatedAt();
  }
}
