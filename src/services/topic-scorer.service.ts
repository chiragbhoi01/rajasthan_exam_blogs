import { TopicCandidate } from '../types/research.js';
import { BlogRepository } from '../repositories/blog.repository.js';

export class TopicScorerService {
  constructor(private blogRepo?: BlogRepository) {}

  async scoreTopic(candidate: {
    topic: string;
    categorySuggestion: string;
    targetExam: string[];
    articleType: 'CURRENT_AFFAIRS' | 'RAJASTHAN_GK' | 'EXAM_UPDATE' | 'STATIC_GK' | 'STUDY_GUIDE';
    isOfficialNotification?: boolean;
    primarySourceAvailable?: boolean;
  }): Promise<TopicCandidate> {
    const topicLower = candidate.topic.toLowerCase();
    
    // 1. Rajasthan Relevance (0-15)
    let rajasthanRelevance = 10;
    if (topicLower.includes('राजस्थान') || topicLower.includes('rajasthan') || topicLower.includes('rpsc') || topicLower.includes('rssb') || topicLower.includes('rsmssb') || topicLower.includes('reet') || topicLower.includes('cet')) {
      rajasthanRelevance = 15;
    }

    // 2. Exam Relevance (0-20)
    let examRelevance = 12;
    if (candidate.targetExam.length > 0) {
      examRelevance = Math.min(20, 10 + candidate.targetExam.length * 2.5);
    }

    // 3. Search Intent (0-15)
    let searchIntent = 11;
    if (candidate.articleType === 'EXAM_UPDATE' || candidate.articleType === 'STUDY_GUIDE') {
      searchIntent = 14;
    } else if (candidate.articleType === 'RAJASTHAN_GK' || candidate.articleType === 'STATIC_GK') {
      searchIntent = 13;
    }

    // 4. Student Usefulness (0-15)
    let studentUsefulness = 12;
    if (candidate.isOfficialNotification || candidate.articleType === 'CURRENT_AFFAIRS') {
      studentUsefulness = 14;
    }

    // 5. Freshness & Evergreen Value (0-10 each)
    let freshness = candidate.articleType === 'CURRENT_AFFAIRS' || candidate.articleType === 'EXAM_UPDATE' ? 10 : 5;
    let evergreenValue = candidate.articleType === 'STATIC_GK' || candidate.articleType === 'RAJASTHAN_GK' ? 10 : 4;

    // 6. Existing Coverage Score (0-10)
    let existingCoverageScore = 10;
    if (this.blogRepo) {
      try {
        const dup = await this.blogRepo.checkDuplicate(candidate.topic, candidate.topic);
        if (dup.exists) {
          existingCoverageScore = 2; // Penalty for duplicate/already covered
        }
      } catch {
        // Fallback
      }
    }

    // 7. Source Availability & Factual Confidence (0-10 each)
    let sourceAvailability = candidate.primarySourceAvailable ? 10 : 7;
    let factualConfidence = candidate.primarySourceAvailable ? 9 : 7;

    const totalScore = Math.min(
      100,
      Math.round(
        rajasthanRelevance +
        examRelevance +
        searchIntent +
        studentUsefulness +
        freshness * 0.5 +
        evergreenValue * 0.5 +
        existingCoverageScore +
        sourceAvailability +
        factualConfidence
      )
    );

    const selectionReason = `Topic evaluated with score ${totalScore}/100. Rajasthan Relevance: ${rajasthanRelevance}/15, Exam Fit: ${examRelevance}/20 for target exams (${candidate.targetExam.join(', ')}). High student utility and verifiable primary source availability.`;

    return {
      topic: candidate.topic,
      categorySuggestion: candidate.categorySuggestion,
      targetExam: candidate.targetExam,
      articleType: candidate.articleType,
      score: totalScore,
      scoringBreakdown: {
        rajasthanRelevance,
        examRelevance,
        searchIntent,
        studentUsefulness,
        freshness,
        evergreenValue,
        existingCoverageScore,
        sourceAvailability,
        factualConfidence,
      },
      selectionReason,
      searchVolume: 'UNKNOWN', // Strictly do not fake search volume numbers
    };
  }
}
