import { BlogAutomationPipeline } from '../src/services/pipeline.service.js';
import { closeDb } from '../src/lib/mongodb.js';

function parseArgs(): { topic?: string; articleType?: string; category?: string; dryRun: boolean } {
  const args = process.argv.slice(2);
  let topic: string | undefined;
  let articleType: string | undefined;
  let category: string | undefined;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--topic' || args[i] === '-t') && args[i + 1]) {
      topic = args[i + 1];
      i++;
    } else if ((args[i] === '--type') && args[i + 1]) {
      articleType = args[i + 1];
      i++;
    } else if ((args[i] === '--category' || args[i] === '-c') && args[i + 1]) {
      category = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    } else if (!args[i].startsWith('-') && !topic) {
      topic = args[i];
    }
  }

  return { topic, articleType, category, dryRun };
}

async function main() {
  const { topic, articleType, category, dryRun } = parseArgs();
  const pipeline = new BlogAutomationPipeline();

  try {
    const result = await pipeline.runPipeline({
      topic,
      articleType,
      category,
      dryRun,
    });

    console.log('\n================ PIPELINE EXECUTION SUMMARY ================');
    console.log(`Topic: ${result.topic}`);
    console.log(`Status: ${result.success ? 'SUCCESS (DRAFT SAVED)' : 'FAILED'}`);
    console.log(`Execution Time: ${result.durationMs}ms`);
    if (result.blogDraft) {
      console.log(`Draft ID: ${result.blogDraft._id || 'N/A (Dry Run)'}`);
      console.log(`Title: ${result.blogDraft.title}`);
      console.log(`Slug: ${result.blogDraft.slug}`);
      console.log(`Reading Time: ${result.blogDraft.readingTime} min`);
      console.log(`Draft Status: ${result.blogDraft.status}`);
      console.log(`MCQs Generated: ${result.blogDraft.mcqs?.length || 0}`);
      console.log(`FAQs Generated: ${result.blogDraft.faqs?.length || 0}`);
    }
    if (result.qaReport) {
      console.log(`QA Score: ${result.qaReport.score}/100`);
      console.log(`QA Checks: ${result.qaReport.checks.length} evaluated`);
    }
    if (result.imageResult) {
      console.log(`Image Status: ${result.imageResult.status}`);
      console.log(`Image Alt Text: ${result.imageResult.prompt.altText}`);
    }
    if (result.warnings && result.warnings.length > 0) {
      console.log('Warnings:', result.warnings);
    }
    if (result.errors && result.errors.length > 0) {
      console.error('Errors:', result.errors);
      process.exit(1);
    }
    console.log('============================================================\n');
  } catch (error) {
    console.error('Fatal execution error:', error);
    process.exit(1);
  } finally {
    await closeDb();
  }
}

main();
