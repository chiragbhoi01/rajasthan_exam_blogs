import fs from 'fs';
import path from 'path';
import { BlogAutomationPipeline } from './pipeline.service.js';
import { TopicDiscoveryService } from './topic-discovery.service.js';
import { ContentPackageV1, BatchManifest, BatchManifestArticleEntry, QAStatus } from '../types/content-package.js';
import { logger } from '../lib/logger.js';

export interface BatchOptions {
  count?: number;
  topic?: string;
  topicsFile?: string;
  outputDir?: string;
  dryRun?: boolean;
}

export class BatchGeneratorService {
  private pipeline: BlogAutomationPipeline;
  private discovery: TopicDiscoveryService;

  constructor() {
    this.pipeline = new BlogAutomationPipeline();
    this.discovery = new TopicDiscoveryService();
  }

  async runBatch(options: BatchOptions): Promise<{
    manifest: BatchManifest;
    packages: ContentPackageV1[];
    outputDir: string;
  }> {
    const count = options.count || 20;
    const outputDir = options.outputDir || path.join(process.cwd(), 'batch');
    const dryRun = options.dryRun !== undefined ? options.dryRun : true;

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    logger.info(`=======================================================`);
    logger.info(`Starting Batch Generation Engine [Target Count: ${count}]`);
    logger.info(`Output Directory: ${outputDir}`);
    logger.info(`=======================================================`);

    let targetTopics: Array<{ topic: string; articleType?: string; category?: string }> = [];

    // 1. If explicit single topic provided
    if (options.topic) {
      targetTopics.push({ topic: options.topic });
    }
    // 2. If topics JSON file provided
    else if (options.topicsFile && fs.existsSync(options.topicsFile)) {
      const fileContent = fs.readFileSync(options.topicsFile, 'utf-8');
      const parsed = JSON.parse(fileContent);
      if (Array.isArray(parsed)) {
        targetTopics = parsed.map((item) => typeof item === 'string' ? { topic: item } : item);
      }
    }
    // 3. Autonomous discovery from curated pool
    else {
      const candidates = await this.discovery.discoverTrendingTopics({ count });
      targetTopics = candidates.map((c) => ({
        topic: c.topic,
        articleType: c.articleType,
        category: c.categorySuggestion,
      }));
    }

    const packages: ContentPackageV1[] = [];
    const manifestEntries: BatchManifestArticleEntry[] = [];
    const typeDistribution: Record<string, number> = {};
    const summary = { pass: 0, warning: 0, hold: 0, fail: 0 };

    for (let i = 0; i < targetTopics.length; i++) {
      const item = targetTopics[i];
      const indexNumber = String(i + 1).padStart(3, '0');
      const filename = `article-${indexNumber}.json`;

      logger.info(`Processing Batch Item [${i + 1}/${targetTopics.length}]: "${item.topic}"...`);

      const result = await this.pipeline.runPipeline({
        topic: item.topic,
        articleType: item.articleType,
        category: item.category,
        dryRun,
      });

      if (result.contentPackage) {
        const pkg = result.contentPackage;
        packages.push(pkg);

        // Update statistics
        const qaStatus = pkg.qa.status;
        if (qaStatus === 'PASS') summary.pass++;
        else if (qaStatus === 'WARNING') summary.warning++;
        else if (qaStatus === 'HOLD') summary.hold++;
        else summary.fail++;

        const type = pkg.articleType || 'RAJASTHAN_GK';
        typeDistribution[type] = (typeDistribution[type] || 0) + 1;

        const entry: BatchManifestArticleEntry = {
          index: i + 1,
          filename,
          topic: pkg.topic,
          articleType: pkg.articleType,
          slug: pkg.article.slug,
          qaStatus: pkg.qa.status,
          qaScore: pkg.qa.score,
          sourceCount: pkg.sources.length,
          mcqCount: pkg.mcqs.length,
          faqCount: pkg.faq.length,
          wordCount: pkg.article.wordCount,
          classification: pkg.classification,
        };

        manifestEntries.push(entry);

        // Save individual article JSON package
        const filePath = path.join(outputDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2), 'utf-8');
      }
    }

    const batchManifest: BatchManifest = {
      batchId: `batch_${Date.now()}`,
      version: '1.0',
      createdAt: new Date().toISOString(),
      totalCount: packages.length,
      summary,
      typeDistribution,
      articles: manifestEntries,
    };

    // Save batch manifest
    const manifestPath = path.join(outputDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(batchManifest, null, 2), 'utf-8');

    logger.info(`=======================================================`);
    logger.info(`Batch Completed! Exported ${packages.length} articles to ${outputDir}`);
    logger.info(`Summary: PASS: ${summary.pass}, WARN: ${summary.warning}, HOLD: ${summary.hold}, FAIL: ${summary.fail}`);
    logger.info(`Manifest File: ${manifestPath}`);
    logger.info(`=======================================================`);

    return {
      manifest: batchManifest,
      packages,
      outputDir,
    };
  }
}
