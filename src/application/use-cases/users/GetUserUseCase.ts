import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserId } from '../../../domain/value-objects/UserId';
import { UserNotFoundError } from '../../../domain/errors';
import { LogUseCase } from '../../../infrastructure/decorators';
import { TYPES } from '../../../infrastructure/di/types';
import { GetUserRequestDto, GetUserResponseDto } from '../../dtos/UserDtos';

@injectable()
@LogUseCase()
export class GetUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(request: GetUserRequestDto): Promise<GetUserResponseDto> {
    const id = new UserId(request.id);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError(request.id);
    }

    return user.toPrimitives();
  }
}
