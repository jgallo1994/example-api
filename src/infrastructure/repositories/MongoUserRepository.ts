import { Collection, Document } from 'mongodb';
import { inject, injectable } from 'inversify';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserId } from '../../domain/value-objects/UserId';
import { UserEmail } from '../../domain/value-objects/UserEmail';
import { LogRepository } from '../decorators';
import { TYPES } from '../di/types';
import { MongoConnection } from '../database/MongoConnection';

interface UserDocument extends Document {
  id: string;
  name: string;
  lastName: string;
  email: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

@injectable()
@LogRepository()
export class MongoUserRepository implements IUserRepository {
  private collection: Collection<UserDocument>;

  constructor(
    @inject(TYPES.MongoConnection) private mongoConnection: MongoConnection
  ) {
    this.collection = mongoConnection
      .getDatabase()
      .collection<UserDocument>('users');
  }

  async save(user: User): Promise<void> {
    const userData = user.toPrimitives();
    await this.collection.insertOne(userData);
  }

  async findById(id: UserId): Promise<User | null> {
    const document = await this.collection.findOne({
      id: id.value,
      state: { $ne: 'Deleted' },
    });
    return document ? User.fromPrimitives(document) : null;
  }

  async findByEmail(email: UserEmail): Promise<User | null> {
    const document = await this.collection.findOne({
      email: email.value,
      state: { $ne: 'Deleted' },
    });
    return document ? User.fromPrimitives(document) : null;
  }

  async findAll(): Promise<User[]> {
    const documents = await this.collection
      .find({
        state: { $ne: 'Deleted' },
      })
      .toArray();
    return documents.map(doc => User.fromPrimitives(doc));
  }

  async update(user: User): Promise<void> {
    const userData = user.toPrimitives();
    await this.collection.updateOne({ id: userData.id }, { $set: userData });
  }

  async delete(id: UserId): Promise<void> {
    await this.collection.deleteOne({ id: id.value });
  }
}
