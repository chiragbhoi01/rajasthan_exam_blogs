import fs from 'fs';
import path from 'path';
import { BlogAutomationPipeline } from '../src/services/pipeline.service.js';

function parseArgs(): { topic?: string; outFile?: string } {
  const args = process.argv.slice(2);
  let topic: string | undefined;
  let outFile: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--topic' || args[i] === '-t') && args[i + 1]) {
      topic = args[i + 1];
      i++;
    } else if ((args[i] === '--out' || args[i] === '-o' || args[i] === '--file') && args[i + 1]) {
      outFile = args[i + 1];
      i++;
    } else if (!args[i].startsWith('-') && !topic) {
      topic = args[i];
    }
  }

  return { topic, outFile };
}

async function main() {
  const { topic, outFile } = parseArgs();
  const targetTopic = topic || 'राजस्थान के प्रमुख लोक नृत्य: घूमर, कालबेलिया, तेरहताली एवं अग्नि नृत्य';
  const pipeline = new BlogAutomationPipeline();

  console.log(`\nExporting Content Package for topic: "${targetTopic}"...`);

  const result = await pipeline.runPipeline({
    topic: targetTopic,
    dryRun: true,
  });

  if (!result.success || !result.contentPackage) {
    console.error('Export failed:', result.errors);
    process.exit(1);
  }

  const destination = outFile || path.join(process.cwd(), 'output-package.json');
  fs.writeFileSync(destination, JSON.stringify(result.contentPackage, null, 2), 'utf-8');

  console.log('\n================ EXPORT SUCCESSFUL ================');
  console.log(`Package Version: ${result.contentPackage.version}`);
  console.log(`Title: ${result.contentPackage.article.title}`);
  console.log(`Slug: ${result.contentPackage.article.slug}`);
  console.log(`QA Status: ${result.contentPackage.qa.status} (Score: ${result.contentPackage.qa.score}/100)`);
  console.log(`AEO Direct Answer: ${result.contentPackage.aeo.directAnswer.substring(0, 80)}...`);
  console.log(`Exported JSON File: ${destination}`);
  console.log('===================================================\n');
}

main();
