import { ObjectId } from 'mongodb';

export interface CategoryDocument {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagDocument {
  _id?: ObjectId;
  name: string;
  slug: string;
  dimension?: 'TOPIC' | 'EXAM' | 'SUBJECT' | 'YEAR' | 'CONTENT_TYPE';
  count?: number;
  createdAt: Date;
  updatedAt: Date;
}
