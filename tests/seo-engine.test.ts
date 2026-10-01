import { describe, it, expect } from 'vitest';
import { SeoEngineService } from '../src/services/seo-engine.service.js';

describe('SeoEngineService', () => {
  const seoEngine = new SeoEngineService();

  it('should generate valid meta title, meta description, and slug', () => {
    const brief = seoEngine.generateSeoMetadata('राजस्थान के लोक नृत्य', 'RAJASTHAN_GK');

    expect(brief.suggestedSlug).toBeDefined();
    expect(brief.suggestedSlug).toContain('rajasthan');
    expect(brief.metaTitle).toContain('Rajasthan Exam Twister');
    expect(brief.metaDescription.length).toBeGreaterThanOrEqual(50);
    expect(brief.metaDescription.length).toBeLessThanOrEqual(170);
    expect(brief.internalLinks.length).toBeGreaterThan(0);
  });
});
