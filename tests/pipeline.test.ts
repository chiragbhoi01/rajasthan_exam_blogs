import { describe, it, expect } from 'vitest';
import { BlogAutomationPipeline } from '../src/services/pipeline.service.js';

describe('BlogAutomationPipeline', () => {
  const pipeline = new BlogAutomationPipeline();

  it('should successfully execute full dry-run pipeline with verified QA and sources', async () => {
    const result = await pipeline.runPipeline({
      topic: 'राजस्थान के लोक नृत्य: घूमर, कालबेलिया, तेरहताली एवं अग्नि नृत्य',
      dryRun: true,
    });

    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(true);
    expect(result.blogDraft).toBeDefined();
    expect(result.blogDraft?.status).toBe('DRAFT');
    expect(result.blogDraft?.mcqs?.length).toBeGreaterThanOrEqual(3);
    expect(result.blogDraft?.faqs?.length).toBeGreaterThanOrEqual(3);
    expect(result.qaReport?.passed).toBe(true);
    expect(result.qaReport?.score).toBeGreaterThanOrEqual(75);
    expect(result.imageResult?.prompt).toBeDefined();
    expect(result.research?.sources.length).toBeGreaterThanOrEqual(2);
  });
});
