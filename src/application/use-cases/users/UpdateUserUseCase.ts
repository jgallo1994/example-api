import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserId } from '../../../domain/value-objects/UserId';
import { UserName } from '../../../domain/value-objects/UserName';
import { UserLastName } from '../../../domain/value-objects/UserLastName';
import { UserEmail } from '../../../domain/value-objects/UserEmail';
import { UserNotFoundError } from '../../../domain/errors';
import { LogUseCase } from '../../../infrastructure/decorators';
import { TYPES } from '../../../infrastructure/di/types';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from '../../dtos/UserDtos';

@injectable()
@LogUseCase()
export class UpdateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(
    request: UpdateUserRequestDto & { id: string }
  ): Promise<UpdateUserResponseDto> {
    const id = new UserId(request.id);
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new UserNotFoundError(request.id);
    }

    let updatedUser = existingUser;

    if (request.name) {
      updatedUser = updatedUser.updateName(new UserName(request.name));
    }

    if (request.lastName) {
      updatedUser = updatedUser.updateLastName(
        new UserLastName(request.lastName)
      );
    }

    if (request.email) {
      updatedUser = updatedUser.updateEmail(new UserEmail(request.email));
    }

    await this.userRepository.update(updatedUser);

    return updatedUser.toPrimitives();
  }
}
