import { ValueObject } from './ValueObject';

export type UserStateValue = 'Active' | 'Suspended' | 'Deleted';

export class UserState extends ValueObject<UserStateValue> {
  constructor(value: UserStateValue) {
    super(value);
    if (!this.isValidState(value)) {
      throw new Error(`Invalid user state: ${value}`);
    }
  }

  static isValidState(state: string): state is UserStateValue {
    return ['Active', 'Suspended', 'Deleted'].includes(state);
  }

  private isValidState(state: string): state is UserStateValue {
    return UserState.isValidState(state);
  }

  static active(): UserState {
    return new UserState('Active');
  }

  static suspended(): UserState {
    return new UserState('Suspended');
  }

  static deleted(): UserState {
    return new UserState('Deleted');
  }

  isActive(): boolean {
    return this.value === 'Active';
  }

  isSuspended(): boolean {
    return this.value === 'Suspended';
  }

  isDeleted(): boolean {
    return this.value === 'Deleted';
  }
}
