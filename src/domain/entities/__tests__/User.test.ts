import { User } from '../User';
import { UserId } from '../../value-objects/UserId';
import { UserName } from '../../value-objects/UserName';
import { UserLastName } from '../../value-objects/UserLastName';
import { UserEmail } from '../../value-objects/UserEmail';
import { UserState } from '../../value-objects/UserState';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a new user with default Active state', () => {
      const id = new UserId('user-123');
      const name = new UserName('Juan');
      const lastName = new UserLastName('Pérez');
      const email = new UserEmail('juan.perez@example.com');

      const user = User.create(id, name, lastName, email);

      expect(user.id.value).toBe('user-123');
      expect(user.name.value).toBe('Juan');
      expect(user.lastName.value).toBe('Pérez');
      expect(user.email.value).toBe('juan.perez@example.com');
      expect(user.state.value).toBe('Active');
      expect(user.createdAt.value).toBeInstanceOf(Date);
      expect(user.updatedAt.value).toBeInstanceOf(Date);
    });

    it('should create users with unique IDs', () => {
      const user1 = User.create(
        new UserId('user-1'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const user2 = User.create(
        new UserId('user-2'),
        new UserName('María'),
        new UserLastName('García'),
        new UserEmail('maria.garcia@example.com')
      );

      expect(user1.id.value).not.toBe(user2.id.value);
    });
  });

  describe('fromPrimitives', () => {
    it('should create user from primitive values', () => {
      const primitives = {
        id: 'user-123',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        state: 'Active',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const user = User.fromPrimitives(primitives);

      expect(user.id.value).toBe('user-123');
      expect(user.name.value).toBe('Juan');
      expect(user.lastName.value).toBe('Pérez');
      expect(user.email.value).toBe('juan.perez@example.com');
      expect(user.state.value).toBe('Active');
      expect(user.createdAt.value).toEqual(new Date('2023-01-01'));
      expect(user.updatedAt.value).toEqual(new Date('2023-01-02'));
    });
  });

  describe('toPrimitives', () => {
    it('should convert user to primitive values', () => {
      const user = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const primitives = user.toPrimitives();

      expect(primitives).toEqual({
        id: 'user-123',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        state: 'Active',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('update', () => {
    it('should update user name and return new instance', () => {
      const user = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const updatedUser = user.update({
        name: new UserName('Juan Carlos'),
      });

      expect(updatedUser).not.toBe(user);
      expect(updatedUser.name.value).toBe('Juan Carlos');
      expect(updatedUser.lastName.value).toBe('Pérez');
      expect(updatedUser.email.value).toBe('juan.perez@example.com');
      expect(updatedUser.state.value).toBe('Active');
      expect(updatedUser.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        user.updatedAt.value.getTime()
      );
    });

    it('should update user lastName and return new instance', () => {
      const user = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const updatedUser = user.update({
        lastName: new UserLastName('García'),
      });

      expect(updatedUser).not.toBe(user);
      expect(updatedUser.name.value).toBe('Juan');
      expect(updatedUser.lastName.value).toBe('García');
      expect(updatedUser.email.value).toBe('juan.perez@example.com');
    });

    it('should update user email and return new instance', () => {
      const user = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const updatedUser = user.update({
        email: new UserEmail('juan.garcia@example.com'),
      });

      expect(updatedUser).not.toBe(user);
      expect(updatedUser.email.value).toBe('juan.garcia@example.com');
    });

    it('should update multiple fields at once', () => {
      const user = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const updatedUser = user.update({
        name: new UserName('Juan Carlos'),
        lastName: new UserLastName('García'),
        email: new UserEmail('juan.garcia@example.com'),
      });

      expect(updatedUser.name.value).toBe('Juan Carlos');
      expect(updatedUser.lastName.value).toBe('García');
      expect(updatedUser.email.value).toBe('juan.garcia@example.com');
    });

    it('should not modify original user instance', () => {
      const user = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const originalName = user.name.value;
      const originalUpdatedAt = user.updatedAt.value;

      user.update({
        name: new UserName('Juan Carlos'),
      });

      expect(user.name.value).toBe(originalName);
      expect(user.updatedAt.value).toEqual(originalUpdatedAt);
    });
  });

  describe('changeState', () => {
    it('should change user state and return new instance', () => {
      const user = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const suspendedUser = user.changeState(new UserState('Suspended'));

      expect(suspendedUser).not.toBe(user);
      expect(suspendedUser.state.value).toBe('Suspended');
      expect(suspendedUser.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        user.updatedAt.value.getTime()
      );
    });

    it('should not modify original user instance', () => {
      const user = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const originalState = user.state.value;
      const originalUpdatedAt = user.updatedAt.value;

      user.changeState(new UserState('Suspended'));

      expect(user.state.value).toBe(originalState);
      expect(user.updatedAt.value).toEqual(originalUpdatedAt);
    });
  });

  describe('equals', () => {
    it('should return true for users with same ID', () => {
      const user1 = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const user2 = User.create(
        new UserId('user-123'),
        new UserName('María'),
        new UserLastName('García'),
        new UserEmail('maria.garcia@example.com')
      );

      expect(user1.equals(user2)).toBe(true);
    });

    it('should return false for users with different IDs', () => {
      const user1 = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const user2 = User.create(
        new UserId('user-456'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      expect(user1.equals(user2)).toBe(false);
    });
  });
});
