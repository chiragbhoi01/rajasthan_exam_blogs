import { ObjectId } from 'mongodb';

export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type ArticleType = 
  | 'CURRENT_AFFAIRS' 
  | 'RAJASTHAN_GK' 
  | 'EXAM_UPDATE' 
  | 'STATIC_GK' 
  | 'STUDY_GUIDE';

export interface MCQOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface MCQItem {
  question: string;
  options: MCQOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  sourceOrVerification: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogDocument {
  _id?: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Rich HTML
  coverImageId?: string | null;
  coverImageUrl?: string | null;
  coverImageAlt?: string;
  categoryId?: ObjectId | string | null;
  tagIds?: (ObjectId | string)[];
  status: BlogStatus;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  readingTime: number; // in minutes
  featured: boolean;
  author: string;
  articleType?: ArticleType;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  faqs?: FAQItem[];
  mcqs?: MCQItem[];
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
