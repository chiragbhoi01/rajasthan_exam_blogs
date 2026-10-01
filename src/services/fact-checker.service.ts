import { FactClaim, ClaimVerificationStatus, ResearchSource } from '../types/research.js';
import { logger } from '../lib/logger.js';

export class FactCheckerService {
  verifyClaims(
    extractedClaims: FactClaim[],
    sources: ResearchSource[]
  ): {
    verifiedClaims: FactClaim[];
    uncertainClaims: FactClaim[];
    conflicts: FactClaim[];
    allClaims: FactClaim[];
    overallFactualConfidence: number; // 0-100
  } {
    logger.info(`Running Fact Verification across ${extractedClaims.length} claims and ${sources.length} sources...`);

    const verifiedClaims: FactClaim[] = [];
    const uncertainClaims: FactClaim[] = [];
    const conflicts: FactClaim[] = [];
    const allClaims: FactClaim[] = [];

    const officialSourcesCount = sources.filter((s) => s.tier === 1).length;

    for (const claim of extractedClaims) {
      // Check if claim is supported by a Tier 1 or verified reference
      if (claim.status === 'CONFLICTING') {
        conflicts.push(claim);
        allClaims.push(claim);
      } else if (claim.status === 'UNCERTAIN' || (!claim.primarySourceUrl && officialSourcesCount === 0)) {
        const uncertainClaim: FactClaim = {
          ...claim,
          status: 'UNCERTAIN',
          notes: 'Source verification incomplete or pending official gazette confirmation',
        };
        uncertainClaims.push(uncertainClaim);
        allClaims.push(uncertainClaim);
      } else {
        const verifiedClaim: FactClaim = {
          ...claim,
          status: claim.status || 'VERIFIED',
        };
        verifiedClaims.push(verifiedClaim);
        allClaims.push(verifiedClaim);
      }
    }

    // Calculate factual confidence
    const total = extractedClaims.length;
    let score = 100;
    if (total > 0) {
      const penalty = (uncertainClaims.length * 15) + (conflicts.length * 30);
      score = Math.max(20, 100 - penalty);
    }

    logger.info(`Fact Verification summary: ${verifiedClaims.length} VERIFIED, ${uncertainClaims.length} UNCERTAIN, ${conflicts.length} CONFLICTS. Factual Confidence: ${score}%`);

    return {
      verifiedClaims,
      uncertainClaims,
      conflicts,
      allClaims,
      overallFactualConfidence: score,
    };
  }
}
