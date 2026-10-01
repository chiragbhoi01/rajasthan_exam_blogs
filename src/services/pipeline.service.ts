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
import { AeoEngineService } from './aeo-engine.service.js';
import { InternalLinkerService } from './internal-linker.service.js';
import { TaxonomyService } from './taxonomy.service.js';
import { ImageGeneratorService } from './image-generator.service.js';
import { EditorialQAService } from './editorial-qa.service.js';
import { RegenerationService } from './regeneration.service.js';

import { markdownToHtml } from '../utils/markdown-parser.js';
import { estimateReadingTime } from '../utils/text-cleaner.js';
import { PipelineOptions, PipelineExecutionResult, PipelineStage } from '../types/pipeline.js';
import { ContentPackageV1, QAStatus } from '../types/content-package.js';
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
  private aeoEngine: AeoEngineService;
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
    this.aeoEngine = new AeoEngineService();
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
    const dryRun = options.dryRun !== undefined ? options.dryRun : true; // Default safe dry-run
    let stage: PipelineStage = 'INITIALIZING';

    logger.info(`=======================================================`);
    logger.info(`Starting Rajasthan Exam Twister AI Blog Pipeline [DryRun: ${dryRun}]`);
    logger.info(`=======================================================`);

    try {
      // Step 1: Topic Resolution (Manual or Discovery)
      stage = 'DISCOVERING';
      let selectedTopic = options.topic;
      let articleType = options.articleType || 'RAJASTHAN_GK';
      let categorySuggestion = options.category || 'Rajasthan GK';

      if (!selectedTopic) {
        const candidates = await this.topicDiscovery.discoverTrendingTopics({ count: 1 });
        if (candidates.length === 0) {
          throw new Error('No valid topic candidate discovered.');
        }
        const topCandidate = candidates[0];
        selectedTopic = topCandidate.topic;
        articleType = topCandidate.articleType;
        categorySuggestion = topCandidate.categorySuggestion;
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

      // Step 5: AEO (Answer Engine Optimization) Generation
      stage = 'AEO';
      const aeoBlock = this.aeoEngine.generateAeoBlock(
        selectedTopic,
        articleType,
        factVerification.verifiedClaims
      );

      // Step 6: MCQs and FAQs Generation
      const mcqs = this.mcqGenerator.generateMCQs(selectedTopic, factVerification.verifiedClaims, 5);
      const faqs = this.faqGenerator.generateFAQs(selectedTopic, 4);

      // Step 7: Article Generation
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

      // Step 8: Taxonomy Resolution (Category & Tags)
      stage = 'TAXONOMY';
      let taxonomyResult = {
        categoryId: null as any,
        categoryName: categorySuggestion,
        tagIds: [] as any[],
        tagNames: [] as string[],
      };

      if (!dryRun) {
        try {
          taxonomyResult = await this.taxonomyService.resolveTaxonomy(selectedTopic, articleType, options.category);
        } catch {
          taxonomyResult.categoryName = options.category || categorySuggestion;
          taxonomyResult.tagNames = ['Rajasthan GK', 'Exam Twister Study Material'];
        }
      } else {
        taxonomyResult.categoryName = options.category || categorySuggestion;
        taxonomyResult.tagNames = ['Rajasthan GK', 'Exam Twister Study Material'];
      }

      // Step 9: Featured Image Processing
      stage = 'IMAGE_GENERATION';
      const imageResult = await this.imageGenerator.processFeaturedImage(
        selectedTopic,
        articleType,
        taxonomyResult.categoryName
      );

      // Step 10: Rich HTML Conversion & Excerpt
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

      // Step 11: Editorial QA Gate
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

      let qaStatus: QAStatus = 'PASS';
      if (qaReport.hasHardBlocks) {
        qaStatus = 'FAIL';
      } else if (qaReport.score < 75) {
        qaStatus = 'HOLD';
      } else if (qaReport.warnings.length > 0) {
        qaStatus = 'WARNING';
      }

      // Step 12: Content Package Assembly (v1.0 Standard Contract)
      stage = 'PACKAGING';
      const contentPackage: ContentPackageV1 = {
        version: '1.0',
        topic: selectedTopic,
        articleType,
        classification: options.classification || 'CREATE_NEW',
        article: {
          title: selectedTopic,
          slug: seoBrief.suggestedSlug,
          excerpt,
          content: htmlContent,
          wordCount: writeResult.wordCount,
          readingTime,
          categorySuggestion: taxonomyResult.categoryName,
          tags: taxonomyResult.tagNames,
        },
        seo: {
          title: seoBrief.metaTitle,
          metaDescription: seoBrief.metaDescription,
          primaryKeyword: seoBrief.primaryKeyword,
          secondaryKeywords: seoBrief.secondaryKeywords,
          searchIntent: seoBrief.searchIntent,
          canonicalPath: `/blogs/${seoBrief.suggestedSlug}`,
        },
        aeo: aeoBlock,
        faq: faqs,
        mcqs,
        sources: researchData.sources,
        internalLinks: seoBrief.internalLinks,
        image: {
          prompt: imageResult.prompt.visualConcept,
          altText: imageResult.prompt.altText,
          width: 1200,
          height: 630,
          visualConcept: imageResult.prompt.visualConcept,
        },
        research: {
          verifiedClaims: factVerification.verifiedClaims,
          uncertainClaims: factVerification.uncertainClaims,
          conflictingClaims: factVerification.conflicts,
          overallFactualConfidence: factVerification.overallFactualConfidence,
        },
        qa: {
          status: qaStatus,
          score: qaReport.score,
          passed: qaReport.passed,
          hardBlocks: qaReport.hardBlocks.map((b) => b.message),
          warnings: qaReport.warnings.map((w) => w.message),
        },
        timestamps: {
          generatedAt: new Date().toISOString(),
          lastVerifiedAt: new Date().toISOString(),
          requiresRecheck: articleType === 'CURRENT_AFFAIRS' || articleType === 'EXAM_UPDATE',
          eventDate: new Date().toISOString().split('T')[0],
        },
      };

      if (qaReport.hasHardBlocks) {
        logger.error(`Editorial QA failed with ${qaReport.hardBlocks.length} hard blocks.`);
        return {
          success: false,
          stage: 'EDITORIAL_QA',
          topic: selectedTopic,
          blogDraft,
          qaReport,
          imageResult,
          aeoBlock,
          contentPackage,
          errors: qaReport.hardBlocks.map((b) => b.message),
          warnings: qaReport.warnings.map((w) => w.message),
          dryRun,
          durationMs: Date.now() - startTime,
        };
      }

      // Step 13: Optional CMS Storage (if MongoDB is connected and not dryRun)
      stage = 'CMS_SAVING';
      let savedBlog: BlogDocument = blogDraft;
      let savedResearch: BlogResearchDocument | undefined;

      if (!dryRun) {
        try {
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
            model: 'Native Antigravity Content Engine',
          });
          contentPackage.id = savedBlog._id?.toString();
          logger.info(`Saved draft in CMS with Blog ID: ${savedBlog._id}`);
        } catch (dbErr: any) {
          logger.warn(`MongoDB write skipped (${dbErr?.message}). Content Package is preserved in memory/file export.`);
        }
      }

      stage = 'COMPLETED';
      logger.info(`=======================================================`);
      logger.info(`Pipeline Completed Successfully for "${selectedTopic}" in ${Date.now() - startTime}ms`);
      logger.info(`Status: DRAFT (QA Status: ${qaStatus} | Score: ${qaReport.score}/100)`);
      logger.info(`=======================================================`);

      return {
        success: true,
        stage: 'COMPLETED',
        topic: selectedTopic,
        blogDraft: savedBlog,
        research: savedResearch || (researchDocSummary as any),
        qaReport,
        imageResult,
        aeoBlock,
        contentPackage,
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
