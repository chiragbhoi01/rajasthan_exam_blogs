import { MongoClient, Db } from 'mongodb';
import dns from 'node:dns';
import { ENV } from '../config/env.config.js';
import { logger } from './logger.js';

// Fix for Windows DNS resolution for MongoDB Atlas mongodb+srv URIs
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  try {
    client = new MongoClient(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
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
