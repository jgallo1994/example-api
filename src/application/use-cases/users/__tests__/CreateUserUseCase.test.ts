import { CreateUserUseCase } from '../CreateUserUseCase';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { UserId } from '../../../../domain/value-objects/UserId';
import { UserName } from '../../../../domain/value-objects/UserName';
import { UserLastName } from '../../../../domain/value-objects/UserLastName';
import { UserEmail } from '../../../../domain/value-objects/UserEmail';
import { UserEmailAlreadyExistsError } from '../../../../domain/errors';
import { CreateUserRequestDto } from '../../../dtos/UserDtos';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
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

    createUserUseCase = new CreateUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    const validRequest: CreateUserRequestDto = {
      name: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
    };

    it('should create a user successfully when email does not exist', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue();

      const result = await createUserUseCase.execute(validRequest);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(UserEmail)
      );
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));

      expect(result).toMatchObject({
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        state: 'Active',
      });

      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw UserEmailAlreadyExistsError when email already exists', async () => {
      const existingUser = User.create(
        new UserId('existing-user-id'),
        new UserName('Existing'),
        new UserLastName('User'),
        new UserEmail('juan.perez@example.com')
      );

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(createUserUseCase.execute(validRequest)).rejects.toThrow(
        UserEmailAlreadyExistsError
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(UserEmail)
      );
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should generate unique ID for each user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue();

      const result1 = await createUserUseCase.execute(validRequest);
      const result2 = await createUserUseCase.execute({
        ...validRequest,
        email: 'maria.garcia@example.com',
      });

      expect(result1.id).not.toBe(result2.id);
      expect(result1.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
      expect(result2.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });

    it('should set user state to Active by default', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue();

      const result = await createUserUseCase.execute(validRequest);

      expect(result.state).toBe('Active');
    });

    it('should set createdAt and updatedAt timestamps', async () => {
      const beforeExecution = new Date();
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue();

      const result = await createUserUseCase.execute(validRequest);
      const afterExecution = new Date();

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeExecution.getTime()
      );
      expect(result.createdAt.getTime()).toBeLessThanOrEqual(
        afterExecution.getTime()
      );
      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeExecution.getTime()
      );
      expect(result.updatedAt.getTime()).toBeLessThanOrEqual(
        afterExecution.getTime()
      );
    });

    it('should handle repository save errors', async () => {
      const saveError = new Error('Database connection failed');
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockRejectedValue(saveError);

      await expect(createUserUseCase.execute(validRequest)).rejects.toThrow(
        'Database connection failed'
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should validate email format through UserEmail value object', async () => {
      const invalidEmailRequest: CreateUserRequestDto = {
        ...validRequest,
        email: 'invalid-email',
      };

      await expect(
        createUserUseCase.execute(invalidEmailRequest)
      ).rejects.toThrow();

      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should validate name length through UserName value object', async () => {
      const shortNameRequest: CreateUserRequestDto = {
        ...validRequest,
        name: 'A',
      };

      await expect(
        createUserUseCase.execute(shortNameRequest)
      ).rejects.toThrow();

      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should validate lastName length through UserLastName value object', async () => {
      const shortLastNameRequest: CreateUserRequestDto = {
        ...validRequest,
        lastName: 'B',
      };

      await expect(
        createUserUseCase.execute(shortLastNameRequest)
      ).rejects.toThrow();

      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
