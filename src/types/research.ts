import { ObjectId } from 'mongodb';

export type SourceType = 
  | 'OFFICIAL' 
  | 'GOVERNMENT' 
  | 'PRIMARY' 
  | 'NEWS' 
  | 'REFERENCE' 
  | 'OTHER';

export type ClaimVerificationStatus = 
  | 'VERIFIED' 
  | 'SUPPORTED' 
  | 'UNCERTAIN' 
  | 'CONFLICTING';

export interface ResearchSource {
  title: string;
  url: string;
  domain: string;
  sourceType: SourceType;
  tier: 1 | 2 | 3; // Tier 1 (Official), Tier 2 (Reputable), Tier 3 (General)
  accessedAt: string;
  relevance: string;
  claimsSupported: string[];
}

export interface FactClaim {
  claim: string;
  category: 'DATE' | 'NUMBER' | 'EXAM_RULE' | 'VACANCY' | 'SCHEME' | 'APPOINTMENT' | 'HISTORICAL' | 'GEOGRAPHY' | 'ELIGIBILITY' | 'SYLLABUS' | 'OTHER';
  status: ClaimVerificationStatus;
  primarySourceUrl?: string;
  notes?: string;
  conflictingDetails?: string;
}

export interface InternalLinkItem {
  title: string;
  url: string;
  slug: string;
  type: 'BLOG' | 'NOTE' | 'QUIZ' | 'EXAM' | 'SUBJECT';
  context: string;
}

export interface SeoBrief {
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: 'INFORMATIONAL' | 'NAVIGATIONAL' | 'TRANSACTIONAL' | 'EXAM_PREPARATION';
  targetAudience: string;
  recommendedWordCount: { min: number; max: number };
  suggestedSlug: string;
  metaTitle: string;
  metaDescription: string;
  suggestedHeadings: string[];
  internalLinks: InternalLinkItem[];
}

export interface TopicCandidate {
  topic: string;
  categorySuggestion: string;
  targetExam: string[];
  articleType: 'CURRENT_AFFAIRS' | 'RAJASTHAN_GK' | 'EXAM_UPDATE' | 'STATIC_GK' | 'STUDY_GUIDE';
  score: number; // 0-100
  scoringBreakdown: {
    rajasthanRelevance: number;
    examRelevance: number;
    searchIntent: number;
    studentUsefulness: number;
    freshness: number;
    evergreenValue: number;
    existingCoverageScore: number;
    sourceAvailability: number;
    factualConfidence: number;
  };
  selectionReason: string;
  searchVolume: number | 'UNKNOWN';
}

export interface BlogResearchDocument {
  _id?: ObjectId;
  blogId?: ObjectId | string;
  topic: string;
  articleType: string;
  researchDate: Date;
  sources: ResearchSource[];
  verifiedClaims: FactClaim[];
  uncertainClaims: FactClaim[];
  conflicts: FactClaim[];
  seoBrief: SeoBrief;
  generatedBy: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
}
