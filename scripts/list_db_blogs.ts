import { getDb, closeDb } from '../src/lib/mongodb.js';

async function main() {
  try {
    const db = await getDb();
    const blogs = await db.collection('blogs').find({}).toArray();
    console.log(`\n========== TOTAL BLOGS IN MONGOBD: ${blogs.length} ==========`);
    blogs.forEach((b, i) => {
      console.log(`${i + 1}. [${b.status}] ID: ${b._id}`);
      console.log(`   Title: ${b.title}`);
      console.log(`   Slug: ${b.slug}`);
      console.log(`   Category ID: ${b.categoryId || 'N/A'}`);
      console.log(`   Created At: ${b.createdAt}`);
      console.log('--------------------------------------------------');
    });
  } catch (err) {
    console.error('Error fetching blogs from DB:', err);
  } finally {
    await closeDb();
  }
}

main();
