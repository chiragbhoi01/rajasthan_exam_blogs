import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/rajasthan_exam_twister',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'rajasthan_exam_twister',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || 'rajasthan_exam_twister/blogs',

  // Automation
  BLOG_AUTOMATION_ENABLED: process.env.BLOG_AUTOMATION_ENABLED !== 'false',
  BLOG_AUTOMATION_DRY_RUN: process.env.BLOG_AUTOMATION_DRY_RUN === 'true',
  BLOG_AUTOMATION_SCHEDULE_ENABLED: process.env.BLOG_AUTOMATION_SCHEDULE_ENABLED === 'true',
  BLOG_MAX_RESEARCH_SOURCES: parseInt(process.env.BLOG_MAX_RESEARCH_SOURCES || '8', 10),
  BLOG_MAX_ARTICLE_WORDS: parseInt(process.env.BLOG_MAX_ARTICLE_WORDS || '3000', 10),
  DEFAULT_AUTHOR_NAME: process.env.DEFAULT_AUTHOR_NAME || 'Rajasthan Exam Twister Editorial Team',

  // Site
  SITE_BASE_URL: process.env.SITE_BASE_URL || 'https://rajasthanexamtwister.in',
};
