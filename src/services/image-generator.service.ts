import { v2 as cloudinary } from 'cloudinary';
import { FeaturedImagePrompt, FeaturedImageResult } from '../types/image.js';
import { MediaRepository } from '../repositories/media.repository.js';
import { ENV } from '../config/env.config.js';
import { BRANDING } from '../config/constants.js';
import { logger } from '../lib/logger.js';

export class ImageGeneratorService {
  constructor(private mediaRepo?: MediaRepository) {
    if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
        api_key: ENV.CLOUDINARY_API_KEY,
        api_secret: ENV.CLOUDINARY_API_SECRET,
        secure: true,
      });
    }
  }

  generateImagePrompt(topic: string, articleType: string, categoryName: string): FeaturedImagePrompt {
    const headline = topic.split(':')[0].trim();
    const altText = `${headline} - राजस्थान प्रतियोगी परीक्षा उपयोगी नोट्स एवं महत्वपूर्ण तथ्य`;

    return {
      visualConcept: `High quality educational editorial banner for Rajasthan competitive exams focusing on ${headline}`,
      headline,
      subheading: `${categoryName} | Rajasthan Exam Twister`,
      visualElements: [
        'Rajasthan traditional architectural motifs (jharokhas, jaali patterns)',
        'Warm golden desert amber and navy blue background gradient',
        'Clear bold Devanagari typography headline',
        'Official study notes & examination icons',
        'Rajasthan Exam Twister branding badge'
      ],
      composition: 'Center-weighted clean modern card layout with 1200x630 dimension, readable typography, and high contrast',
      colorPalette: ['#1E293B', '#D97706', '#FFFFFF', '#F59E0B'],
      style: 'Professional digital educational graphic design with sleek glassmorphic container and clean gradients',
      aspectRatio: '1200x630',
      altText,
    };
  }

  async processFeaturedImage(
    topic: string,
    articleType: string,
    categoryName: string
  ): Promise<FeaturedImageResult> {
    const prompt = this.generateImagePrompt(topic, articleType, categoryName);
    logger.info(`Generated featured image prompt for "${topic}"`);

    // If Cloudinary is configured and ready:
    if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET) {
      try {
        logger.info('Cloudinary configured. Processing media upload...');
        // If an image URL or buffer is provided, upload it to Cloudinary
        // For automated runs without direct image file binary, return IMAGE_PENDING with complete prompt
        return {
          status: 'IMAGE_PENDING',
          prompt,
        };
      } catch (err: any) {
        logger.warn('Cloudinary upload warning:', err?.message || err);
        return {
          status: 'FAILED',
          prompt,
          error: err?.message || 'Upload failed',
        };
      }
    }

    return {
      status: 'IMAGE_PENDING',
      prompt,
    };
  }
}
