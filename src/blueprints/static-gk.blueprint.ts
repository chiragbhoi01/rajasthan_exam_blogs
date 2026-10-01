import { ArticleBlueprint } from './current-affairs.blueprint.js';

export const StaticGKBlueprint: ArticleBlueprint = {
  type: 'STATIC_GK',
  name: 'Rajasthan Evergreen & Static GK Guide',
  targetWordCount: { min: 1200, max: 2500 },
  requiredSections: [
    'H1 Title',
    'Introduction (ऐतिहासिक/भौगोलिक परिचय)',
    'Key Features & Facts (प्रमुख विशेषताएं एवं प्रमाणिक तथ्य)',
    'Comprehensive Sub-sections with Tables (सारणीबद्ध वर्गीकरण)',
    'Important Locations & District Details (जिलावार विवरण)',
    'Exam One-Liners (परीक्षा उपयोगी वन-लाइनर्स)',
    'MCQs with Explanations (अभ्यास प्रश्न एवं समाधान)',
    'Revision Summary (रिवीजन सारांश)',
    'Sources & References (प्रामाणिक स्रोत)'
  ],
  templateStructure: `
# {{title}}

## प्रस्तावना (Introduction)
{{introduction}}

## ऐतिहासिक एवं भौगोलिक संदर्भ (Context & Significance)
{{context}}

## मुख्य विशेषताएं एवं सारणीबद्ध विवरण (Comprehensive Classification Table)
{{classificationTable}}

## जिलावार एवं क्षेत्रीय विशेषताएं (District-wise & Regional Facts)
{{regionalBreakdown}}

## परीक्षा की दृष्टि से अति-महत्वपूर्ण वन-लाइनर्स (Exam One-Liners)
{{oneLiners}}

## विगत एवं संभावित परीक्षा प्रश्न (Practice MCQs)
{{mcqsSection}}

## त्वरित रिवीजन सार (Revision Summary)
{{revisionSummary}}

## संदर्भ एवं प्रामाणिक स्रोत (Verified References)
{{sourcesSection}}
  `,
  guidelines: [
    'Focus on long-term syllabus evergreen topics (Forts, Folk deities, Rivers, Mineral reserves, Tribes, Census, Administrative divisions).',
    'Include structured markdown tables comparing districts, rulers, festivals, or geographical zones.',
    'Include 5-10 high quality MCQs.'
  ]
};
