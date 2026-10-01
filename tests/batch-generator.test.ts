import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { BatchGeneratorService } from '../src/services/batch-generator.service.js';

describe('BatchGeneratorService', () => {
  const batchService = new BatchGeneratorService();
  const testOutputDir = path.join(process.cwd(), 'scratch', 'test-batch');

  it('should generate structured JSON content packages and manifest.json for batch runs', async () => {
    const result = await batchService.runBatch({
      count: 2,
      outputDir: testOutputDir,
      dryRun: true,
    });

    expect(result.packages.length).toBe(2);
    expect(result.manifest.totalCount).toBe(2);
    expect(result.manifest.summary.pass).toBeGreaterThanOrEqual(1);
    expect(fs.existsSync(path.join(testOutputDir, 'manifest.json'))).toBe(true);
    expect(fs.existsSync(path.join(testOutputDir, 'article-001.json'))).toBe(true);

    const firstPkg = JSON.parse(fs.readFileSync(path.join(testOutputDir, 'article-001.json'), 'utf-8'));
    expect(firstPkg.version).toBe('1.0');
    expect(firstPkg.article.title).toBeDefined();
    expect(firstPkg.seo.canonicalPath).toBeDefined();
    expect(firstPkg.aeo.directAnswer).toBeDefined();
    expect(firstPkg.mcqs.length).toBeGreaterThanOrEqual(3);
    expect(firstPkg.qa.status).toBe('PASS');
  });
});
