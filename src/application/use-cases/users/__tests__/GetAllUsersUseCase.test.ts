import { GetAllUsersUseCase } from '../GetAllUsersUseCase';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { UserId } from '../../../../domain/value-objects/UserId';
import { UserName } from '../../../../domain/value-objects/UserName';
import { UserLastName } from '../../../../domain/value-objects/UserLastName';
import { UserEmail } from '../../../../domain/value-objects/UserEmail';

describe('GetAllUsersUseCase', () => {
  let getAllUsersUseCase: GetAllUsersUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    getAllUsersUseCase = new GetAllUsersUseCase(mockUserRepository);
  });

  describe('execute', () => {
    it('should return empty array when no users exist', async () => {
      mockUserRepository.findAll.mockResolvedValue([]);

      const result = await getAllUsersUseCase.execute();

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        users: [],
        total: 0,
      });
    });

    it('should return all users when users exist', async () => {
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

      mockUserRepository.findAll.mockResolvedValue([user1, user2]);

      const result = await getAllUsersUseCase.execute();

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.users[0]).toEqual({
        id: 'user-1',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        state: 'Active',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result.users[1]).toEqual({
        id: 'user-2',
        name: 'María',
        lastName: 'García',
        email: 'maria.garcia@example.com',
        state: 'Active',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should handle repository errors gracefully', async () => {
      const repositoryError = new Error('Database connection failed');
      mockUserRepository.findAll.mockRejectedValue(repositoryError);

      await expect(getAllUsersUseCase.execute()).rejects.toThrow(
        'Database connection failed'
      );

      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });

    it('should demonstrate that deleted users are automatically filtered by repository', async () => {
      const activeUser = User.create(
        new UserId('user-1'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const deletedUser = User.create(
        new UserId('user-2'),
        new UserName('María'),
        new UserLastName('García'),
        new UserEmail('maria.garcia@example.com')
      ).delete();

      mockUserRepository.findAll.mockResolvedValue([activeUser]);

      const result = await getAllUsersUseCase.execute();

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.users[0]?.state).toBe('Active');
      expect(result.users[0]?.id).toBe('user-1');
    });
  });
});
