import { getDb, closeDb } from '../src/lib/mongodb.js';

async function main() {
  try {
    const db = await getDb();
    const blogs = await db.collection('blogs').find({}).toArray();

    let updatedCount = 0;
    for (const blog of blogs) {
      if (blog.slug) {
        const canonicalUrl = `https://rajasthanexamtwister.in/blogs/${blog.slug}`;
        await db.collection('blogs').updateOne(
          { _id: blog._id },
          { $set: { canonicalUrl } }
        );
        updatedCount++;
      }
    }

    console.log(`\n================ CANONICAL URL UPDATE ================`);
    console.log(`Successfully updated canonical URLs for ${updatedCount} blog(s) to https://rajasthanexamtwister.in`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error('Error updating canonical URLs:', err);
  } finally {
    await closeDb();
  }
}

main();
