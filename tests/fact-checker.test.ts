import { describe, it, expect } from 'vitest';
import { FactCheckerService } from '../src/services/fact-checker.service.js';
import { FactClaim, ResearchSource } from '../src/types/research.js';

describe('FactCheckerService', () => {
  const factChecker = new FactCheckerService();

  const mockSources: ResearchSource[] = [
    {
      title: 'RSSB Official Portal',
      url: 'https://rsmssb.rajasthan.gov.in',
      domain: 'rsmssb.rajasthan.gov.in',
      sourceType: 'OFFICIAL',
      tier: 1,
      accessedAt: new Date().toISOString(),
      relevance: 'Official examination notification',
      claimsSupported: ['Exam date', 'Eligibility'],
    },
  ];

  it('should verify claims backed by official primary sources', () => {
    const claims: FactClaim[] = [
      {
        claim: 'घूमर राजस्थान का राज्य नृत्य है।',
        category: 'OTHER',
        status: 'VERIFIED',
        primarySourceUrl: 'https://hte.rajasthan.gov.in',
      },
    ];

    const result = factChecker.verifyClaims(claims, mockSources);
    expect(result.verifiedClaims.length).toBe(1);
    expect(result.uncertainClaims.length).toBe(0);
    expect(result.conflicts.length).toBe(0);
    expect(result.overallFactualConfidence).toBe(100);
  });

  it('should catch conflicting factual claims and record conflict', () => {
    const claims: FactClaim[] = [
      {
        claim: 'विवादित तथ्य: कुल पदों की संख्या में विसंगति।',
        category: 'VACANCY',
        status: 'CONFLICTING',
        conflictingDetails: 'Source A says 500, Source B says 700',
      },
    ];

    const result = factChecker.verifyClaims(claims, mockSources);
    expect(result.conflicts.length).toBe(1);
    expect(result.overallFactualConfidence).toBeLessThan(100);
  });
});
