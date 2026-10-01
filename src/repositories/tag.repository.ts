import { Collection, ObjectId } from 'mongodb';
import { getDb } from '../lib/mongodb.js';
import { TagDocument } from '../types/taxonomy.js';
import { logger } from '../lib/logger.js';

export class TagRepository {
  private collectionName = 'tags';

  private async getCollection(): Promise<Collection<TagDocument>> {
    const db = await getDb();
    return db.collection<TagDocument>(this.collectionName);
  }

  async findOrCreate(name: string, dimension: TagDocument['dimension'] = 'TOPIC'): Promise<TagDocument> {
    const col = await this.getCollection();
    const cleanName = name.trim();
    const cleanSlug = cleanName.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await col.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${cleanName}$`, 'i') } },
        { slug: cleanSlug }
      ]
    });

    if (existing) return existing;

    const newTag: TagDocument = {
      name: cleanName,
      slug: cleanSlug,
      dimension,
      count: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await col.insertOne(newTag as any);
    newTag._id = res.insertedId;
    return newTag;
  }

  async findOrCreateMany(tags: { name: string; dimension?: TagDocument['dimension'] }[]): Promise<ObjectId[]> {
    const ids: ObjectId[] = [];
    for (const t of tags) {
      const tagDoc = await this.findOrCreate(t.name, t.dimension || 'TOPIC');
      if (tagDoc._id) {
        ids.push(tagDoc._id);
      }
    }
    return ids;
  }

  async listAll(): Promise<TagDocument[]> {
    const col = await this.getCollection();
    return col.find({}).sort({ name: 1 }).toArray();
  }
}
