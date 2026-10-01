import { BlogRepository } from '../src/repositories/blog.repository.js';
import { ResearchRepository } from '../src/repositories/research.repository.js';
import { EditorialQAService } from '../src/services/editorial-qa.service.js';
import { closeDb } from '../src/lib/mongodb.js';

function parseBlogId(): string | undefined {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) {
      return args[i + 1];
    }
  }
  return undefined;
}

async function main() {
  const id = parseBlogId();
  if (!id) {
    console.error('Error: Please provide blog ID with --id <BLOG_ID>');
    process.exit(1);
  }

  const blogRepo = new BlogRepository();
  const researchRepo = new ResearchRepository();
  const qaService = new EditorialQAService();

  try {
    const blog = await blogRepo.findById(id);
    if (!blog) {
      console.error(`Error: Blog with ID ${id} not found.`);
      process.exit(1);
    }

    const research = await researchRepo.findByBlogId(id);
    const report = qaService.runQA(blog, research || undefined);

    console.log('\n================ EDITORIAL QA REPORT ================');
    console.log(`Blog Title: ${blog.title}`);
    console.log(`Status: ${blog.status}`);
    console.log(`QA Result: ${report.passed ? 'PASSED' : 'BLOCKED'}`);
    console.log(`Score: ${report.score}/100`);
    console.log(`Hard Blocks: ${report.hardBlocks.length}`);
    console.log(`Warnings: ${report.warnings.length}`);
    console.log('\nMetrics:');
    console.log(`  Word Count: ${report.metrics.wordCount}`);
    console.log(`  Reading Time: ${report.metrics.readingTime} min`);
    console.log(`  H1 Elements: ${report.metrics.h1Count}`);
    console.log(`  H2 Sections: ${report.metrics.h2Count}`);
    console.log(`  FAQs: ${report.metrics.faqCount}`);
    console.log(`  MCQs: ${report.metrics.mcqCount}`);
    console.log(`  Sources: ${report.metrics.sourcesCount}`);

    if (report.hardBlocks.length > 0) {
      console.log('\nHard Blocks:');
      report.hardBlocks.forEach((b) => console.log(`  [BLOCK] ${b.name}: ${b.message}`));
    }
    if (report.warnings.length > 0) {
      console.log('\nWarnings:');
      report.warnings.forEach((w) => console.log(`  [WARN] ${w.name}: ${w.message}`));
    }
    console.log('=====================================================\n');
  } finally {
    await closeDb();
  }
}

main();
