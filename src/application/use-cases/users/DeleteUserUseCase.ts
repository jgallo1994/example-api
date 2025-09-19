import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserId } from '../../../domain/value-objects/UserId';
import { UserNotFoundError } from '../../../domain/errors';
import { LogUseCase } from '../../../infrastructure/decorators';
import { TYPES } from '../../../infrastructure/di/types';
import {
  DeleteUserRequestDto,
  DeleteUserResponseDto,
} from '../../dtos/UserDtos';

@injectable()
@LogUseCase()
export class DeleteUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(request: DeleteUserRequestDto): Promise<DeleteUserResponseDto> {
    const id = new UserId(request.id);
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new UserNotFoundError(request.id);
    }

    const deletedUser = existingUser.delete();
    await this.userRepository.update(deletedUser);

    return {
      id: request.id,
      message: 'User deleted successfully',
    };
  }
}
