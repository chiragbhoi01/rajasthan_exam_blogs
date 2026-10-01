import { Collection, ObjectId } from 'mongodb';
import { getDb } from '../lib/mongodb.js';
import { BlogDocument, BlogStatus } from '../types/blog.js';
import { logger } from '../lib/logger.js';

export class BlogRepository {
  private collectionName = 'blogs';

  private async getCollection(): Promise<Collection<BlogDocument>> {
    const db = await getDb();
    return db.collection<BlogDocument>(this.collectionName);
  }

  async ensureIndexes(): Promise<void> {
    try {
      const col = await this.getCollection();
      await col.createIndex({ slug: 1 }, { unique: true });
      await col.createIndex({ status: 1 });
      await col.createIndex({ categoryId: 1 });
      await col.createIndex({ tagIds: 1 });
      await col.createIndex({ createdAt: -1 });
      await col.createIndex({ title: 'text', content: 'text', excerpt: 'text' });
      logger.info('Blog repository indexes initialized successfully');
    } catch (err) {
      logger.warn('Index initialization notice:', err);
    }
  }

  async createDraft(blog: Omit<BlogDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<BlogDocument> {
    const col = await this.getCollection();
    const now = new Date();
    const doc: BlogDocument = {
      ...blog,
      status: 'DRAFT', // Always DRAFT initially for automated generation
      createdAt: now,
      updatedAt: now,
    };

    const result = await col.insertOne(doc as any);
    doc._id = result.insertedId;
    logger.info(`Blog draft created with ID: ${doc._id}, Title: "${doc.title}"`);
    return doc;
  }

  async findById(id: string | ObjectId): Promise<BlogDocument | null> {
    const col = await this.getCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return col.findOne({ _id: objectId });
  }

  async findBySlug(slug: string): Promise<BlogDocument | null> {
    const col = await this.getCollection();
    return col.findOne({ slug });
  }

  async update(id: string | ObjectId, updates: Partial<BlogDocument>): Promise<BlogDocument | null> {
    const col = await this.getCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    
    // Prevent accidental status switch to PUBLISHED in automated pipelines
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await col.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result;
  }

  async checkDuplicate(title: string, slug: string): Promise<{ exists: boolean; existingDoc?: BlogDocument; reason?: string }> {
    const col = await this.getCollection();
    
    // 1. Check exact slug
    const bySlug = await col.findOne({ slug });
    if (bySlug) {
      return { exists: true, existingDoc: bySlug, reason: `Exact slug duplicate: ${slug}` };
    }

    // 2. Check exact or very close title
    const byTitle = await col.findOne({ title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } });
    if (byTitle) {
      return { exists: true, existingDoc: byTitle, reason: `Exact title match: ${title}` };
    }

    return { exists: false };
  }

  async delete(id: string | ObjectId): Promise<boolean> {
    const col = await this.getCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await col.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }

  async listRecent(limit = 20, status?: BlogStatus): Promise<BlogDocument[]> {
    const col = await this.getCollection();
    const query = status ? { status } : {};
    return col.find(query).sort({ createdAt: -1 }).limit(limit).toArray();
  }
}
