import { inject, injectable } from 'inversify';
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserId } from '../../../domain/value-objects/UserId';
import { UserName } from '../../../domain/value-objects/UserName';
import { UserLastName } from '../../../domain/value-objects/UserLastName';
import { UserEmail } from '../../../domain/value-objects/UserEmail';
import { UserEmailAlreadyExistsError } from '../../../domain/errors';
import { LogUseCase } from '../../../infrastructure/decorators';
import { TYPES } from '../../../infrastructure/di/types';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from '../../dtos/UserDtos';

@injectable()
@LogUseCase()
export class CreateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(request: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const name = new UserName(request.name);
    const lastName = new UserLastName(request.lastName);
    const email = new UserEmail(request.email);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserEmailAlreadyExistsError(request.email);
    }

    const id = UserId.generate();
    const user = User.create(id, name, lastName, email);

    await this.userRepository.save(user);

    return user.toPrimitives();
  }
}
