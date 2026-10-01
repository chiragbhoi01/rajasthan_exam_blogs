import { SuvicharGeneratorService } from '../src/services/suvichar-generator.service.js';
import { closeDb } from '../src/lib/mongodb.js';
import fs from 'fs';
import path from 'path';

async function main() {
  try {
    const service = new SuvicharGeneratorService();
    const suvichar = await service.generateDailySuvichar();

    console.log('\n================ DAILY SUVICHAR FOR X (TWITTER) ================');
    console.log(suvichar.text);
    console.log('================================================================\n');

    // Save to scratch log
    const scratchDir = path.join(process.cwd(), 'scratch');
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }
    const logPath = path.join(scratchDir, 'latest_suvichar.txt');
    fs.writeFileSync(logPath, suvichar.text, 'utf-8');

    console.log(`Saved Suvichar to local file: ${logPath}`);

    const result = await service.postToX(suvichar);
    console.log(`Status: ${result.message}\n`);
  } catch (err: any) {
    console.error('Error generating Suvichar:', err?.message || err);
  } finally {
    await closeDb();
  }
}

main();
