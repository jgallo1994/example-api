import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/users/CreateUserUseCase';
import { GetUserUseCase } from '../../application/use-cases/users/GetUserUseCase';
import { GetAllUsersUseCase } from '../../application/use-cases/users/GetAllUsersUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/users/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../application/use-cases/users/DeleteUserUseCase';
import { LogController } from '../../infrastructure/decorators';
import { TYPES } from '../../infrastructure/di/types';
import { HttpResponse } from '../responses/HttpResponse';

@injectable()
@LogController()
export class UserController {
  constructor(
    @inject(TYPES.CreateUserUseCase)
    private createUserUseCase: CreateUserUseCase,
    @inject(TYPES.GetUserUseCase) private getUserUseCase: GetUserUseCase,
    @inject(TYPES.GetAllUsersUseCase)
    private getAllUsersUseCase: GetAllUsersUseCase,
    @inject(TYPES.UpdateUserUseCase)
    private updateUserUseCase: UpdateUserUseCase,
    @inject(TYPES.DeleteUserUseCase)
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.createUserUseCase.execute(req.body);
      const response = HttpResponse.created(
        result,
        'User created successfully',
        req.path
      );
      res.status(201).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const response = HttpResponse.error(
        'Failed to create user',
        errorMessage,
        req.path
      );
      res.status(400).json(response);
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response = HttpResponse.validationError(
          'User ID is required',
          undefined,
          req.path
        );
        res.status(400).json(response);
        return;
      }

      const result = await this.getUserUseCase.execute({ id });
      const response = HttpResponse.success(
        result,
        'User retrieved successfully',
        req.path
      );
      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const response = HttpResponse.error(
        'Failed to retrieve user',
        errorMessage,
        req.path
      );
      res.status(404).json(response);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getAllUsersUseCase.execute();
      const response = HttpResponse.success(
        result,
        'Users retrieved successfully',
        req.path
      );
      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const response = HttpResponse.error(
        'Failed to retrieve users',
        errorMessage,
        req.path
      );
      res.status(500).json(response);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response = HttpResponse.validationError(
          'User ID is required',
          undefined,
          req.path
        );
        res.status(400).json(response);
        return;
      }

      const result = await this.updateUserUseCase.execute({
        id,
        ...req.body,
      });
      const response = HttpResponse.success(
        result,
        'User updated successfully',
        req.path
      );
      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const response = HttpResponse.error(
        'Failed to update user',
        errorMessage,
        req.path
      );
      res.status(400).json(response);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        const response = HttpResponse.validationError(
          'User ID is required',
          undefined,
          req.path
        );
        res.status(400).json(response);
        return;
      }

      const result = await this.deleteUserUseCase.execute({ id });
      const response = HttpResponse.success(
        result,
        'User deleted successfully',
        req.path
      );
      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const response = HttpResponse.error(
        'Failed to delete user',
        errorMessage,
        req.path
      );
      res.status(404).json(response);
    }
  }
}
