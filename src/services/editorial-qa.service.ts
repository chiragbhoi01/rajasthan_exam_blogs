import { EditorialQAReport, QACheckResult } from '../types/qa.js';
import { BlogDocument } from '../types/blog.js';
import { BlogResearchDocument } from '../types/research.js';
import { countWords, estimateReadingTime } from '../utils/text-cleaner.js';
import { logger } from '../lib/logger.js';

export class EditorialQAService {
  runQA(
    blog: Partial<BlogDocument>,
    research?: Partial<BlogResearchDocument>
  ): EditorialQAReport {
    logger.info(`Running Editorial QA Gate for "${blog.title}"...`);

    const checks: QACheckResult[] = [];
    const hardBlocks: QACheckResult[] = [];
    const warnings: QACheckResult[] = [];

    const content = blog.content || '';
    const wordCount = countWords(content);
    const readingTime = estimateReadingTime(content);

    // 1. HARD BLOCK: Empty Article
    if (!content || wordCount < 200) {
      const check: QACheckResult = {
        code: 'BLOCK_EMPTY_CONTENT',
        name: 'Minimum Content Length Check',
        passed: false,
        severity: 'BLOCK',
        message: `Article content is too short or empty (${wordCount} words). Minimum 200 required.`,
      };
      checks.push(check);
      hardBlocks.push(check);
    } else {
      checks.push({
        code: 'PASS_CONTENT_LENGTH',
        name: 'Minimum Content Length Check',
        passed: true,
        severity: 'BLOCK',
        message: `Article contains sufficient length (${wordCount} words).`,
      });
    }

    // 2. HARD BLOCK: Meaningful Title & Slug
    if (!blog.title || blog.title.trim().length < 5) {
      const check: QACheckResult = {
        code: 'BLOCK_INVALID_TITLE',
        name: 'Title Validation',
        passed: false,
        severity: 'BLOCK',
        message: 'Blog title is missing or less than 5 characters.',
      };
      checks.push(check);
      hardBlocks.push(check);
    } else {
      checks.push({
        code: 'PASS_TITLE',
        name: 'Title Validation',
        passed: true,
        severity: 'BLOCK',
        message: `Valid title: "${blog.title}"`,
      });
    }

    if (!blog.slug || blog.slug.trim().length < 3) {
      const check: QACheckResult = {
        code: 'BLOCK_INVALID_SLUG',
        name: 'Slug Validation',
        passed: false,
        severity: 'BLOCK',
        message: 'Blog slug is missing or malformed.',
      };
      checks.push(check);
      hardBlocks.push(check);
    } else {
      checks.push({
        code: 'PASS_SLUG',
        name: 'Slug Validation',
        passed: true,
        severity: 'BLOCK',
        message: `Valid slug: "${blog.slug}"`,
      });
    }

    // 3. HARD BLOCK: Heading Structure (H1 Check)
    const hasH1 = /<h1[^>]*>.*?<\/h1>/i.test(content) || /^#\s+.+/m.test(content);
    if (!hasH1) {
      const check: QACheckResult = {
        code: 'BLOCK_MISSING_H1',
        name: 'H1 Heading Hierarchy',
        passed: false,
        severity: 'BLOCK',
        message: 'Article is missing an H1 main heading.',
      };
      checks.push(check);
      hardBlocks.push(check);
    } else {
      checks.push({
        code: 'PASS_H1',
        name: 'H1 Heading Hierarchy',
        passed: true,
        severity: 'BLOCK',
        message: 'Article contains valid H1 heading.',
      });
    }

    // 4. HARD BLOCK: Dangerous / Malformed HTML
    const dangerousScript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(content);
    if (dangerousScript) {
      const check: QACheckResult = {
        code: 'BLOCK_DANGEROUS_HTML',
        name: 'Dangerous Script Detection',
        passed: false,
        severity: 'BLOCK',
        message: 'Article contains unauthorized script tags.',
      };
      checks.push(check);
      hardBlocks.push(check);
    }

    // 5. HARD BLOCK: Unresolved Major Source Conflicts
    const unresolvedConflicts = research?.conflicts?.length || 0;
    if (unresolvedConflicts > 0) {
      const check: QACheckResult = {
        code: 'BLOCK_SOURCE_CONFLICT',
        name: 'Factual Source Conflict Check',
        passed: false,
        severity: 'BLOCK',
        message: `${unresolvedConflicts} unresolved factual conflicts detected in research trail.`,
      };
      checks.push(check);
      hardBlocks.push(check);
    } else {
      checks.push({
        code: 'PASS_NO_CONFLICTS',
        name: 'Factual Source Conflict Check',
        passed: true,
        severity: 'BLOCK',
        message: 'Zero unresolved source conflicts.',
      });
    }

    // 6. WARNING: Meta Description Length
    const metaDescLength = blog.metaDescription?.length || 0;
    if (metaDescLength < 60 || metaDescLength > 180) {
      const warn: QACheckResult = {
        code: 'WARN_META_DESC_LENGTH',
        name: 'Meta Description Length',
        passed: false,
        severity: 'WARNING',
        message: `Meta description length (${metaDescLength} chars) outside optimal range (60-180 chars).`,
      };
      checks.push(warn);
      warnings.push(warn);
    } else {
      checks.push({
        code: 'PASS_META_DESC',
        name: 'Meta Description Length',
        passed: true,
        severity: 'WARNING',
        message: 'Meta description length is optimal.',
      });
    }

    // 7. WARNING: Sources Count
    const sourcesCount = research?.sources?.length || 0;
    if (sourcesCount < 2) {
      const warn: QACheckResult = {
        code: 'WARN_LIMITED_SOURCES',
        name: 'Research Sources Depth',
        passed: false,
        severity: 'WARNING',
        message: `Only ${sourcesCount} research sources attached. Recommended at least 2.`,
      };
      checks.push(warn);
      warnings.push(warn);
    } else {
      checks.push({
        code: 'PASS_SOURCES_COUNT',
        name: 'Research Sources Depth',
        passed: true,
        severity: 'WARNING',
        message: `${sourcesCount} verified sources attached.`,
      });
    }

    // Metrics collection
    const h1Matches = content.match(/<h1[^>]*>/gi) || [];
    const h2Matches = content.match(/<h2[^>]*>/gi) || [];
    const h3Matches = content.match(/<h3[^>]*>/gi) || [];
    const faqMatches = blog.faqs?.length || 0;
    const mcqMatches = blog.mcqs?.length || 0;
    const internalLinksCount = research?.seoBrief?.internalLinks?.length || 0;

    const hasHardBlocks = hardBlocks.length > 0;
    let score = 100;
    score -= hardBlocks.length * 40;
    score -= warnings.length * 10;
    score = Math.max(0, Math.min(100, score));

    const qaPassed = !hasHardBlocks && score >= 60;

    logger.info(`QA Result: ${qaPassed ? 'PASSED' : 'BLOCKED'} (Score: ${score}/100, HardBlocks: ${hardBlocks.length}, Warnings: ${warnings.length})`);

    return {
      passed: qaPassed,
      hasHardBlocks,
      score,
      checks,
      hardBlocks,
      warnings,
      metrics: {
        wordCount,
        readingTime,
        h1Count: h1Matches.length,
        h2Count: h2Matches.length,
        h3Count: h3Matches.length,
        faqCount: faqMatches,
        mcqCount: mcqMatches,
        sourcesCount,
        internalLinksCount,
        unsupportedClaimsCount: research?.uncertainClaims?.length || 0,
        unresolvedConflictsCount: unresolvedConflicts,
        fluffCount: 0,
      },
    };
  }
}
