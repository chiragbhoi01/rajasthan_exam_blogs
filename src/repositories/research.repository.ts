import { Collection, ObjectId } from 'mongodb';
import { getDb } from '../lib/mongodb.js';
import { BlogResearchDocument } from '../types/research.js';
import { logger } from '../lib/logger.js';

export class ResearchRepository {
  private collectionName = 'blog_researches';

  private async getCollection(): Promise<Collection<BlogResearchDocument>> {
    const db = await getDb();
    return db.collection<BlogResearchDocument>(this.collectionName);
  }

  async ensureIndexes(): Promise<void> {
    try {
      const col = await this.getCollection();
      await col.createIndex({ blogId: 1 });
      await col.createIndex({ topic: 1 });
      await col.createIndex({ researchDate: -1 });
    } catch (err) {
      logger.warn('Research repository index notice:', err);
    }
  }

  async saveResearch(doc: Omit<BlogResearchDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<BlogResearchDocument> {
    const col = await this.getCollection();
    const now = new Date();
    const record: BlogResearchDocument = {
      ...doc,
      createdAt: now,
      updatedAt: now,
    };

    const res = await col.insertOne(record as any);
    record._id = res.insertedId;
    logger.info(`Saved blog research trail for topic "${doc.topic}" (ID: ${record._id})`);
    return record;
  }

  async findByBlogId(blogId: string | ObjectId): Promise<BlogResearchDocument | null> {
    const col = await this.getCollection();
    const bId = typeof blogId === 'string' ? new ObjectId(blogId) : blogId;
    return col.findOne({ blogId: bId });
  }

  async findRecent(limit = 20): Promise<BlogResearchDocument[]> {
    const col = await this.getCollection();
    return col.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
  }
}
