import { ObjectId } from 'mongodb';
import { CategoryRepository } from '../repositories/category.repository.js';
import { TagRepository } from '../repositories/tag.repository.js';
import { TagDocument } from '../types/taxonomy.js';
import { logger } from '../lib/logger.js';

export class TaxonomyService {
  constructor(
    private categoryRepo: CategoryRepository,
    private tagRepo: TagRepository
  ) {}

  async resolveTaxonomy(topic: string, articleType: string, categorySuggestion?: string): Promise<{
    categoryId: ObjectId | null;
    categoryName: string;
    tagIds: ObjectId[];
    tagNames: string[];
  }> {
    logger.info(`Resolving Taxonomy for topic "${topic}" [Type: ${articleType}]...`);

    // 1. Resolve Category
    let targetCatName = categorySuggestion || 'Rajasthan GK';
    const topicLower = topic.toLowerCase();

    if (topicLower.includes('नृत्य') || topicLower.includes('गीत') || topicLower.includes('दुर्ग') || topicLower.includes('कला') || topicLower.includes('मेले') || topicLower.includes('त्योहार')) {
      targetCatName = 'Rajasthan Art & Culture';
    } else if (topicLower.includes('इतिहास') || topicLower.includes('क्रांति') || topicLower.includes('प्रजामंडल') || topicLower.includes('युद्ध')) {
      targetCatName = 'Rajasthan History';
    } else if (topicLower.includes('भूगोल') || topicLower.includes('नदियां') || topicLower.includes('झीलें') || topicLower.includes('जिले') || topicLower.includes('खनिज') || topicLower.includes('संभाग')) {
      targetCatName = 'Rajasthan Geography';
    } else if (topicLower.includes('योजना') || topicLower.includes('बजट') || topicLower.includes('समसामयिकी') || topicLower.includes('current')) {
      targetCatName = 'Rajasthan Current Affairs';
    } else if (topicLower.includes('cet') || topicLower.includes('समान पात्रता')) {
      targetCatName = 'Rajasthan CET';
    } else if (topicLower.includes('rpsc') || topicLower.includes('ras')) {
      targetCatName = 'RPSC';
    } else if (topicLower.includes('rssb') || topicLower.includes('rsmssb')) {
      targetCatName = 'RSSB / RSMSSB';
    } else if (topicLower.includes('reet') || topicLower.includes('शिक्षक भर्ती')) {
      targetCatName = 'REET';
    } else if (topicLower.includes('police') || topicLower.includes('पुलिस')) {
      targetCatName = 'Rajasthan Police';
    }

    const categoryDoc = await this.categoryRepo.findOrCreate(targetCatName);
    const categoryId = categoryDoc._id || null;

    // 2. Generate 4-8 relevant tags across dimensions (Topic, Exam, Subject, Year, Content Type)
    const rawTagList: { name: string; dimension: TagDocument['dimension'] }[] = [
      { name: 'Rajasthan GK', dimension: 'SUBJECT' },
      { name: 'Rajasthan Competitive Exams', dimension: 'EXAM' },
    ];

    if (targetCatName !== 'Rajasthan GK') {
      rawTagList.push({ name: targetCatName, dimension: 'SUBJECT' });
    }

    if (topicLower.includes('cet')) {
      rawTagList.push({ name: 'Rajasthan CET', dimension: 'EXAM' });
      rawTagList.push({ name: 'RSSB Exam', dimension: 'EXAM' });
    }
    if (topicLower.includes('ras') || topicLower.includes('rpsc')) {
      rawTagList.push({ name: 'RPSC RAS', dimension: 'EXAM' });
    }
    if (topicLower.includes('reet')) {
      rawTagList.push({ name: 'REET Exam', dimension: 'EXAM' });
    }
    if (topicLower.includes('नृत्य')) {
      rawTagList.push({ name: 'Rajasthan Folk Dances', dimension: 'TOPIC' });
      rawTagList.push({ name: 'Art & Culture Notes', dimension: 'CONTENT_TYPE' });
    }

    rawTagList.push({ name: 'Exam Twister Study Material', dimension: 'CONTENT_TYPE' });

    const tagIds = await this.tagRepo.findOrCreateMany(rawTagList);
    const tagNames = rawTagList.map((t) => t.name);

    return {
      categoryId,
      categoryName: categoryDoc.name,
      tagIds,
      tagNames,
    };
  }
}
