import { Request, Response } from 'express';
import { UserController } from '../UserController';
import { CreateUserUseCase } from '../../../application/use-cases/users/CreateUserUseCase';
import { GetUserUseCase } from '../../../application/use-cases/users/GetUserUseCase';
import { GetAllUsersUseCase } from '../../../application/use-cases/users/GetAllUsersUseCase';
import { UpdateUserUseCase } from '../../../application/use-cases/users/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../../application/use-cases/users/DeleteUserUseCase';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from '../../../application/dtos/UserDtos';
import {
  GetUserRequestDto,
  GetUserResponseDto,
} from '../../../application/dtos/UserDtos';
import { GetAllUsersResponseDto } from '../../../application/dtos/UserDtos';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from '../../../application/dtos/UserDtos';
import {
  DeleteUserRequestDto,
  DeleteUserResponseDto,
} from '../../../application/dtos/UserDtos';
import { UserNotFoundError } from '../../../domain/errors';
import { HttpResponse } from '../../responses/HttpResponse';

describe('UserController', () => {
  let userController: UserController;
  let mockCreateUserUseCase: jest.Mocked<CreateUserUseCase>;
  let mockGetUserUseCase: jest.Mocked<GetUserUseCase>;
  let mockGetAllUsersUseCase: jest.Mocked<GetAllUsersUseCase>;
  let mockUpdateUserUseCase: jest.Mocked<UpdateUserUseCase>;
  let mockDeleteUserUseCase: jest.Mocked<DeleteUserUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockCreateUserUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetUserUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetAllUsersUseCase = {
      execute: jest.fn(),
    } as any;

    mockUpdateUserUseCase = {
      execute: jest.fn(),
    } as any;

    mockDeleteUserUseCase = {
      execute: jest.fn(),
    } as any;

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();

    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };

    userController = new UserController(
      mockCreateUserUseCase,
      mockGetUserUseCase,
      mockGetAllUsersUseCase,
      mockUpdateUserUseCase,
      mockDeleteUserUseCase
    );
  });

  describe('createUser', () => {
    const validRequest: CreateUserRequestDto = {
      name: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
    };
    const mockUserResponse: CreateUserResponseDto = {
      id: 'user-123',
      name: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      state: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create user successfully and return 201', async () => {
      mockRequest = { body: validRequest, path: '/' };
      mockCreateUserUseCase.execute.mockResolvedValue(mockUserResponse);

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(validRequest);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'User created successfully',
        data: mockUserResponse,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should handle validation errors and return 400', async () => {
      const validationError = new Error('Name cannot be empty');
      mockRequest = { body: { ...validRequest, name: '' }, path: '/' };
      mockCreateUserUseCase.execute.mockRejectedValue(validationError);

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith({
        ...validRequest,
        name: '',
      });
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to create user',
        error: validationError.message,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should handle unexpected errors and return 400', async () => {
      const unexpectedError = new Error('Database connection failed');
      mockRequest = { body: validRequest, path: '/' };
      mockCreateUserUseCase.execute.mockRejectedValue(unexpectedError);

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(validRequest);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to create user',
        error: unexpectedError.message,
        timestamp: expect.any(String),
        path: '/',
      });
    });
  });

  describe('getUser', () => {
    const validRequest: GetUserRequestDto = { id: 'user-123' };
    const mockUserResponse: GetUserResponseDto = {
      id: 'user-123',
      name: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      state: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should get user successfully and return 200', async () => {
      mockRequest = { params: { id: validRequest.id }, path: '/' };
      mockGetUserUseCase.execute.mockResolvedValue(mockUserResponse);

      await userController.getUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetUserUseCase.execute).toHaveBeenCalledWith(validRequest);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'User retrieved successfully',
        data: mockUserResponse,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should handle user not found and return 404', async () => {
      const notFoundError = new Error("User with ID 'user-123' not found");
      mockRequest = { params: { id: validRequest.id }, path: '/' };
      mockGetUserUseCase.execute.mockRejectedValue(notFoundError);

      await userController.getUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetUserUseCase.execute).toHaveBeenCalledWith(validRequest);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to retrieve user',
        error: notFoundError.message,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should handle validation errors and return 400', async () => {
      mockRequest = { params: {}, path: '/' };

      await userController.getUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetUserUseCase.execute).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'User ID is required',
        timestamp: expect.any(String),
        path: '/',
      });
    });
  });

  describe('getAllUsers', () => {
    const mockUsersResponse: GetAllUsersResponseDto = {
      users: [
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
      ],
      total: 2,
    };

    it('should get all users successfully and return 200', async () => {
      mockRequest = { path: '/' };
      mockGetAllUsersUseCase.execute.mockResolvedValue(mockUsersResponse);

      await userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetAllUsersUseCase.execute).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Users retrieved successfully',
        data: mockUsersResponse,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should handle repository errors and return 500', async () => {
      const repositoryError = new Error('Database connection failed');
      mockRequest = { path: '/' };
      mockGetAllUsersUseCase.execute.mockRejectedValue(repositoryError);

      await userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetAllUsersUseCase.execute).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to retrieve users',
        error: repositoryError.message,
        timestamp: expect.any(String),
        path: '/',
      });
    });
  });

  describe('updateUser', () => {
    const validRequest: UpdateUserRequestDto = {
      name: 'Juan Updated',
      lastName: 'Pérez Updated',
      email: 'juan.updated@example.com',
    };
    const mockUserResponse: UpdateUserResponseDto = {
      id: 'user-123',
      name: 'Juan Updated',
      lastName: 'Pérez Updated',
      email: 'juan.updated@example.com',
      state: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update user successfully and return 200', async () => {
      mockRequest = {
        params: { id: 'user-123' },
        body: {
          name: validRequest.name,
          lastName: validRequest.lastName,
          email: validRequest.email,
        },
        path: '/',
      };
      mockUpdateUserUseCase.execute.mockResolvedValue(mockUserResponse);

      await userController.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
        id: 'user-123',
        name: validRequest.name,
        lastName: validRequest.lastName,
        email: validRequest.email,
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'User updated successfully',
        data: mockUserResponse,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should handle user not found and return 400', async () => {
      const notFoundError = new Error("User with ID 'user-123' not found");
      mockRequest = {
        params: { id: 'user-123' },
        body: { name: validRequest.name },
        path: '/',
      };
      mockUpdateUserUseCase.execute.mockRejectedValue(notFoundError);

      await userController.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
        id: 'user-123',
        name: validRequest.name,
      });
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to update user',
        error: notFoundError.message,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should handle validation errors and return 400', async () => {
      const validationError = new Error('Invalid email format');
      mockRequest = {
        params: { id: 'user-123' },
        body: { email: 'invalid-email' },
        path: '/',
      };
      mockUpdateUserUseCase.execute.mockRejectedValue(validationError);

      await userController.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'invalid-email',
      });
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to update user',
        error: validationError.message,
        timestamp: expect.any(String),
        path: '/',
      });
    });
  });

  describe('deleteUser', () => {
    const validRequest: DeleteUserRequestDto = { id: 'user-123' };
    const mockUserResponse: DeleteUserResponseDto = {
      id: 'user-123',
      message: 'User deleted successfully',
    };

    it('should delete user successfully and return 200', async () => {
      mockRequest = { params: { id: validRequest.id }, path: '/' };
      mockDeleteUserUseCase.execute.mockResolvedValue(mockUserResponse);

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith(validRequest);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'User deleted successfully',
        data: mockUserResponse,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should handle user not found and return 404', async () => {
      const notFoundError = new Error("User with ID 'user-123' not found");
      mockRequest = { params: { id: validRequest.id }, path: '/' };
      mockDeleteUserUseCase.execute.mockRejectedValue(notFoundError);

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith(validRequest);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to delete user',
        error: notFoundError.message,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should handle validation errors and return 400', async () => {
      mockRequest = { params: {}, path: '/' };

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDeleteUserUseCase.execute).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'User ID is required',
        timestamp: expect.any(String),
        path: '/',
      });
    });
  });
});
