import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { LogUseCase } from '../../../infrastructure/decorators';
import { TYPES } from '../../../infrastructure/di/types';
import { GetAllUsersResponseDto } from '../../dtos/UserDtos';

@injectable()
@LogUseCase()
export class GetAllUsersUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(): Promise<GetAllUsersResponseDto> {
    const users = await this.userRepository.findAll();

    return {
      users: users.map(user => user.toPrimitives()),
      total: users.length,
    };
  }
}
