import { UserState, UserStateValue } from '../UserState';

describe('UserState Value Object', () => {
  describe('constructor', () => {
    it('should create a valid UserState with Active value', () => {
      const state: UserStateValue = 'Active';
      const userState = new UserState(state);

      expect(userState.value).toBe(state);
    });

    it('should create a valid UserState with Suspended value', () => {
      const state: UserStateValue = 'Suspended';
      const userState = new UserState(state);

      expect(userState.value).toBe(state);
    });

    it('should create a valid UserState with Deleted value', () => {
      const state: UserStateValue = 'Deleted';
      const userState = new UserState(state);

      expect(userState.value).toBe(state);
    });

    it('should throw Error for invalid state value', () => {
      expect(() => new UserState('Invalid' as any)).toThrow(
        'Invalid user state: Invalid'
      );
    });

    it('should throw Error for empty string', () => {
      expect(() => new UserState('' as any)).toThrow('Invalid user state: ');
    });

    it('should throw Error for null value', () => {
      expect(() => new UserState(null as any)).toThrow(
        'Invalid user state: null'
      );
    });

    it('should throw Error for undefined value', () => {
      expect(() => new UserState(undefined as any)).toThrow(
        'Invalid user state: undefined'
      );
    });
  });

  describe('isValidState', () => {
    it('should return true for valid states', () => {
      expect(UserState.isValidState('Active')).toBe(true);
      expect(UserState.isValidState('Suspended')).toBe(true);
      expect(UserState.isValidState('Deleted')).toBe(true);
    });

    it('should return false for invalid states', () => {
      expect(UserState.isValidState('Invalid')).toBe(false);
      expect(UserState.isValidState('')).toBe(false);
      expect(UserState.isValidState('active')).toBe(false);
      expect(UserState.isValidState('SUSPENDED')).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for UserStates with the same value', () => {
      const userState1 = new UserState('Active');
      const userState2 = new UserState('Active');

      expect(userState1.equals(userState2)).toBe(true);
    });

    it('should return false for UserStates with different values', () => {
      const userState1 = new UserState('Active');
      const userState2 = new UserState('Suspended');

      expect(userState1.equals(userState2)).toBe(false);
    });

    it('should return false when comparing with null', () => {
      const userState = new UserState('Active');

      expect(userState.equals(null as any)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const userState = new UserState('Active');

      expect(userState.equals(undefined as any)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the state value as string', () => {
      const state = 'Active';
      const userState = new UserState(state);

      expect(userState.toString()).toBe(state);
    });
  });

  describe('static methods', () => {
    it('should provide Active state', () => {
      const activeState = UserState.active();
      expect(activeState.value).toBe('Active');
    });

    it('should provide Suspended state', () => {
      const suspendedState = UserState.suspended();
      expect(suspendedState.value).toBe('Suspended');
    });

    it('should provide Deleted state', () => {
      const deletedState = UserState.deleted();
      expect(deletedState.value).toBe('Deleted');
    });
  });

  describe('instance methods', () => {
    it('should check if state is Active', () => {
      const activeState = new UserState('Active');
      expect(activeState.isActive()).toBe(true);
      expect(activeState.isSuspended()).toBe(false);
      expect(activeState.isDeleted()).toBe(false);
    });

    it('should check if state is Suspended', () => {
      const suspendedState = new UserState('Suspended');
      expect(suspendedState.isActive()).toBe(false);
      expect(suspendedState.isSuspended()).toBe(true);
      expect(suspendedState.isDeleted()).toBe(false);
    });

    it('should check if state is Deleted', () => {
      const deletedState = new UserState('Deleted');
      expect(deletedState.isActive()).toBe(false);
      expect(deletedState.isSuspended()).toBe(false);
      expect(deletedState.isDeleted()).toBe(true);
    });
  });
});
