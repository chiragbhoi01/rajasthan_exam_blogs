import { BlogRepository } from '../repositories/blog.repository.js';
import { ResearchRepository } from '../repositories/research.repository.js';
import { CategoryRepository } from '../repositories/category.repository.js';
import { TagRepository } from '../repositories/tag.repository.js';
import { MediaRepository } from '../repositories/media.repository.js';

import { TopicDiscoveryService } from './topic-discovery.service.js';
import { TopicScorerService } from './topic-scorer.service.js';
import { ResearchEngineService } from './research-engine.service.js';
import { FactCheckerService } from './fact-checker.service.js';
import { ArticleWriterService } from './article-writer.service.js';
import { MCQGeneratorService } from './mcq-generator.service.js';
import { FAQGeneratorService } from './faq-generator.service.js';
import { SeoEngineService } from './seo-engine.service.js';
import { InternalLinkerService } from './internal-linker.service.js';
import { TaxonomyService } from './taxonomy.service.js';
import { ImageGeneratorService } from './image-generator.service.js';
import { EditorialQAService } from './editorial-qa.service.js';
import { RegenerationService } from './regeneration.service.js';

import { markdownToHtml } from '../utils/markdown-parser.js';
import { estimateReadingTime } from '../utils/text-cleaner.js';
import { PipelineOptions, PipelineExecutionResult, PipelineStage } from '../types/pipeline.js';
import { BlogDocument } from '../types/blog.js';
import { BlogResearchDocument } from '../types/research.js';
import { ENV } from '../config/env.config.js';
import { logger } from '../lib/logger.js';

export class BlogAutomationPipeline {
  private blogRepo: BlogRepository;
  private researchRepo: ResearchRepository;
  private categoryRepo: CategoryRepository;
  private tagRepo: TagRepository;
  private mediaRepo: MediaRepository;

  private topicDiscovery: TopicDiscoveryService;
  private topicScorer: TopicScorerService;
  private researchEngine: ResearchEngineService;
  private factChecker: FactCheckerService;
  private articleWriter: ArticleWriterService;
  private mcqGenerator: MCQGeneratorService;
  private faqGenerator: FAQGeneratorService;
  private seoEngine: SeoEngineService;
  private internalLinker: InternalLinkerService;
  private taxonomyService: TaxonomyService;
  private imageGenerator: ImageGeneratorService;
  private editorialQA: EditorialQAService;
  public regeneration: RegenerationService;

  constructor() {
    this.blogRepo = new BlogRepository();
    this.researchRepo = new ResearchRepository();
    this.categoryRepo = new CategoryRepository();
    this.tagRepo = new TagRepository();
    this.mediaRepo = new MediaRepository();

    this.topicScorer = new TopicScorerService(this.blogRepo);
    this.topicDiscovery = new TopicDiscoveryService(this.blogRepo);
    this.researchEngine = new ResearchEngineService();
    this.factChecker = new FactCheckerService();
    this.articleWriter = new ArticleWriterService();
    this.mcqGenerator = new MCQGeneratorService();
    this.faqGenerator = new FAQGeneratorService();
    this.seoEngine = new SeoEngineService();
    this.internalLinker = new InternalLinkerService(this.blogRepo);
    this.taxonomyService = new TaxonomyService(this.categoryRepo, this.tagRepo);
    this.imageGenerator = new ImageGeneratorService(this.mediaRepo);
    this.editorialQA = new EditorialQAService();

    this.regeneration = new RegenerationService(
      this.blogRepo,
      this.researchRepo,
      this.faqGenerator,
      this.mcqGenerator,
      this.seoEngine,
      this.imageGenerator,
      this.taxonomyService,
      this.editorialQA
    );
  }

