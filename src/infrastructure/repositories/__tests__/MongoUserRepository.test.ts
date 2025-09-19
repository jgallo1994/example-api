import { Collection, Db } from 'mongodb';
import { MongoUserRepository } from '../MongoUserRepository';
import { MongoConnection } from '../../database/MongoConnection';
import { User } from '../../../domain/entities/User';
import { UserId } from '../../../domain/value-objects/UserId';
import { UserName } from '../../../domain/value-objects/UserName';
import { UserLastName } from '../../../domain/value-objects/UserLastName';
import { UserEmail } from '../../../domain/value-objects/UserEmail';

describe('MongoUserRepository', () => {
  let mongoUserRepository: MongoUserRepository;
  let mockMongoConnection: jest.Mocked<MongoConnection>;
  let mockDb: jest.Mocked<Db>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    } as any;

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    } as any;

    mockMongoConnection = {
      getDatabase: jest.fn().mockReturnValue(mockDb),
    } as any;

    mongoUserRepository = new MongoUserRepository(mockMongoConnection);
  });

  describe('findById', () => {
    it('should find user by ID successfully', async () => {
      const userId = new UserId('user-123');
      const mockUser = User.create(
        userId,
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const mockDocument = {
        id: 'user-123',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        state: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCollection.findOne.mockResolvedValue(mockDocument);

      const result = await mongoUserRepository.findById(userId);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: 'user-123',
        state: { $ne: 'Deleted' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      const userId = new UserId('user-123');

      mockCollection.findOne.mockResolvedValue(null);

      const result = await mongoUserRepository.findById(userId);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: 'user-123',
        state: { $ne: 'Deleted' },
      });
      expect(result).toBeNull();
    });

    it('should return null when user is deleted (filtered by query)', async () => {
      const userId = new UserId('user-123');

      // El usuario existe pero está eliminado, por lo que la query no lo encuentra
      mockCollection.findOne.mockResolvedValue(null);

      const result = await mongoUserRepository.findById(userId);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: 'user-123',
        state: { $ne: 'Deleted' },
      });
      expect(result).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      const userId = new UserId('user-123');
      const dbError = new Error('Database connection failed');

      mockCollection.findOne.mockRejectedValue(dbError);

      await expect(mongoUserRepository.findById(userId)).rejects.toThrow(
        'Database connection failed'
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: 'user-123',
        state: { $ne: 'Deleted' },
      });
    });
  });

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      const userEmail = new UserEmail('juan.perez@example.com');
      const mockUser = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        userEmail
      );

      const mockDocument = {
        id: 'user-123',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        state: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCollection.findOne.mockResolvedValue(mockDocument);

      const result = await mongoUserRepository.findByEmail(userEmail);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        email: 'juan.perez@example.com',
        state: { $ne: 'Deleted' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user with email is not found', async () => {
      const userEmail = new UserEmail('nonexistent@example.com');

      mockCollection.findOne.mockResolvedValue(null);

      const result = await mongoUserRepository.findByEmail(userEmail);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
        state: { $ne: 'Deleted' },
      });
      expect(result).toBeNull();
    });

    it('should return null when user with email is deleted', async () => {
      const userEmail = new UserEmail('deleted@example.com');

      mockCollection.findOne.mockResolvedValue(null);

      const result = await mongoUserRepository.findByEmail(userEmail);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        email: 'deleted@example.com',
        state: { $ne: 'Deleted' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all active and suspended users (excluding deleted)', async () => {
      const mockDocuments = [
        {
          id: 'user-1',
          name: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          state: 'Active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'user-2',
          name: 'María',
          lastName: 'García',
          email: 'maria.garcia@example.com',
          state: 'Suspended',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockFindResult = {
        toArray: jest.fn().mockResolvedValue(mockDocuments),
      };

      mockCollection.find.mockReturnValue(mockFindResult as any);

      const result = await mongoUserRepository.findAll();

      expect(mockCollection.find).toHaveBeenCalledWith({
        state: { $ne: 'Deleted' },
      });
      expect(mockFindResult.toArray).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]?.id.value).toBe('user-1');
      expect(result[1]?.id.value).toBe('user-2');
    });

    it('should return empty array when no users exist', async () => {
      const mockFindResult = {
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockFindResult as any);

      const result = await mongoUserRepository.findAll();

      expect(mockCollection.find).toHaveBeenCalledWith({
        state: { $ne: 'Deleted' },
      });
      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      const mockFindResult = {
        toArray: jest.fn().mockRejectedValue(dbError),
      };

      mockCollection.find.mockReturnValue(mockFindResult as any);

      await expect(mongoUserRepository.findAll()).rejects.toThrow(
        'Database connection failed'
      );
      expect(mockCollection.find).toHaveBeenCalledWith({
        state: { $ne: 'Deleted' },
      });
    });
  });

  describe('save', () => {
    it('should save new user successfully', async () => {
      const mockUser = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const mockInsertResult = {
        insertedId: 'user-123',
      };

      mockCollection.insertOne.mockResolvedValue(mockInsertResult as any);

      await mongoUserRepository.save(mockUser);

      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        id: 'user-123',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        state: 'Active',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should handle save errors gracefully', async () => {
      const mockUser = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const dbError = new Error('Insert operation failed');
      mockCollection.insertOne.mockRejectedValue(dbError);

      await expect(mongoUserRepository.save(mockUser)).rejects.toThrow(
        'Insert operation failed'
      );
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const mockUser = User.create(
        new UserId('user-123'),
        new UserName('Juan Updated'),
        new UserLastName('Pérez Updated'),
        new UserEmail('juan.updated@example.com')
      );

      const mockUpdateResult = {
        modifiedCount: 1,
      };

      mockCollection.updateOne.mockResolvedValue(mockUpdateResult as any);

      await mongoUserRepository.update(mockUser);

      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { id: 'user-123' },
        {
          $set: {
            id: 'user-123',
            name: 'Juan Updated',
            lastName: 'Pérez Updated',
            email: 'juan.updated@example.com',
            state: 'Active',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        }
      );
    });

    it('should handle update errors gracefully', async () => {
      const mockUser = User.create(
        new UserId('user-123'),
        new UserName('Juan'),
        new UserLastName('Pérez'),
        new UserEmail('juan.perez@example.com')
      );

      const dbError = new Error('Update operation failed');
      mockCollection.updateOne.mockRejectedValue(dbError);

      await expect(mongoUserRepository.update(mockUser)).rejects.toThrow(
        'Update operation failed'
      );
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const userId = new UserId('user-123');

      const mockDeleteResult = {
        deletedCount: 1,
      };

      mockCollection.deleteOne.mockResolvedValue(mockDeleteResult as any);

      await mongoUserRepository.delete(userId);

      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: 'user-123' });
    });

    it('should handle delete errors gracefully', async () => {
      const userId = new UserId('user-123');

      const dbError = new Error('Delete operation failed');
      mockCollection.deleteOne.mockRejectedValue(dbError);

      await expect(mongoUserRepository.delete(userId)).rejects.toThrow(
        'Delete operation failed'
      );
    });
  });

  describe('soft delete filtering', () => {
    it('should not return deleted users in findById', async () => {
      const userId = new UserId('user-123');

      // Simular que el usuario existe pero está eliminado
      mockCollection.findOne.mockResolvedValue(null);

      const result = await mongoUserRepository.findById(userId);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: 'user-123',
        state: { $ne: 'Deleted' },
      });
      expect(result).toBeNull();
    });

    it('should not return deleted users in findByEmail', async () => {
      const userEmail = new UserEmail('deleted@example.com');

      mockCollection.findOne.mockResolvedValue(null);

      const result = await mongoUserRepository.findByEmail(userEmail);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        email: 'deleted@example.com',
        state: { $ne: 'Deleted' },
      });
      expect(result).toBeNull();
    });

    it('should not return deleted users in findAll', async () => {
      const mockFindResult = {
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockFindResult as any);

      const result = await mongoUserRepository.findAll();

      expect(mockCollection.find).toHaveBeenCalledWith({
        state: { $ne: 'Deleted' },
      });
      expect(result).toEqual([]);
    });
  });

  describe('collection initialization', () => {
    it('should initialize collection with correct name', () => {
      expect(mockDb.collection).toHaveBeenCalledWith('users');
    });

    it('should use correct database from connection', () => {
      expect(mockMongoConnection.getDatabase).toHaveBeenCalled();
    });
  });
});
