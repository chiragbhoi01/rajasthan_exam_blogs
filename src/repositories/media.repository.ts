import { Collection, ObjectId } from 'mongodb';
import { getDb } from '../lib/mongodb.js';
import { logger } from '../lib/logger.js';

export interface MediaDocument {
  _id?: ObjectId;
  url: string;
  publicId?: string;
  filename: string;
  altText: string;
  mimeType: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  createdAt: Date;
}

export class MediaRepository {
  private collectionName = 'media';

  private async getCollection(): Promise<Collection<MediaDocument>> {
    const db = await getDb();
    return db.collection<MediaDocument>(this.collectionName);
  }

  async saveMedia(doc: Omit<MediaDocument, '_id' | 'createdAt'>): Promise<MediaDocument> {
    const col = await this.getCollection();
    const media: MediaDocument = {
      ...doc,
      createdAt: new Date(),
    };
    const res = await col.insertOne(media as any);
    media._id = res.insertedId;
    return media;
  }

  async findById(id: string | ObjectId): Promise<MediaDocument | null> {
    const col = await this.getCollection();
    const objId = typeof id === 'string' ? new ObjectId(id) : id;
    return col.findOne({ _id: objId });
  }
}
