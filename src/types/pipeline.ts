import { BlogDocument } from './blog.js';
import { BlogResearchDocument } from './research.js';
import { EditorialQAReport } from './qa.js';
import { FeaturedImageResult } from './image.js';
import { ContentPackageV1, AeoBlock, ContentClassification } from './content-package.js';

export type PipelineStage = 
  | 'INITIALIZING'
  | 'DISCOVERING'
  | 'RESEARCHING'
  | 'FACT_CHECKING'
  | 'BRIEFING'
  | 'AEO'
  | 'WRITING'
  | 'TAXONOMY'
  | 'EDITORIAL_QA'
  | 'IMAGE_GENERATION'
  | 'PACKAGING'
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
  classification?: ContentClassification;
}

export interface PipelineExecutionResult {
  success: boolean;
  stage: PipelineStage;
  topic: string;
  blogDraft?: BlogDocument;
  research?: BlogResearchDocument;
  qaReport?: EditorialQAReport;
  imageResult?: FeaturedImageResult;
  aeoBlock?: AeoBlock;
  contentPackage?: ContentPackageV1;
  errors?: string[];
  warnings?: string[];
  dryRun: boolean;
  durationMs: number;
}
