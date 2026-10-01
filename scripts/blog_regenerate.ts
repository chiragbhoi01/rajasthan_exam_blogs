import { BlogAutomationPipeline } from '../src/services/pipeline.service.js';
import { RegenerableSection } from '../src/services/regeneration.service.js';
import { closeDb } from '../src/lib/mongodb.js';

function parseArgs(): { id?: string; section?: RegenerableSection } {
  const args = process.argv.slice(2);
  let id: string | undefined;
  let section: RegenerableSection = 'FAQS';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) {
      id = args[i + 1];
      i++;
    } else if (args[i] === '--section' && args[i + 1]) {
      section = args[i + 1].toUpperCase() as RegenerableSection;
      i++;
    }
  }

  return { id, section };
}

async function main() {
  const { id, section } = parseArgs();
  if (!id) {
    console.error('Error: Please provide blog ID with --id <BLOG_ID>');
    process.exit(1);
  }

  const pipeline = new BlogAutomationPipeline();

  try {
    const result = await pipeline.regeneration.regenerateSection(id, section || 'FAQS');
    console.log('\n================ REGENERATION SUCCESSFUL ================');
    console.log(`Blog ID: ${id}`);
    console.log(`Regenerated Section: ${result.section}`);
    console.log(`Message: ${result.message}`);
    console.log('Updated Fields:', Object.keys(result.updatedFields));
    console.log('=========================================================\n');
  } catch (error) {
    console.error('Regeneration error:', error);
    process.exit(1);
  } finally {
    await closeDb();
  }
}

main();