  async runPipeline(options: PipelineOptions): Promise<PipelineExecutionResult> {
    const startTime = Date.now();
    const dryRun = options.dryRun || ENV.BLOG_AUTOMATION_DRY_RUN;
    let stage: PipelineStage = 'INITIALIZING';

    logger.info(`=======================================================`);
    logger.info(`Starting Rajasthan Exam Twister AI Blog Pipeline [DryRun: ${dryRun}]`);
    logger.info(`=======================================================`);

    try {
      // Step 1: Topic Resolution (Manual or Discovery)
      stage = 'DISCOVERING';
      let selectedTopic = options.topic;
      let articleType = options.articleType || 'RAJASTHAN_GK';

      if (!selectedTopic) {
        const candidates = await this.topicDiscovery.discoverTrendingTopics();
        if (candidates.length === 0) {
          throw new Error('No valid topic candidate discovered.');
        }
        const topCandidate = candidates[0];
        selectedTopic = topCandidate.topic;
        articleType = topCandidate.articleType;
        logger.info(`Autonomous discovery selected: "${selectedTopic}" (Score: ${topCandidate.score})`);
      } else {
        logger.info(`Manual topic provided: "${selectedTopic}"`);
      }

      // Step 2: Live Research & Fact Extraction
      stage = 'RESEARCHING';
      const researchData = await this.researchEngine.conductResearch(selectedTopic, articleType);

      // Step 3: Fact Verification
      stage = 'FACT_CHECKING';
      const factVerification = this.factChecker.verifyClaims(
        researchData.extractedClaims,
        researchData.sources
      );

      // Step 4: SEO Brief & Live Internal Links
      stage = 'BRIEFING';
      const liveInternalLinks = await this.internalLinker.getVerifiedInternalLinks(selectedTopic, dryRun);
      const seoBrief = this.seoEngine.generateSeoMetadata(selectedTopic, articleType, {
        ...researchData.seoBrief,
        internalLinks: liveInternalLinks,
      });

      // Step 5: MCQs and FAQs Generation
      const mcqs = this.mcqGenerator.generateMCQs(selectedTopic, factVerification.verifiedClaims, 5);
      const faqs = this.faqGenerator.generateFAQs(selectedTopic, 4);

      // Step 6: Article Generation
      stage = 'WRITING';
      const writeResult = await this.articleWriter.generateArticle({
        topic: selectedTopic,
        articleType,
        seoBrief,
        verifiedClaims: factVerification.verifiedClaims,
        sources: researchData.sources,
        mcqs,
        faqs,
      });

      // Step 7: Taxonomy Resolution (Category & Tags)
      stage = 'TAXONOMY';
      let taxonomyResult = {
        categoryId: null as any,
        categoryName: 'Rajasthan GK',
        tagIds: [] as any[],
        tagNames: [] as string[],
      };

      if (!dryRun) {
        taxonomyResult = await this.taxonomyService.resolveTaxonomy(selectedTopic, articleType, options.category);
      } else {
        taxonomyResult.categoryName = options.category || 'Rajasthan GK';
        taxonomyResult.tagNames = ['Rajasthan GK', 'Exam Twister Study Material'];
      }

      // Step 8: Featured Image Processing
      stage = 'IMAGE_GENERATION';
      const imageResult = await this.imageGenerator.processFeaturedImage(
        selectedTopic,
        articleType,
        taxonomyResult.categoryName
      );

      // Step 9: Rich HTML Conversion & Excerpt
      const htmlContent = markdownToHtml(writeResult.cleanedMarkdown);
      const readingTime = estimateReadingTime(writeResult.cleanedMarkdown);
      const excerpt = `${selectedTopic} के सम्पूर्ण प्रामाणिक तथ्य, तुलनात्मक सारणी, विगत परीक्षा प्रश्न एवं विस्तृत नोट्स। राजस्थान RPSC, RSSB, CET व REET परीक्षा की तैयारी हेतु विशेष सामग्री।`;

      // Build Complete Blog Document
      const blogDraft: BlogDocument = {
        title: selectedTopic,
        slug: seoBrief.suggestedSlug,
        excerpt,
        content: htmlContent,
        coverImageId: imageResult.publicId || null,
        coverImageUrl: imageResult.url || null,
        coverImageAlt: imageResult.prompt.altText,
        categoryId: taxonomyResult.categoryId,
        tagIds: taxonomyResult.tagIds,
        status: 'DRAFT', // Strictly DRAFT in automated runs
        metaTitle: seoBrief.metaTitle,
        metaDescription: seoBrief.metaDescription,
        canonicalUrl: `${ENV.SITE_BASE_URL}/blogs/${seoBrief.suggestedSlug}`,
        readingTime,
        featured: false,
        author: ENV.DEFAULT_AUTHOR_NAME,
        articleType: articleType as any,
        primaryKeyword: seoBrief.primaryKeyword,
        secondaryKeywords: seoBrief.secondaryKeywords,
        faqs,
        mcqs,
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Step 10: Editorial QA Gate
      stage = 'EDITORIAL_QA';
      const researchDocSummary: Partial<BlogResearchDocument> = {
        topic: selectedTopic,
        sources: researchData.sources,
        verifiedClaims: factVerification.verifiedClaims,
        uncertainClaims: factVerification.uncertainClaims,
        conflicts: factVerification.conflicts,
        seoBrief,
      };

      const qaReport = this.editorialQA.runQA(blogDraft, researchDocSummary);

      if (qaReport.hasHardBlocks) {
        logger.error(`Editorial QA failed with ${qaReport.hardBlocks.length} hard blocks.`);
        return {
          success: false,
          stage: 'EDITORIAL_QA',
          topic: selectedTopic,
          blogDraft,
          qaReport,
          imageResult,
          errors: qaReport.hardBlocks.map((b) => b.message),
          warnings: qaReport.warnings.map((w) => w.message),
          dryRun,
          durationMs: Date.now() - startTime,
        };
      }

      // Step 11: CMS Storage (unless Dry Run)
      stage = 'CMS_SAVING';
      let savedBlog: BlogDocument = blogDraft;
      let savedResearch: BlogResearchDocument | undefined;

      if (!dryRun) {
        savedBlog = await this.blogRepo.createDraft(blogDraft);
        savedResearch = await this.researchRepo.saveResearch({
          blogId: savedBlog._id,
          topic: selectedTopic,
          articleType,
          researchDate: new Date(),
          sources: researchData.sources,
          verifiedClaims: factVerification.verifiedClaims,
          uncertainClaims: factVerification.uncertainClaims,
          conflicts: factVerification.conflicts,
          seoBrief,
          generatedBy: 'Antigravity AI Automation Engine',
          model: 'Built-in Native Antigravity Generator',
        });
        logger.info(`Saved draft in CMS with Blog ID: ${savedBlog._id} and Research ID: ${savedResearch._id}`);
      } else {
        logger.info(`[DRY RUN ACTIVE] Draft verified and generated without writing to MongoDB.`);
      }

      stage = 'COMPLETED';
      logger.info(`=======================================================`);
      logger.info(`Pipeline Completed Successfully for "${selectedTopic}" in ${Date.now() - startTime}ms`);
      logger.info(`Status: DRAFT (Awaiting Human Review) | QA Score: ${qaReport.score}/100`);
      logger.info(`=======================================================`);

      return {
        success: true,
        stage: 'COMPLETED',
        topic: selectedTopic,
        blogDraft: savedBlog,
        research: savedResearch || (researchDocSummary as any),
        qaReport,
        imageResult,
        warnings: qaReport.warnings.map((w) => w.message),
        dryRun,
        durationMs: Date.now() - startTime,
      };
    } catch (err: any) {
      logger.error(`Pipeline failed at stage [${stage}]:`, err);
      return {
        success: false,
        stage,
        topic: options.topic || 'UNKNOWN',
        errors: [err?.message || 'Unknown pipeline error'],
        dryRun,
        durationMs: Date.now() - startTime,
      };
    }
  }
}
