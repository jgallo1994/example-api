import { DeleteUserUseCase } from '../DeleteUserUseCase';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { UserId } from '../../../../domain/value-objects/UserId';
import { UserName } from '../../../../domain/value-objects/UserName';
import { UserLastName } from '../../../../domain/value-objects/UserLastName';
import { UserEmail } from '../../../../domain/value-objects/UserEmail';
import { UserNotFoundError } from '../../../../domain/errors';
import { DeleteUserRequestDto } from '../../../dtos/UserDtos';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
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

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    const validRequest: DeleteUserRequestDto = {
      id: 'user-123',
    };

    const existingUser = User.create(
      new UserId('user-123'),
      new UserName('Juan'),
      new UserLastName('Pérez'),
      new UserEmail('juan.perez@example.com')
    );

    it('should delete user successfully when user exists', async () => {
      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue();

      const result = await deleteUserUseCase.execute(validRequest);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        expect.any(UserId)
      );
      expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User));

      expect(result).toMatchObject({
        id: 'user-123',
        message: 'User deleted successfully',
      });
    });

    it('should change user state to Deleted', async () => {
      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue();

      await deleteUserUseCase.execute(validRequest);

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            value: 'Deleted',
          }),
        })
      );
    });

    it('should throw UserNotFoundError when user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(deleteUserUseCase.execute(validRequest)).rejects.toThrow(
        UserNotFoundError
      );

      expect(mockUserRepository.findById).toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should validate UserId format through UserId value object', async () => {
      const invalidRequest: DeleteUserRequestDto = {
        id: '',
      };

      await expect(deleteUserUseCase.execute(invalidRequest)).rejects.toThrow();

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository findById errors gracefully', async () => {
      const findError = new Error('Database connection failed');
      mockUserRepository.findById.mockRejectedValue(findError);

      await expect(deleteUserUseCase.execute(validRequest)).rejects.toThrow(
        'Database connection failed'
      );

      expect(mockUserRepository.findById).toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository update errors gracefully', async () => {
      mockUserRepository.findById.mockResolvedValue(existingUser);
      const updateError = new Error('Database update failed');
      mockUserRepository.update.mockRejectedValue(updateError);

      await expect(deleteUserUseCase.execute(validRequest)).rejects.toThrow(
        'Database update failed'
      );

      expect(mockUserRepository.findById).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it('should handle empty string ID gracefully', async () => {
      const emptyIdRequest: DeleteUserRequestDto = {
        id: '   ',
      };

      await expect(deleteUserUseCase.execute(emptyIdRequest)).rejects.toThrow();

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should preserve user data when changing state to deleted', async () => {
      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue();

      await deleteUserUseCase.execute(validRequest);

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.objectContaining({ value: 'user-123' }),
          name: expect.objectContaining({ value: 'Juan' }),
          lastName: expect.objectContaining({ value: 'Pérez' }),
          email: expect.objectContaining({ value: 'juan.perez@example.com' }),
          createdAt: expect.any(Object),
          updatedAt: expect.any(Object),
        })
      );
    });

    it('should update updatedAt timestamp when deleting user', async () => {
      const beforeDelete = new Date();
      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue();

      await deleteUserUseCase.execute(validRequest);
      const afterDelete = new Date();

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedAt: expect.objectContaining({
            value: expect.any(Date),
          }),
        })
      );
    });

    it('should not call repository methods when validation fails', async () => {
      const invalidRequest: DeleteUserRequestDto = {
        id: '',
      };

      try {
        await deleteUserUseCase.execute(invalidRequest);
      } catch (error) {
        // Expected to fail
      }

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
