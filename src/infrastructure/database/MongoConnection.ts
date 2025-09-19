import { MongoClient, Db } from 'mongodb';
import { injectable } from 'inversify';
import { logger } from '../logging/Logger';
import { appConfig } from '../config/AppConfig';

@injectable()
export class MongoConnection {
  private static instance: MongoConnection;
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(
      appConfig.database.uri,
      appConfig.database.options
    );
  }

  static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(appConfig.database.name);
      logger.info('Successfully connected to MongoDB', {
        database: appConfig.database.name,
        uri: appConfig.database.uri,
      });
    } catch (error) {
      logger.error('Error connecting to MongoDB', {
        error,
        database: appConfig.database.name,
        uri: appConfig.database.uri,
      });
      throw error;
    }
  }

  getDatabase(): Db {
    if (!this.db) {
      throw new Error('Database is not connected');
    }
    return this.db;
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.close();
      logger.info('Disconnected from MongoDB');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB', { error });
      throw error;
    }
  }
}
