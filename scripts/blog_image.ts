import { BlogRepository } from '../src/repositories/blog.repository.js';
import { ImageGeneratorService } from '../src/services/image-generator.service.js';
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
  const imageGen = new ImageGeneratorService();

  try {
    const blog = await blogRepo.findById(id);
    if (!blog) {
      console.error(`Error: Blog with ID ${id} not found.`);
      process.exit(1);
    }

    const imageResult = await imageGen.processFeaturedImage(
      blog.title,
      blog.articleType || 'RAJASTHAN_GK',
      'Rajasthan GK'
    );

    console.log('\n================ FEATURED IMAGE SPECIFICATION ================');
    console.log(`Blog Title: ${blog.title}`);
    console.log(`Status: ${imageResult.status}`);
    console.log(`Headline: ${imageResult.prompt.headline}`);
    console.log(`Subheading: ${imageResult.prompt.subheading}`);
    console.log(`Visual Concept: ${imageResult.prompt.visualConcept}`);
    console.log(`Aspect Ratio: ${imageResult.prompt.aspectRatio}`);
    console.log(`Alt Text: ${imageResult.prompt.altText}`);
    console.log(`Color Palette: ${imageResult.prompt.colorPalette.join(', ')}`);
    console.log(`Visual Elements:`);
    imageResult.prompt.visualElements.forEach((el) => console.log(`  - ${el}`));
    console.log('===============================================================\n');
  } finally {
    await closeDb();
  }
}

main();
