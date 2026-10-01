import { ArticleBlueprint } from './current-affairs.blueprint.js';

export const StudyGuideBlueprint: ArticleBlueprint = {
  type: 'STUDY_GUIDE',
  name: 'Rajasthan Exam Subject Study Guide & Preparation Strategy',
  targetWordCount: { min: 1400, max: 2800 },
  requiredSections: [
    'H1 Title',
    'Overview & Importance (अवलोकन एवं परीक्षा वेटेज)',
    'Detailed Syllabus Breakdown (पाठ्यक्रम का गहन विश्लेषण)',
    'Important Core Topics & Concepts (मुख्य अवधारणाएं एवं तथ्य)',
    'Chapter-wise Preparation Strategy (अध्यायवार तैयारी रणनीति)',
    'Recommended Books & Official Resources (प्रामाणिक पुस्तकें एवं स्रोत)',
    'Practice Questions & Model MCQs (अभ्यास प्रश्न)',
    'Related Notes & Free Quizzes Links (संबंधित नोट्स एवं क्विज)'
  ],
  templateStructure: `
# {{title}}

## अवलोकन एवं परीक्षा महत्व (Overview & Exam Weightage)
{{overview}}

## विस्तृत पाठ्यक्रम एवं अंक विभाजन (Syllabus & Mark Distribution)
{{syllabusBreakdown}}

## मुख्य विषय एवं परीक्षा उपयोगी अवधारणाएं (Core Topics & Concepts)
{{coreConcepts}}

## तैयारी रणनीति एवं टाइम टेबल (Study Strategy & Action Plan)
{{studyPlan}}

## मानक संदर्भ पुस्तकें एवं सरकारी स्रोत (Standard Books & Portals)
{{referenceBooks}}

## अभ्यास प्रश्न एवं मॉडल पेपर (Practice Questions)
{{mcqsSection}}

## संबंधित फ्री नोट्स एवं ऑनलाइन क्विज (Related Free Notes & Quizzes)
{{internalLinksSection}}
  `,
  guidelines: [
    'Actionable preparation guidance tailored for Rajasthan competitive exams.',
    'Clear breakdown of topics by difficulty and past exam question frequency.',
    'Only recommend authentic government materials and standard syllabus books.',
    'Embed verified internal links to relevant notes and quizzes.'
  ]
};
