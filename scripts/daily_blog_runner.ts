import { BlogAutomationPipeline } from '../src/services/pipeline.service.js';
import { getDb, closeDb } from '../src/lib/mongodb.js';
import { logger } from '../src/lib/logger.js';

async function runDailyAutomation() {
  logger.info('=======================================================');
  logger.info('Starting Daily Autonomous Rajasthan Exam Blog Automation');
  logger.info('=======================================================');

  const startTime = Date.now();
  const pipeline = new BlogAutomationPipeline();

  try {
    // 1. Run Pipeline with Autonomous Topic Discovery & DB Save enabled (dryRun = false)
    const result = await pipeline.runPipeline({
      dryRun: false, // Live production DB write
    });

    if (!result.success || !result.blogDraft) {
      throw new Error(`Daily blog pipeline failed at stage [${result.stage}]: ${result.errors?.join(', ') || 'Unknown error'}`);
    }

    const blogDraft = result.blogDraft;
    const blogId = blogDraft._id;

    if (!blogId) {
      throw new Error('Blog draft was generated but no MongoDB _id was returned.');
    }

    // 2. Evaluate QA Status and Auto-Publish if QA Passed
    if (result.qaReport && result.qaReport.passed && !result.qaReport.hasHardBlocks) {
      logger.info(`QA Gate Passed with score ${result.qaReport.score}/100. Publishing Blog ID: ${blogId}...`);

      const db = await getDb();
      await db.collection('blogs').updateOne(
        { _id: blogId },
        {
          $set: {
            status: 'PUBLISHED',
            publishedAt: new Date(),
            updatedAt: new Date(),
          },
        }
      );

      // 3. Trigger Instant Google & Bing Search Indexing Ping
      try {
        const { IndexingService } = await import('../src/services/indexing.service.js');
        const indexingService = new IndexingService();
        await indexingService.pingSearchEngines(blogDraft.canonicalUrl);
      } catch (pingErr: any) {
        logger.warn(`Search engine ping notice: ${pingErr?.message || pingErr}`);
      }

      logger.info('=======================================================');
      logger.info(`SUCCESS: Daily Blog Published Live on Website!`);
      logger.info(`Title: "${blogDraft.title}"`);
      logger.info(`Slug: ${blogDraft.slug}`);
      logger.info(`Blog ID: ${blogId}`);
      logger.info(`Canonical URL: ${blogDraft.canonicalUrl}`);
      logger.info(`Execution Duration: ${Date.now() - startTime}ms`);
      logger.info('=======================================================');
    } else {
      logger.warn(`Blog ID ${blogId} kept in DRAFT state due to QA Score: ${result.qaReport?.score}/100`);
    }
  } catch (error: any) {
    logger.error('Fatal error during Daily Blog Automation:', error?.message || error);
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
}

runDailyAutomation();
