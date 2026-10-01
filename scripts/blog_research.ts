import { ResearchEngineService } from '../src/services/research-engine.service.js';
import { FactCheckerService } from '../src/services/fact-checker.service.js';

function parseTopic(): string {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--topic' && args[i + 1]) {
      return args[i + 1];
    }
  }
  return 'राजस्थान के लोक नृत्य';
}

async function main() {
  const topic = parseTopic();
  const researchEngine = new ResearchEngineService();
  const factChecker = new FactCheckerService();

  console.log(`\n================ EXAM RESEARCH SESSION: "${topic}" ================`);
  const research = await researchEngine.conductResearch(topic, 'RAJASTHAN_GK');
  const factReport = factChecker.verifyClaims(research.extractedClaims, research.sources);

  console.log(`\n[1] SOURCES DISCOVERED & PRIORITIZED (${research.sources.length}):`);
  research.sources.forEach((s, idx) => {
    console.log(`  (${idx + 1}) [Tier ${s.tier} - ${s.sourceType}] ${s.title}`);
    console.log(`      URL: ${s.url}`);
    console.log(`      Relevance: ${s.relevance}`);
  });

  console.log(`\n[2] VERIFIED FACTUAL CLAIMS (${factReport.verifiedClaims.length}):`);
  factReport.verifiedClaims.forEach((c, idx) => {
    console.log(`  [${c.status}] ${c.claim}`);
    if (c.primarySourceUrl) console.log(`      Source: ${c.primarySourceUrl}`);
  });

  if (factReport.conflicts.length > 0) {
    console.log(`\n[3] FACTUAL CONFLICTS (${factReport.conflicts.length}):`);
    factReport.conflicts.forEach((c) => {
      console.log(`  [CONFLICT] ${c.claim}`);
    });
  }

  console.log(`\n[4] OVERALL FACTUAL CONFIDENCE: ${factReport.overallFactualConfidence}%`);
  console.log('====================================================================\n');
}

main();
