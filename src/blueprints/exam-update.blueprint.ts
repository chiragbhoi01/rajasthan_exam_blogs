import { ArticleBlueprint } from './current-affairs.blueprint.js';

export const ExamUpdateBlueprint: ArticleBlueprint = {
  type: 'EXAM_UPDATE',
  name: 'Rajasthan Exam Notification, Syllabus & Recruitment Update',
  targetWordCount: { min: 700, max: 1400 },
  requiredSections: [
    'H1 Title',
    'Official Update Summary (आधिकारिक अधिसूचना सारांश)',
    'Important Dates Table (महत्वपूर्ण तिथियां)',
    'Post & Vacancy Details (पद एवं रिक्तियों का विवरण)',
    'Eligibility & Age Limit (शैक्षणिक योग्यता एवं आयु सीमा)',
    'Application Process & Fees (आवेदन प्रक्रिया एवं शुल्क)',
    'Exam Pattern & Marking Scheme (परीक्षा पैटर्न एवं अंक योजना)',
    'Syllabus Breakdown (पाठ्यक्रम का संक्षिप्त विवरण)',
    'Important Instructions for Candidates (अभ्यर्थियों के लिए निर्देश)',
    'Frequently Asked Questions (अक्सर पूछे जाने वाले प्रश्न - FAQs)',
    'Official Links & Sources (आधिकारिक लिंक एवं स्रोत)'
  ],
  templateStructure: `
# {{title}}

## आधिकारिक अधिसूचना का सार (Notification Summary)
{{summary}}

## महत्वपूर्ण तिथियां (Important Dates)
{{datesTable}}

## पदवार रिक्तियों का विवरण (Post & Category-wise Vacancies)
{{vacanciesTable}}

## पात्रता एवं आयु सीमा (Eligibility Criteria & Age Limits)
{{eligibility}}

## परीक्षा पैटर्न एवं चयन प्रक्रिया (Exam Pattern & Selection Process)
{{examPattern}}

## पाठ्यक्रम विश्लेषण (Syllabus Highlights)
{{syllabus}}

## परीक्षा की तैयारी रणनीति एवं मुख्य सुझाव (Preparation Tips)
{{prepTips}}

## अक्सर पूछे जाने वाले प्रश्न (Frequently Asked Questions)
{{faqsSection}}

## आधिकारिक स्रोत एवं महत्वपूर्ण लिंक (Official Sources)
{{sourcesSection}}
  `,
  guidelines: [
    'All dates, vacancy counts, fee amounts, and age criteria must be verified against official notifications (RPSC/RSSB/Police).',
    'Explicitly state notification advertisement number where available.',
    'Do not speculate on exam dates; if tentative, clearly mark as "अस्थायी/संभावित".',
    'Provide 4-6 high intent FAQs.'
  ]
};
