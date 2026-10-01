import { Collection, ObjectId } from 'mongodb';
import { getDb } from '../lib/mongodb.js';
import { CategoryDocument } from '../types/taxonomy.js';
import { STANDARD_RAJASTHAN_CATEGORIES } from '../config/constants.js';
import { logger } from '../lib/logger.js';

export class CategoryRepository {
  private collectionName = 'categories';

  private async getCollection(): Promise<Collection<CategoryDocument>> {
    const db = await getDb();
    return db.collection<CategoryDocument>(this.collectionName);
  }

  async seedStandardCategories(): Promise<void> {
    const col = await this.getCollection();
    for (const cat of STANDARD_RAJASTHAN_CATEGORIES) {
      const existing = await col.findOne({ slug: cat.slug });
      if (!existing) {
        await col.insertOne({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          count: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    logger.info('Standard Rajasthan Exam categories verified/seeded');
  }

  async findByNameOrSlug(query: string): Promise<CategoryDocument | null> {
    const col = await this.getCollection();
    const clean = query.trim().toLowerCase();
    return col.findOne({
      $or: [
        { slug: clean },
        { name: { $regex: new RegExp(`^${query.trim()}$`, 'i') } }
      ]
    });
  }

  async findOrCreate(name: string, slug?: string, description?: string): Promise<CategoryDocument> {
    const col = await this.getCollection();
    const cleanSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    
    const existing = await col.findOne({
      $or: [
        { slug: cleanSlug },
        { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } }
      ]
    });

    if (existing) return existing;

    const newCategory: CategoryDocument = {
      name: name.trim(),
      slug: cleanSlug,
      description: description || `Study guides and updates for ${name}`,
      count: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await col.insertOne(newCategory as any);
    newCategory._id = res.insertedId;
    return newCategory;
  }

  async listAll(): Promise<CategoryDocument[]> {
    const col = await this.getCollection();
    return col.find({}).sort({ name: 1 }).toArray();
  }

  async incrementCount(id: ObjectId | string): Promise<void> {
    const col = await this.getCollection();
    const objId = typeof id === 'string' ? new ObjectId(id) : id;
    await col.updateOne({ _id: objId }, { $inc: { count: 1 }, $set: { updatedAt: new Date() } });
  }
}
