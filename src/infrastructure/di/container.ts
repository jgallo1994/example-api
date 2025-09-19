import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { MongoUserRepository } from '../repositories/MongoUserRepository';
import { CreateUserUseCase } from '../../application/use-cases/users/CreateUserUseCase';
import { GetUserUseCase } from '../../application/use-cases/users/GetUserUseCase';
import { GetAllUsersUseCase } from '../../application/use-cases/users/GetAllUsersUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/users/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../application/use-cases/users/DeleteUserUseCase';
import { UserController } from '../../presentation/controllers/UserController';
import { HealthController } from '../../presentation/controllers/HealthController';
import { AdvancedHealthController } from '../../presentation/controllers/AdvancedHealthController';
import { HealthCheckService } from '../health/HealthCheckService';
import { AdvancedHealthCheckService } from '../health/AdvancedHealthCheckService';
import { MongoConnection } from '../database/MongoConnection';

export const container = new Container();

// Database
container
  .bind<MongoConnection>(TYPES.MongoConnection)
  .to(MongoConnection)
  .inSingletonScope();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(MongoUserRepository);

// Use Cases
container
  .bind<CreateUserUseCase>(TYPES.CreateUserUseCase)
  .to(CreateUserUseCase);
container.bind<GetUserUseCase>(TYPES.GetUserUseCase).to(GetUserUseCase);
container
  .bind<GetAllUsersUseCase>(TYPES.GetAllUsersUseCase)
  .to(GetAllUsersUseCase);
container
  .bind<UpdateUserUseCase>(TYPES.UpdateUserUseCase)
  .to(UpdateUserUseCase);
container
  .bind<DeleteUserUseCase>(TYPES.DeleteUserUseCase)
  .to(DeleteUserUseCase);

// Services
container
  .bind<HealthCheckService>(TYPES.HealthCheckService)
  .to(HealthCheckService);
container
  .bind<AdvancedHealthCheckService>(TYPES.AdvancedHealthCheckService)
  .to(AdvancedHealthCheckService);

// Controllers
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<HealthController>(TYPES.HealthController).to(HealthController);
container
  .bind<AdvancedHealthController>(TYPES.AdvancedHealthController)
  .to(AdvancedHealthController);
