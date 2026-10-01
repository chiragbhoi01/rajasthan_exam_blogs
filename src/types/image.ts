export interface FeaturedImagePrompt {
  visualConcept: string;
  headline: string;
  subheading?: string;
  visualElements: string[];
  composition: string;
  colorPalette: string[];
  style: string;
  aspectRatio: '1200x630' | '16:9';
  altText: string;
}

export interface FeaturedImageResult {
  status: 'GENERATED' | 'UPLOADED' | 'IMAGE_PENDING' | 'FAILED';
  url?: string;
  publicId?: string;
  prompt: FeaturedImagePrompt;
  error?: string;
}
