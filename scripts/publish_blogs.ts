import { getDb, closeDb } from '../src/lib/mongodb.js';
import { ObjectId } from 'mongodb';

async function main() {
  const args = process.argv.slice(2);
  const targetId = args.find(a => !a.startsWith('--'));

  try {
    const db = await getDb();

    let query: any = { status: 'DRAFT' };
    if (targetId) {
      try {
        query = { _id: new ObjectId(targetId) };
      } catch {
        query = { _id: targetId };
      }
    }
    const updateResult = await db.collection('blogs').updateMany(
      query,
      {
        $set: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    console.log(`\n================ PUBLISH SUMMARY ================`);
    console.log(`Updated ${updateResult.modifiedCount} blog(s) to PUBLISHED status.`);
    console.log(`=================================================\n`);
  } catch (err) {
    console.error('Error publishing blogs:', err);
  } finally {
    await closeDb();
  }
}

main();
