import { IndexingService } from '../src/services/indexing.service.js';
import { getDb, closeDb } from '../src/lib/mongodb.js';
import { logger } from '../src/lib/logger.js';

async function main() {
  const args = process.argv.slice(2);
  let targetUrl = args.find(a => !a.startsWith('--'));

  try {
    if (!targetUrl) {
      // Fetch most recent published blog from database
      const db = await getDb();
      const recentBlog = await db.collection('blogs').findOne(
        { status: 'PUBLISHED' },
        { sort: { publishedAt: -1 } }
      );
      if (recentBlog && recentBlog.canonicalUrl) {
        targetUrl = recentBlog.canonicalUrl;
      }
    }

    const indexingService = new IndexingService();
    const results = await indexingService.pingSearchEngines(targetUrl);

    console.log('\n================ SEARCH ENGINE INDEXING RESULTS ================');
    results.forEach((r, i) => {
      console.log(`${i + 1}. [${r.engine}] -> ${r.status} (HTTP ${r.statusCode || 'N/A'})`);
      console.log(`   Message: ${r.message}`);
      console.log(`   URL: ${r.url}`);
      console.log('----------------------------------------------------------------');
    });
    console.log('================================================================\n');
  } catch (err: any) {
    logger.error('Error pinging search engines:', err?.message || err);
  } finally {
    await closeDb();
  }
}

main();
