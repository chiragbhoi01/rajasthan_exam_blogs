import { NotificationScraperService } from '../src/services/notification-scraper.service.js';
import { closeDb } from '../src/lib/mongodb.js';
import { logger } from '../src/lib/logger.js';

async function main() {
  logger.info('=======================================================');
  logger.info('Running Standalone RPSC / RSSB Live Exam Update Scraper');
  logger.info('=======================================================');

  try {
    const scraper = new NotificationScraperService();
    const result = await scraper.checkForUpdatesAndAutoPublish();

    console.log('\n================ EXAM UPDATE SCRAPER SUMMARY ================');
    console.log(`New Notifications Evaluated: ${result.processed}`);
    console.log(`Blogs Auto-Published: ${result.published.length}`);
    if (result.published.length > 0) {
      result.published.forEach((title, i) => {
        console.log(`  ${i + 1}. ${title}`);
      });
    } else {
      console.log('  No new un-published exam notifications detected.');
    }
    console.log('=============================================================\n');
  } catch (err: any) {
    logger.error('Fatal error during Notification Scraper run:', err?.message || err);
  } finally {
    await closeDb();
  }
}

main();
