export interface QACheckResult {
  code: string;
  name: string;
  passed: boolean;
  severity: 'BLOCK' | 'WARNING';
  message: string;
  details?: any;
}

export interface EditorialQAReport {
  passed: boolean;
  hasHardBlocks: boolean;
  score: number; // 0 - 100
  checks: QACheckResult[];
  hardBlocks: QACheckResult[];
  warnings: QACheckResult[];
  metrics: {
    wordCount: number;
    readingTime: number;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    faqCount: number;
    mcqCount: number;
    sourcesCount: number;
    internalLinksCount: number;
    unsupportedClaimsCount: number;
    unresolvedConflictsCount: number;
    fluffCount: number;
  };
}
