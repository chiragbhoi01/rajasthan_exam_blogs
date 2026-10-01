import { ResearchSource, FactClaim, InternalLinkItem } from './research.js';
import { MCQItem, FAQItem } from './blog.js';
import { QACheckResult } from './qa.js';

export type ContentClassification = 'CREATE_NEW' | 'UPDATE_EXISTING' | 'CREATE_NEW_ANGLE' | 'SKIP';
export type QAStatus = 'PASS' | 'WARNING' | 'HOLD' | 'FAIL';

export interface AeoBlock {
  directAnswer: string;
  questions: string[];
  entities: string[];
  keyFacts: string[];
}

export interface ContentPackageV1 {
  version: '1.0';
  id?: string;
  topic: string;
  articleType: string;
  classification: ContentClassification;
  
  article: {
    title: string;
    slug: string;
    excerpt: string;
    content: string; // Sanitized HTML
    wordCount: number;
    readingTime: number;
    categorySuggestion: string;
    tags: string[];
  };

  seo: {
    title: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    searchIntent: string;
    canonicalPath: string; // e.g. "/blogs/rajasthan-ke-lok-nritya"
  };

  aeo: AeoBlock;

  faq: FAQItem[];

  mcqs: MCQItem[];

  sources: ResearchSource[];

  internalLinks: InternalLinkItem[];

  image: {
    prompt: string;
    altText: string;
    width: number;
    height: number;
    visualConcept: string;
  };

  research: {
    verifiedClaims: FactClaim[];
    uncertainClaims: FactClaim[];
    conflictingClaims: FactClaim[];
    overallFactualConfidence: number;
  };

  qa: {
    status: QAStatus;
    score: number;
    passed: boolean;
    hardBlocks: string[];
    warnings: string[];
  };

  timestamps: {
    generatedAt: string;
    lastVerifiedAt: string;
    requiresRecheck: boolean;
    eventDate?: string;
  };
}

export interface BatchManifestArticleEntry {
  index: number;
  filename: string;
  topic: string;
  articleType: string;
  slug: string;
  qaStatus: QAStatus;
  qaScore: number;
  sourceCount: number;
  mcqCount: number;
  faqCount: number;
  wordCount: number;
  classification: ContentClassification;
}

export interface BatchManifest {
  batchId: string;
  version: '1.0';
  createdAt: string;
  totalCount: number;
  summary: {
    pass: number;
    warning: number;
    hold: number;
    fail: number;
  };
  typeDistribution: Record<string, number>;
  articles: BatchManifestArticleEntry[];
}
