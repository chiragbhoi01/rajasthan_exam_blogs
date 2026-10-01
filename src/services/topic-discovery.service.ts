import { TopicCandidate } from '../types/research.js';
import { ContentClassification } from '../types/content-package.js';
import { TopicScorerService } from './topic-scorer.service.js';
import { BlogRepository } from '../repositories/blog.repository.js';
import { slugify } from '../utils/slugify.js';
import { logger } from '../lib/logger.js';

export interface RawCandidateDefinition {
  topic: string;
  categorySuggestion: string;
  targetExam: string[];
  articleType: 'CURRENT_AFFAIRS' | 'RAJASTHAN_GK' | 'EXAM_UPDATE' | 'STATIC_GK' | 'STUDY_GUIDE';
  isOfficialNotification?: boolean;
  primarySourceAvailable?: boolean;
}

export class TopicDiscoveryService {
  private scorer: TopicScorerService;

  constructor(private blogRepo?: BlogRepository) {
    this.scorer = new TopicScorerService(blogRepo);
  }

  // 25+ Comprehensive Rajasthan Competitive Exams Topics Pool
  private static CURATED_CANDIDATES_POOL: RawCandidateDefinition[] = [
    // 1. Rajasthan GK (History, Art & Culture)
    {
      topic: 'राजस्थान के प्रमुख लोक नृत्य: घूमर, कालबेलिया, तेरहताली एवं अग्नि नृत्य',
      categorySuggestion: 'Rajasthan Art & Culture',
      targetExam: ['RAS', 'CET', 'REET', 'Rajasthan Police', 'Patwari'],
      articleType: 'RAJASTHAN_GK',
      primarySourceAvailable: true,
    },
    {
      topic: '1857 की क्रांति में राजस्थान का योगदान: नसीराबाद, नीमच, एरिनपुरा एवं कोटा का विद्रोह',
      categorySuggestion: 'Rajasthan History',
      targetExam: ['RAS', 'REET', 'CET', 'School Lecturer'],
      articleType: 'RAJASTHAN_GK',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान के प्रमुख प्रजामंडल आंदोलन: जयपुर, मेवाड़, मारवाड़ व बीकानेर प्रजामंडल की भूमिका',
      categorySuggestion: 'Rajasthan History',
      targetExam: ['RAS', 'CET', 'REET', 'Patwari'],
      articleType: 'RAJASTHAN_GK',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान के प्रमुख लोक देवता: पाबूजी, रामदेवजी, गोगाजी, तेजाजी व हड़बूजी के प्रामाणिक तथ्य',
      categorySuggestion: 'Rajasthan Art & Culture',
      targetExam: ['RAS', 'CET', 'REET', 'Rajasthan Police'],
      articleType: 'RAJASTHAN_GK',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान की प्रमुख चित्रकला शैलियां: मेवाड़, मारवाड़, ढूंढाड़ एवं हाड़ौती स्कूल की विशेषताएं',
      categorySuggestion: 'Rajasthan Art & Culture',
      targetExam: ['RAS', '1st Grade Teacher', 'CET'],
      articleType: 'RAJASTHAN_GK',
      primarySourceAvailable: true,
    },

    // 2. Current Affairs & Government Schemes
    {
      topic: 'राजस्थान की प्रमुख कल्याणकारी सरकारी योजनाएं 2026: पात्रता, लाभ एवं परीक्षा उपयोगी तथ्य',
      categorySuggestion: 'Rajasthan Current Affairs',
      targetExam: ['RAS Prelims', 'CET', 'VDO', 'Patwari'],
      articleType: 'CURRENT_AFFAIRS',
      isOfficialNotification: true,
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान बजट 2026-27: प्रमुख आर्थिक घोषणाएं, नई नीतियां व परीक्षा महत्वपूर्ण प्रश्नोत्तर',
      categorySuggestion: 'Rajasthan Current Affairs',
      targetExam: ['RAS', 'CET', 'Junior Accountant'],
      articleType: 'CURRENT_AFFAIRS',
      isOfficialNotification: true,
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान आर्थिक समीक्षा 2025-26: कृषि, उद्योग, सेवा क्षेत्र के महत्वपूर्ण सांख्यिकीय आंकड़े',
      categorySuggestion: 'Rajasthan Economy',
      targetExam: ['RAS', 'CET', 'Statistical Officer'],
      articleType: 'CURRENT_AFFAIRS',
      isOfficialNotification: true,
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान समसामयिकी 2026: प्रमुख नियुक्तियां, पुरस्कार, खेल परिदृश्य एवं चर्चित व्यक्तित्व',
      categorySuggestion: 'Rajasthan Current Affairs',
      targetExam: ['RAS Prelims', 'CET', 'Police Constable', 'REET'],
      articleType: 'CURRENT_AFFAIRS',
      isOfficialNotification: true,
      primarySourceAvailable: true,
    },

    // 3. Exam Updates & Patterns
    {
      topic: 'Rajasthan CET 2026: स्नातक एवं सीनियर सेकेंडरी स्तर सिलेबस, एग्जाम पैटर्न व तैयारी रणनीति',
      categorySuggestion: 'Rajasthan CET',
      targetExam: ['CET Graduate', 'CET 12th Level'],
      articleType: 'EXAM_UPDATE',
      isOfficialNotification: true,
      primarySourceAvailable: true,
    },
    {
      topic: 'REET 2026 पात्रता एवं मुख्य शिक्षक भर्ती: लेवल 1 व लेवल 2 विस्तृत सिलेबस व चयन प्रक्रिया',
      categorySuggestion: 'REET',
      targetExam: ['REET Level 1', 'REET Level 2', '3rd Grade Teacher'],
      articleType: 'EXAM_UPDATE',
      isOfficialNotification: true,
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान पुलिस कांस्टेबल भर्ती 2026: शारीरिक दक्षता (PET), लिखित परीक्षा पैटर्न व संपूर्ण गाइड',
      categorySuggestion: 'Rajasthan Police',
      targetExam: ['Rajasthan Police Constable'],
      articleType: 'EXAM_UPDATE',
      isOfficialNotification: true,
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान पटवारी एवं ग्राम विकास अधिकारी (VDO) भर्ती: योग्यता, परीक्षा योजना व पाठ्यक्रम',
      categorySuggestion: 'RSSB / RSMSSB',
      targetExam: ['Patwari', 'VDO'],
      articleType: 'EXAM_UPDATE',
      isOfficialNotification: true,
      primarySourceAvailable: true,
    },

    // 4. Static GK & Geography
    {
      topic: 'राजस्थान के 50 जिले एवं संभाग व्यवस्था: नवीनतम भौगोलिक एवं प्रशासनिक संरचना',
      categorySuggestion: 'Rajasthan Geography',
      targetExam: ['RAS', 'CET', 'REET', '1st Grade Teacher', '2nd Grade Teacher'],
      articleType: 'STATIC_GK',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान के प्रमुख दुर्ग एवं किले: मेहरानगढ़, कुंभलगढ़, चित्तौड़गढ़ और आमेर दुर्ग की स्थापत्य कला',
      categorySuggestion: 'Rajasthan Art & Culture',
      targetExam: ['RAS', 'REET', 'CET', 'Patwari'],
      articleType: 'STATIC_GK',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान की नदियां एवं अपवाह तंत्र: अरब सागर व बंगाल की खाड़ी की नदियां',
      categorySuggestion: 'Rajasthan Geography',
      targetExam: ['RAS', 'CET', 'Rajasthan Police', 'Lab Assistant'],
      articleType: 'STATIC_GK',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान की प्रमुख झीलें एवं जल संरक्षण: खारे पानी व मीठे पानी की झीलों का तुलनात्मक अध्ययन',
      categorySuggestion: 'Rajasthan Geography',
      targetExam: ['RAS', 'CET', 'REET', 'Patwari'],
      articleType: 'STATIC_GK',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान के प्रमुख खनिज संसाधन: धात्विक व अधात्विक खनिजों के प्रमुख खनन क्षेत्र व एकाधिकार',
      categorySuggestion: 'Rajasthan Geography',
      targetExam: ['RAS', 'CET', 'College Lecturer'],
      articleType: 'STATIC_GK',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान के प्रमुख मेले एवं त्योहार: माहवार कैलेंडर, आयोजन स्थल व सांस्कृतिक महत्व',
      categorySuggestion: 'Rajasthan Art & Culture',
      targetExam: ['RAS', 'CET', 'REET', 'Police Constable'],
      articleType: 'STATIC_GK',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान की जनजातियां: भील, मीणा, गरासिया, सहरिया व डामोर की सामाजिक संरचना व प्रथाएं',
      categorySuggestion: 'Rajasthan Art & Culture',
      targetExam: ['RAS', 'REET', 'CET'],
      articleType: 'STATIC_GK',
      primarySourceAvailable: true,
    },

    // 5. Study Guides & Preparation Strategy
    {
      topic: 'RPSC RAS 2026 प्रारंभिक एवं मुख्य परीक्षा: सम्पूर्ण पाठ्यक्रम, बुकलिस्ट व रिवीजन रणनीति',
      categorySuggestion: 'RPSC',
      targetExam: ['RPSC RAS'],
      articleType: 'STUDY_GUIDE',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान प्रतियोगी परीक्षाओं में राजस्थान जीके की सटीक तैयारी: 90 दिनों की एक्शन प्लान रणनीति',
      categorySuggestion: 'Rajasthan GK',
      targetExam: ['All Rajasthan Exams'],
      articleType: 'STUDY_GUIDE',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान 1st ग्रेड व 2nd ग्रेड शिक्षक भर्ती (GK पेपर 1): टॉपिकवार वेटेज व सफलता के मूलमंत्र',
      categorySuggestion: 'RPSC',
      targetExam: ['1st Grade Teacher', '2nd Grade Teacher'],
      articleType: 'STUDY_GUIDE',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान कला एवं संस्कृति: विगत 10 वर्षों के आरपीएससी व आरएसएसबी प्रश्नों का विस्तृत विश्लेषण',
      categorySuggestion: 'Rajasthan Art & Culture',
      targetExam: ['RAS', 'CET', 'REET', 'Patwari'],
      articleType: 'STUDY_GUIDE',
      primarySourceAvailable: true,
    },
    {
      topic: 'राजस्थान राजव्यवस्था (Polity): राज्यपाल, मुख्यमंत्री, विधानसभा व राज्य मानवाधिकार आयोग गाइड',
      categorySuggestion: 'Rajasthan Polity',
      targetExam: ['RAS', 'CET', 'SI'],
      articleType: 'STUDY_GUIDE',
      primarySourceAvailable: true,
    }
  ];

