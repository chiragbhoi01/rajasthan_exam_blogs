import { SeoBrief, InternalLinkItem } from '../types/research.js';
import { slugify } from '../utils/slugify.js';
import { ENV } from '../config/env.config.js';

export class SeoEngineService {
  generateSeoMetadata(topic: string, articleType: string, customBrief?: Partial<SeoBrief>): SeoBrief {
    const cleanSlug = customBrief?.suggestedSlug || slugify(topic);
    const primaryKeyword = customBrief?.primaryKeyword || topic.split(':')[0].trim();
    
    const secondaryKeywords = customBrief?.secondaryKeywords || [
      'Rajasthan GK in Hindi',
      'Rajasthan Competitive Exams Notes',
      'RPSC RAS Preparation',
      'Rajasthan CET 2026',
      'Rajasthan Exam Twister Study Material',
    ];

    const metaTitle = customBrief?.metaTitle || `${primaryKeyword} - सम्पूर्ण अध्ययन सामग्री व परीक्षा प्रश्न | Rajasthan Exam Twister`;
    
    let metaDescription = customBrief?.metaDescription || `${primaryKeyword} के सम्पूर्ण प्रामाणिक तथ्य, सारणी, विगत परीक्षा प्रश्न एवं विस्तृत नोट्स। राजस्थान RPSC, RSSB, CET व REET परीक्षा की तैयारी हेतु विशेष सामग्री।`;
    
    // Ensure meta description is within 140-165 chars for optimal SEO
    if (metaDescription.length > 165) {
      metaDescription = metaDescription.substring(0, 162) + '...';
    }

    const internalLinks: InternalLinkItem[] = customBrief?.internalLinks || [
      {
        title: 'राजस्थान जीके ऑनलाइन टेस्ट सीरीज',
        url: `${ENV.SITE_BASE_URL}/quizzes/rajasthan-gk`,
        slug: 'rajasthan-gk-quiz',
        type: 'QUIZ',
        context: 'Interactive Mock Test',
      },
      {
        title: 'राजस्थान कला एवं संस्कृति सम्पूर्ण ई-नोट्स',
        url: `${ENV.SITE_BASE_URL}/notes/rajasthan-art-and-culture`,
        slug: 'rajasthan-art-culture-notes',
        type: 'NOTE',
        context: 'Study Notes',
      },
      {
        title: 'RPSC एवं RSSB विगत वर्षों के साल्व्ड पेपर्स',
        url: `${ENV.SITE_BASE_URL}/exams/solved-papers`,
        slug: 'solved-papers',
        type: 'EXAM',
        context: 'PYQ Question Bank',
      }
    ];

    return {
      primaryKeyword,
      secondaryKeywords,
      searchIntent: 'EXAM_PREPARATION',
      targetAudience: 'Rajasthan Competitive Exam Aspirants (RAS, CET, REET, Police, Patwari, VDO)',
      recommendedWordCount: { min: 1000, max: 2500 },
      suggestedSlug: cleanSlug,
      metaTitle,
      metaDescription,
      suggestedHeadings: [
        'प्रस्तावना एवं महत्वपूर्ण बिंदु',
        'विस्तृत विश्लेषण एवं सारणीबद्ध आंकड़े',
        'परीक्षा उपयोगी वन-लाइनर्स',
        'अभ्यास प्रश्न एवं विस्तृत व्याख्या',
        'त्वरित पुनरावृत्ति'
      ],
      internalLinks,
    };
  }
}
