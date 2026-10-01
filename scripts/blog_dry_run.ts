import { BlogAutomationPipeline } from '../src/services/pipeline.service.js';

function parseTopic(): string {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--topic' || args[i] === '-t') && args[i + 1]) {
      return args[i + 1];
    }
  }
  // Check if first arg is a non-flag string
  if (args.length > 0 && !args[0].startsWith('-')) {
    return args.join(' ');
  }
  return 'राजस्थान के लोक नृत्य: घूमर, कालबेलिया, तेरहताली एवं अग्नि नृत्य';
}

async function main() {
  const topic = parseTopic();
  const pipeline = new BlogAutomationPipeline();

  console.log(`\nStarting Dry Run for: "${topic}"\n`);
  const result = await pipeline.runPipeline({
    topic,
    dryRun: true,
  });

  console.log('\n================ DRY RUN STRUCTURED REPORT ================');
  console.log(`Topic: ${result.topic}`);
  console.log(`Dry Run Mode: TRUE (No database writes performed)`);
  console.log(`Success: ${result.success}`);
  console.log(`QA Score: ${result.qaReport?.score}/100`);
  console.log(`Article Title: ${result.blogDraft?.title}`);
  console.log(`Suggested Slug: ${result.blogDraft?.slug}`);
  console.log(`Primary Keyword: ${result.blogDraft?.primaryKeyword}`);
  console.log(`Meta Description: ${result.blogDraft?.metaDescription}`);
  console.log(`Reading Time: ${result.blogDraft?.readingTime} min`);
  console.log(`Verified Sources Attached: ${result.research?.sources.length}`);
  console.log(`Verified Claims: ${result.research?.verifiedClaims.length}`);
  console.log(`MCQs Count: ${result.blogDraft?.mcqs?.length}`);
  console.log(`FAQs Count: ${result.blogDraft?.faqs?.length}`);
  console.log(`Featured Image Prompt:`, result.imageResult?.prompt);
  console.log('============================================================\n');
}

main();
