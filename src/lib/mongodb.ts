import { MongoClient, Db } from 'mongodb';
import { ENV } from '../config/env.config.js';
import { logger } from './logger.js';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  try {
    client = new MongoClient(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    await client.connect();
    db = client.db(ENV.MONGODB_DB_NAME);
    logger.info(`Connected to MongoDB Database: ${ENV.MONGODB_DB_NAME}`);
    return db;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    logger.info('MongoDB connection closed.');
  }
}
