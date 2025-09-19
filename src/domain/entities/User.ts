import { UserId } from '../value-objects/UserId';
import { UserName } from '../value-objects/UserName';
import { UserLastName } from '../value-objects/UserLastName';
import { UserEmail } from '../value-objects/UserEmail';
import { UserCreatedAt } from '../value-objects/UserCreatedAt';
import { UserUpdatedAt } from '../value-objects/UserUpdatedAt';
import { UserState } from '../value-objects/UserState';

export interface UserPrimitives  {
  id: string;
  name: string;
  lastName: string;
  email: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserUpdateData {
  name?: UserName;
  lastName?: UserLastName;
  email?: UserEmail;
}

export class User {
  constructor(
    public readonly id: UserId,
    public readonly name: UserName,
    public readonly lastName: UserLastName,
    public readonly email: UserEmail,
    public readonly state: UserState,
    public readonly createdAt: UserCreatedAt,
    public readonly updatedAt: UserUpdatedAt
  ) {}

  static create(
    id: UserId,
    name: UserName,
    lastName: UserLastName,
    email: UserEmail
  ): User {
    return new User(
      id,
      name,
      lastName,
      email,
      UserState.active(),
      new UserCreatedAt(),
      new UserUpdatedAt()
    );
  }

  static fromPrimitives(primitives: UserPrimitives): User {
    return new User(
      new UserId(primitives.id),
      new UserName(primitives.name),
      new UserLastName(primitives.lastName),
      new UserEmail(primitives.email),
      new UserState(primitives.state as 'Active' | 'Suspended' | 'Deleted'),
      new UserCreatedAt(primitives.createdAt),
      new UserUpdatedAt(primitives.updatedAt)
    );
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      lastName: this.lastName.value,
      email: this.email.value,
      state: this.state.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  update(updateData: UserUpdateData): User {
    return new User(
      this.id,
      updateData.name || this.name,
      updateData.lastName || this.lastName,
      updateData.email || this.email,
      this.state,
      this.createdAt,
      new UserUpdatedAt()
    );
  }

  changeState(newState: UserState): User {
    return new User(
      this.id,
      this.name,
      this.lastName,
      this.email,
      newState,
      this.createdAt,
      new UserUpdatedAt()
    );
  }

  suspend(): User {
    return this.changeState(UserState.suspended());
  }

  activate(): User {
    return this.changeState(UserState.active());
  }

  delete(): User {
    return this.changeState(UserState.deleted());
  }

  updateName(name: UserName): User {
    return this.update({ name });
  }

  updateLastName(lastName: UserLastName): User {
    return this.update({ lastName });
  }

  updateEmail(email: UserEmail): User {
    return this.update({ email });
  }

  equals(other: User): boolean {
    if (!other) return false;
    return this.id.equals(other.id);
  }
}
