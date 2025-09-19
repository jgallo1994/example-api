import { UpdateUserUseCase } from '../UpdateUserUseCase';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { UserId } from '../../../../domain/value-objects/UserId';
import { UserName } from '../../../../domain/value-objects/UserName';
import { UserLastName } from '../../../../domain/value-objects/UserLastName';
import { UserEmail } from '../../../../domain/value-objects/UserEmail';
import { UserNotFoundError } from '../../../../domain/errors';
import { UpdateUserRequestDto } from '../../../dtos/UserDtos';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
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

    updateUserUseCase = new UpdateUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    const existingUser = User.create(
      new UserId('user-123'),
      new UserName('Juan'),
      new UserLastName('Pérez'),
      new UserEmail('juan.perez@example.com')
    );

    it('should update user name successfully', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
        name: 'Carlos',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue();

      const result = await updateUserUseCase.execute(updateRequest);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        expect.any(UserId)
      );
      expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User));

      expect(result.name).toBe('Carlos');
      expect(result.lastName).toBe('Pérez');
      expect(result.email).toBe('juan.perez@example.com');
      expect(result.id).toBe('user-123');
    });

    it('should update user lastName successfully', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
        lastName: 'García',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue();

      const result = await updateUserUseCase.execute(updateRequest);

      expect(result.name).toBe('Juan');
      expect(result.lastName).toBe('García');
      expect(result.email).toBe('juan.perez@example.com');
    });

    it('should update user email successfully', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
        email: 'carlos.garcia@example.com',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue();

      const result = await updateUserUseCase.execute(updateRequest);

      expect(result.name).toBe('Juan');
      expect(result.lastName).toBe('Pérez');
      expect(result.email).toBe('carlos.garcia@example.com');
    });

    it('should update multiple fields simultaneously', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
        name: 'Carlos',
        lastName: 'García',
        email: 'carlos.garcia@example.com',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue();

      const result = await updateUserUseCase.execute(updateRequest);

      expect(result.name).toBe('Carlos');
      expect(result.lastName).toBe('García');
      expect(result.email).toBe('carlos.garcia@example.com');
    });

    it('should not update fields that are not provided', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue();

      const result = await updateUserUseCase.execute(updateRequest);

      expect(result.name).toBe('Juan');
      expect(result.lastName).toBe('Pérez');
      expect(result.email).toBe('juan.perez@example.com');
    });

    it('should throw UserNotFoundError when user does not exist', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'non-existing-user',
        name: 'Carlos',
      };

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(updateUserUseCase.execute(updateRequest)).rejects.toThrow(
        UserNotFoundError
      );

      expect(mockUserRepository.findById).toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should validate name length when updating name', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
        name: 'A',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);

      await expect(updateUserUseCase.execute(updateRequest)).rejects.toThrow();

      expect(mockUserRepository.findById).toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should validate lastName length when updating lastName', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
        lastName: 'B',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);

      await expect(updateUserUseCase.execute(updateRequest)).rejects.toThrow();

      expect(mockUserRepository.findById).toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should validate email format when updating email', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
        email: 'invalid-email',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);

      await expect(updateUserUseCase.execute(updateRequest)).rejects.toThrow();

      expect(mockUserRepository.findById).toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository update errors gracefully', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
        name: 'Carlos',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      const updateError = new Error('Database update failed');
      mockUserRepository.update.mockRejectedValue(updateError);

      await expect(updateUserUseCase.execute(updateRequest)).rejects.toThrow(
        'Database update failed'
      );

      expect(mockUserRepository.findById).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it('should update updatedAt timestamp when any field is updated', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
        name: 'Carlos',
      };

      const beforeUpdate = new Date();
      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue();

      const result = await updateUserUseCase.execute(updateRequest);
      const afterUpdate = new Date();

      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime()
      );
      expect(result.updatedAt.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime()
      );
    });

    it('should preserve existing timestamps for non-updated fields', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
        name: 'Carlos',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue();

      const result = await updateUserUseCase.execute(updateRequest);

      expect(result.createdAt).toEqual(existingUser.createdAt.value);
      expect(result.createdAt).not.toEqual(result.updatedAt);
    });

    it('should handle empty string values gracefully', async () => {
      const updateRequest: UpdateUserRequestDto & { id: string } = {
        id: 'user-123',
        name: '   ',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);

      await expect(updateUserUseCase.execute(updateRequest)).rejects.toThrow();

      expect(mockUserRepository.findById).toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
