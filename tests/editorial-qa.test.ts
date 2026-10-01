import { describe, it, expect } from 'vitest';
import { EditorialQAService } from '../src/services/editorial-qa.service.js';

describe('EditorialQAService', () => {
  const qaService = new EditorialQAService();

  it('should block drafts with missing H1 heading', () => {
    const report = qaService.runQA(
      {
        title: 'राजस्थान के लोक नृत्य',
        slug: 'rajasthan-ke-lok-nritya',
        content: '<p>Some valid content without any h1 tag in it.</p>',
        metaDescription: 'राजस्थान के लोक नृत्य पर विस्तृत परीक्षा उपयोगी नोट्स। RPSC व CET के लिए महत्वपूर्ण।',
      },
      {
        sources: [{ title: 'Source 1', url: 'https://dipr.rajasthan.gov.in', domain: 'dipr.rajasthan.gov.in', sourceType: 'GOVERNMENT', tier: 1, accessedAt: '', relevance: '', claimsSupported: [] }],
      }
    );

    expect(report.hasHardBlocks).toBe(true);
    expect(report.passed).toBe(false);
    expect(report.hardBlocks.some((b) => b.code === 'BLOCK_MISSING_H1')).toBe(true);
  });

  it('should pass high-quality complete articles', () => {
    const dummyWords = Array(250).fill('परीक्षा').join(' ');
    const content = `<h1>राजस्थान के लोक नृत्य</h1><h2>मुख्य बिंदु</h2><p>${dummyWords}</p>`;

    const report = qaService.runQA(
      {
        title: 'राजस्थान के लोक नृत्य',
        slug: 'rajasthan-ke-lok-nritya',
        content,
        metaDescription: 'राजस्थान के लोक नृत्य पर विस्तृत परीक्षा उपयोगी नोट्स, सारणी एवं अभ्यास प्रश्न। RPSC, RSSB व CET के लिए।',
      },
      {
        sources: [
          { title: 'Source 1', url: 'https://dipr.rajasthan.gov.in', domain: 'dipr.rajasthan.gov.in', sourceType: 'GOVERNMENT', tier: 1, accessedAt: '', relevance: '', claimsSupported: [] },
          { title: 'Source 2', url: 'https://rajeduboard.rajasthan.gov.in', domain: 'rajeduboard.rajasthan.gov.in', sourceType: 'PRIMARY', tier: 1, accessedAt: '', relevance: '', claimsSupported: [] }
        ],
        conflicts: [],
      }
    );

    expect(report.hasHardBlocks).toBe(false);
    expect(report.passed).toBe(true);
    expect(report.score).toBeGreaterThanOrEqual(80);
  });
});