  classifyTopic(topic: string, existingSlugsOrTitles: string[]): ContentClassification {
    const cleanSlug = slugify(topic);
    const topicLower = topic.toLowerCase();

    for (const existing of existingSlugsOrTitles) {
      const existingLower = existing.toLowerCase();
      const existingSlug = slugify(existing);

      if (cleanSlug === existingSlug || topicLower === existingLower) {
        return 'SKIP'; // Exact duplicate
      }
      if (topicLower.includes(existingLower) || existingLower.includes(topicLower)) {
        return 'CREATE_NEW_ANGLE';
      }
    }

    return 'CREATE_NEW';
  }

  async discoverTrendingTopics(options?: {
    count?: number;
    typeFilter?: string;
    existingTitles?: string[];
  }): Promise<TopicCandidate[]> {
    logger.info('Starting Autonomous Topic Discovery across official Rajasthan Exam syllabi and portals...');

    const existing = options?.existingTitles || [];
    let candidates = TopicDiscoveryService.CURATED_CANDIDATES_POOL;

    if (options?.typeFilter) {
      candidates = candidates.filter((c) => c.articleType === options.typeFilter);
    }

    const scoredCandidates: TopicCandidate[] = [];

    for (const item of candidates) {
      const classification = this.classifyTopic(item.topic, existing);
      if (classification === 'SKIP') {
        continue;
      }

      const scored = await this.scorer.scoreTopic(item);
      scoredCandidates.push(scored);
    }

    // Sort by total score descending
    scoredCandidates.sort((a, b) => b.score - a.score);

    const limit = options?.count || scoredCandidates.length;
    const result = scoredCandidates.slice(0, limit);

    logger.info(`Discovered and scored ${result.length} high-utility exam topics`);
    return result;
  }
}
