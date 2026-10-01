import { BlogRepository } from '../repositories/blog.repository.js';
import { ResearchRepository } from '../repositories/research.repository.js';
import { FAQGeneratorService } from './faq-generator.service.js';
import { MCQGeneratorService } from './mcq-generator.service.js';
import { SeoEngineService } from './seo-engine.service.js';
import { ImageGeneratorService } from './image-generator.service.js';
import { TaxonomyService } from './taxonomy.service.js';
import { EditorialQAService } from './editorial-qa.service.js';
import { logger } from '../lib/logger.js';

export type RegenerableSection = 
  | 'FAQS' 
  | 'MCQS' 
  | 'SEO' 
  | 'IMAGE_PROMPT' 
  | 'TAGS' 
  | 'EXCERPT'
  | 'ALL';

export class RegenerationService {
  constructor(
    private blogRepo: BlogRepository,
    private researchRepo: ResearchRepository,
    private faqGen: FAQGeneratorService,
    private mcqGen: MCQGeneratorService,
    private seoEngine: SeoEngineService,
    private imageGen: ImageGeneratorService,
    private taxonomyService: TaxonomyService,
    private editorialQA: EditorialQAService
  ) {}

  async regenerateSection(blogId: string, section: RegenerableSection): Promise<{
    success: boolean;
    section: RegenerableSection;
    updatedFields: Record<string, any>;
    message: string;
  }> {
    logger.info(`Starting selective regeneration for Blog ID: ${blogId}, Section: ${section}`);

    const blog = await this.blogRepo.findById(blogId);
    if (!blog) {
      throw new Error(`Blog with ID ${blogId} not found`);
    }

    const research = await this.researchRepo.findByBlogId(blogId);
    const topic = blog.title;
    const articleType = blog.articleType || 'RAJASTHAN_GK';
    const updatedFields: Record<string, any> = {};

    switch (section) {
      case 'FAQS': {
        const newFaqs = this.faqGen.generateFAQs(topic, 5);
        updatedFields.faqs = newFaqs;
        await this.blogRepo.update(blogId, { faqs: newFaqs });
        break;
      }

      case 'MCQS': {
        const newMcqs = this.mcqGen.generateMCQs(topic, research?.verifiedClaims || [], 6);
        updatedFields.mcqs = newMcqs;
        await this.blogRepo.update(blogId, { mcqs: newMcqs });
        break;
      }

      case 'SEO': {
        const newSeo = this.seoEngine.generateSeoMetadata(topic, articleType);
        updatedFields.metaTitle = newSeo.metaTitle;
        updatedFields.metaDescription = newSeo.metaDescription;
        updatedFields.primaryKeyword = newSeo.primaryKeyword;
        updatedFields.secondaryKeywords = newSeo.secondaryKeywords;
        await this.blogRepo.update(blogId, {
          metaTitle: newSeo.metaTitle,
          metaDescription: newSeo.metaDescription,
          primaryKeyword: newSeo.primaryKeyword,
          secondaryKeywords: newSeo.secondaryKeywords,
        });
        break;
      }

      case 'IMAGE_PROMPT': {
        const prompt = this.imageGen.generateImagePrompt(topic, articleType, 'Rajasthan GK');
        updatedFields.imagePrompt = prompt;
        break;
      }

      case 'TAGS': {
        const tax = await this.taxonomyService.resolveTaxonomy(topic, articleType);
        updatedFields.tagIds = tax.tagIds;
        await this.blogRepo.update(blogId, { tagIds: tax.tagIds });
        break;
      }

      case 'EXCERPT': {
        const cleanExcerpt = `${topic} के सम्पूर्ण प्रामाणिक तथ्य, तुलनात्मक सारणी एवं विगत परीक्षाओं के हल सहित परीक्षा उपयोगी नोट्स।`;
        updatedFields.excerpt = cleanExcerpt;
        await this.blogRepo.update(blogId, { excerpt: cleanExcerpt });
        break;
      }

      default:
        throw new Error(`Unsupported regeneration section: ${section}`);
    }

    logger.info(`Successfully regenerated section "${section}" for Blog ID ${blogId}`);
    return {
      success: true,
      section,
      updatedFields,
      message: `Section ${section} regenerated and updated in draft successfully`,
    };
  }
}
