import { describe, it, expect } from 'vitest';
import { AeoEngineService } from '../src/services/aeo-engine.service.js';
import { FactClaim } from '../src/types/research.js';

describe('AeoEngineService', () => {
  const aeoEngine = new AeoEngineService();

  it('should generate structured direct answers, questions, and named entities', () => {
    const claims: FactClaim[] = [
      {
        claim: 'घूमर राजस्थान का राज्य नृत्य है।',
        category: 'OTHER',
        status: 'VERIFIED',
      },
    ];

    const aeo = aeoEngine.generateAeoBlock('राजस्थान के प्रमुख लोक नृत्य', 'RAJASTHAN_GK', claims);

    expect(aeo.directAnswer).toBeDefined();
    expect(aeo.directAnswer.length).toBeGreaterThan(20);
    expect(aeo.questions.length).toBeGreaterThanOrEqual(2);
    expect(aeo.entities.length).toBeGreaterThanOrEqual(2);
    expect(aeo.keyFacts.length).toBeGreaterThanOrEqual(1);
    expect(aeo.entities).toContain('घूमर नृत्य');
  });
});
