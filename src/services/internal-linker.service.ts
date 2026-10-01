import { BlogRepository } from '../repositories/blog.repository.js';
import { InternalLinkItem } from '../types/research.js';
import { ENV } from '../config/env.config.js';

export class InternalLinkerService {
  constructor(private blogRepo?: BlogRepository) {}

  async getVerifiedInternalLinks(topic: string, isDryRun = false): Promise<InternalLinkItem[]> {
    const verifiedLinks: InternalLinkItem[] = [];

    // 1. Static standard platform resources (Always guaranteed to exist)
    verifiedLinks.push(
      {
        title: 'राजस्थान जीके दैनिक मॉक टेस्ट',
        url: `${ENV.SITE_BASE_URL}/quizzes/daily-rajasthan-gk`,
        slug: 'daily-rajasthan-gk',
        type: 'QUIZ',
        context: 'Daily Quiz',
      },
      {
        title: 'राजस्थान प्रतियोगी परीक्षा सम्पूर्ण हस्तलिखित नोट्स',
        url: `${ENV.SITE_BASE_URL}/notes/rajasthan-gk-complete`,
        slug: 'rajasthan-gk-complete',
        type: 'NOTE',
        context: 'Comprehensive Notes',
      },
      {
        title: 'RPSC एवं RSSB परीक्षा विगत वर्ष प्रश्न पत्र संग्रह',
        url: `${ENV.SITE_BASE_URL}/exams/previous-year-papers`,
        slug: 'previous-year-papers',
        type: 'EXAM',
        context: 'Previous Year Papers',
      }
    );

    // 2. Query published blogs from MongoDB if available and not dry run
    if (this.blogRepo && !isDryRun) {
      try {
        const publishedBlogs = await this.blogRepo.listRecent(10, 'PUBLISHED');
        for (const blog of publishedBlogs) {
          verifiedLinks.push({
            title: blog.title,
            url: `${ENV.SITE_BASE_URL}/blogs/${blog.slug}`,
            slug: blog.slug,
            type: 'BLOG',
            context: 'Related Published Article',
          });
        }
      } catch {
        // Fallback gracefully
      }
    }

    return verifiedLinks;
  }
}
