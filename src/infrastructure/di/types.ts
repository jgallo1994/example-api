export const TYPES = {
  // Database
  MongoConnection: Symbol.for('MongoConnection'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),

  // Use Cases
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  GetUserUseCase: Symbol.for('GetUserUseCase'),
  GetAllUsersUseCase: Symbol.for('GetAllUsersUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),

  // Services
  HealthCheckService: Symbol.for('HealthCheckService'),
  AdvancedHealthCheckService: Symbol.for('AdvancedHealthCheckService'),

  // Controllers
  UserController: Symbol.for('UserController'),
  HealthController: Symbol.for('HealthController'),
  AdvancedHealthController: Symbol.for('AdvancedHealthController'),
} as const;
