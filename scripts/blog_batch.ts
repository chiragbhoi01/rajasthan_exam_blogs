import { BatchGeneratorService } from '../src/services/batch-generator.service.js';

function parseArgs(): { count: number; topic?: string; topicsFile?: string; outputDir?: string } {
  const args = process.argv.slice(2);
  let count = 20;
  let topic: string | undefined;
  let topicsFile: string | undefined;
  let outputDir: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--count' || args[i] === '-n') && args[i + 1]) {
      count = parseInt(args[i + 1], 10) || 20;
      i++;
    } else if ((args[i] === '--topic' || args[i] === '-t') && args[i + 1]) {
      topic = args[i + 1];
      i++;
    } else if ((args[i] === '--topics' || args[i] === '--file') && args[i + 1]) {
      topicsFile = args[i + 1];
      i++;
    } else if ((args[i] === '--out' || args[i] === '--output') && args[i + 1]) {
      outputDir = args[i + 1];
      i++;
    }
  }

  return { count, topic, topicsFile, outputDir };
}

async function main() {
  const { count, topic, topicsFile, outputDir } = parseArgs();
  const batchService = new BatchGeneratorService();

  console.log('\n================ RAJASTHAN EXAM TWISTER BATCH GENERATOR ================');
  console.log(`Target Article Count: ${count}`);
  if (topic) console.log(`Single Topic: "${topic}"`);
  if (topicsFile) console.log(`Topics Input File: ${topicsFile}`);
  console.log('========================================================================\n');

  try {
    const result = await batchService.runBatch({
      count,
      topic,
      topicsFile,
      outputDir,
      dryRun: true,
    });

    console.log('\n================ BATCH MANIFEST SUMMARY ================');
    console.log(`Batch ID: ${result.manifest.batchId}`);
    console.log(`Total Articles Exported: ${result.manifest.totalCount}`);
    console.log(`Quality Status Summary:`);
    console.log(`  - PASS: ${result.manifest.summary.pass}`);
    console.log(`  - WARNING: ${result.manifest.summary.warning}`);
    console.log(`  - HOLD: ${result.manifest.summary.hold}`);
    console.log(`  - FAIL: ${result.manifest.summary.fail}`);
    console.log(`Content Distribution:`);
    for (const [type, cnt] of Object.entries(result.manifest.typeDistribution)) {
      console.log(`  - ${type}: ${cnt}`);
    }
    console.log(`\nOutput Directory: ${result.outputDir}`);
    console.log(`Manifest Location: ${result.outputDir}/manifest.json`);
    console.log('========================================================\n');
  } catch (error) {
    console.error('Batch execution error:', error);
    process.exit(1);
  }
}

main();
