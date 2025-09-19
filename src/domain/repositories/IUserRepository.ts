import { User } from '../entities/User';
import { UserId } from '../value-objects/UserId';
import { UserEmail } from '../value-objects/UserEmail';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: UserEmail): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: UserId): Promise<void>;
  update(user: User): Promise<void>;
}
