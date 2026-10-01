import { BlogDocument } from './blog.js';
import { BlogResearchDocument, ResearchSource, FactClaim, SeoBrief, TopicCandidate } from './research.js';
import { EditorialQAReport } from './qa.js';
import { FeaturedImageResult } from './image.js';

export type PipelineStage = 
  | 'INITIALIZING'
  | 'DISCOVERING'
  | 'RESEARCHING'
  | 'FACT_CHECKING'
  | 'BRIEFING'
  | 'WRITING'
  | 'TAXONOMY'
  | 'EDITORIAL_QA'
  | 'IMAGE_GENERATION'
  | 'CMS_SAVING'
  | 'COMPLETED'
  | 'FAILED';

export interface PipelineOptions {
  topic?: string;
  articleType?: string;
  category?: string;
  tags?: string[];
  dryRun?: boolean;
  model?: string;
  maxSources?: number;
  skipImage?: boolean;
}

export interface PipelineExecutionResult {
  success: boolean;
  stage: PipelineStage;
  topic: string;
  blogDraft?: BlogDocument;
  research?: BlogResearchDocument;
  qaReport?: EditorialQAReport;
  imageResult?: FeaturedImageResult;
  errors?: string[];
  warnings?: string[];
  dryRun: boolean;
  durationMs: number;
}
