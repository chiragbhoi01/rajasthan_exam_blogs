import dotenv from 'dotenv';

dotenv.config();

function getCloudinaryCredentials() {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
  let apiKey = process.env.CLOUDINARY_API_KEY || '';
  let apiSecret = process.env.CLOUDINARY_API_SECRET || '';

  if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
    try {
      // Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
      const match = process.env.CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
      if (match) {
        apiKey = apiKey || match[1];
        apiSecret = apiSecret || match[2];
        cloudName = cloudName || match[3];
      }
    } catch {
      // ignore
    }
  }

  return { cloudName, apiKey, apiSecret };
}

const cloudinaryCreds = getCloudinaryCredentials();

export const ENV = {
  // Database Configuration (Existing CMS MongoDB)
  MONGODB_URI: process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/rajasthan_exam_twister',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'rajasthan_exam_twister',

  // Cloudinary Media Configuration
  CLOUDINARY_CLOUD_NAME: cloudinaryCreds.cloudName,
  CLOUDINARY_API_KEY: cloudinaryCreds.apiKey,
  CLOUDINARY_API_SECRET: cloudinaryCreds.apiSecret,
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || 'rajasthan_exam_twister/blogs',

  // Automation Safety & Cost Controls
  BLOG_AUTOMATION_ENABLED: process.env.BLOG_AUTOMATION_ENABLED !== 'false',
  BLOG_AUTOMATION_DRY_RUN: process.env.BLOG_AUTOMATION_DRY_RUN === 'true',
  BLOG_AUTOMATION_SCHEDULE_ENABLED: process.env.BLOG_AUTOMATION_SCHEDULE_ENABLED === 'true',
  BLOG_MAX_RESEARCH_SOURCES: parseInt(process.env.BLOG_MAX_RESEARCH_SOURCES || '8', 10),
  BLOG_MAX_ARTICLE_WORDS: parseInt(process.env.BLOG_MAX_ARTICLE_WORDS || '3000', 10),
  DEFAULT_AUTHOR_NAME: process.env.DEFAULT_AUTHOR_NAME || 'Rajasthan Exam Twister Editorial Team',

  // Site URL for SEO and Internal Linking
  SITE_BASE_URL: process.env.SITE_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://rajasthanexamtwister.in',
};

