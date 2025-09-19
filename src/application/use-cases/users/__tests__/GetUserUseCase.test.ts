import { GetUserUseCase } from '../GetUserUseCase';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { UserId } from '../../../../domain/value-objects/UserId';
import { UserName } from '../../../../domain/value-objects/UserName';
import { UserLastName } from '../../../../domain/value-objects/UserLastName';
import { UserEmail } from '../../../../domain/value-objects/UserEmail';
import { UserNotFoundError } from '../../../../domain/errors';
import { GetUserRequestDto } from '../../../dtos/UserDtos';

describe('GetUserUseCase', () => {
  let getUserUseCase: GetUserUseCase;
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

    getUserUseCase = new GetUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    const validRequest: GetUserRequestDto = {
      id: 'user-123',
    };

    const mockUser = User.create(
      new UserId('user-123'),
      new UserName('Juan'),
      new UserLastName('Pérez'),
      new UserEmail('juan.perez@example.com')
    );

    it('should return user when user exists', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await getUserUseCase.execute(validRequest);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        expect.any(UserId)
      );
      expect(result).toMatchObject({
        id: 'user-123',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        state: 'Active',
      });
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw UserNotFoundError when user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(getUserUseCase.execute(validRequest)).rejects.toThrow(
        UserNotFoundError
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        expect.any(UserId)
      );
    });

    it('should validate UserId format through UserId value object', async () => {
      const invalidRequest: GetUserRequestDto = {
        id: '',
      };

      await expect(getUserUseCase.execute(invalidRequest)).rejects.toThrow();

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      const repositoryError = new Error('Database connection failed');
      mockUserRepository.findById.mockRejectedValue(repositoryError);

      await expect(getUserUseCase.execute(validRequest)).rejects.toThrow(
        'Database connection failed'
      );

      expect(mockUserRepository.findById).toHaveBeenCalled();
    });

    it('should return user with correct state when user is suspended', async () => {
      const suspendedUser = mockUser.suspend();
      mockUserRepository.findById.mockResolvedValue(suspendedUser);

      const result = await getUserUseCase.execute(validRequest);

      expect(result.state).toBe('Suspended');
      expect(result.id).toBe('user-123');
    });

    it('should throw UserNotFoundError when user is deleted (filtered by repository)', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(getUserUseCase.execute(validRequest)).rejects.toThrow(
        UserNotFoundError
      );

      expect(mockUserRepository.findById).toHaveBeenCalled();
    });

    it('should handle empty string ID gracefully', async () => {
      const emptyIdRequest: GetUserRequestDto = {
        id: '   ',
      };

      await expect(getUserUseCase.execute(emptyIdRequest)).rejects.toThrow();

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });
  });
});
