export interface ArticleBlueprint {
  type: string;
  name: string;
  targetWordCount: { min: number; max: number };
  requiredSections: string[];
  templateStructure: string;
  guidelines: string[];
}

export const CurrentAffairsBlueprint: ArticleBlueprint = {
  type: 'CURRENT_AFFAIRS',
  name: 'Rajasthan Current Affairs & Government Schemes',
  targetWordCount: { min: 800, max: 1500 },
  requiredSections: [
    'H1 Title',
    'Quick Summary',
    'What Happened? (घटना का विवरण)',
    'Why It Matters for Rajasthan Exams (राजस्थान परीक्षाओं के लिए महत्व)',
    'Important Facts & Key Details (मुख्य तथ्य एवं आंकड़े)',
    'Timeline / Important Dates (समयरेखा एवं महत्वपूर्ण तिथियां)',
    'Exam-Oriented Points (परीक्षा उपयोगी मुख्य बिंदु)',
    'Possible Practice MCQs (संभावित अभ्यास प्रश्न)',
    'Verified Sources & References (सत्यापित स्रोत)'
  ],
  templateStructure: `
# {{title}}

## संक्षिप्त सार (Quick Summary)
{{summary}}

## क्या हुआ? (घटना एवं योजना का विवरण)
{{eventDetails}}

## राजस्थान प्रतियोगी परीक्षाओं के लिए क्यों महत्वपूर्ण है?
{{examRelevance}}

## मुख्य तथ्य एवं महत्वपूर्ण आंकड़े (Key Facts & Statistics)
{{factsTableOrList}}

## समयरेखा एवं महत्वपूर्ण तिथियां (Timeline & Dates)
{{timeline}}

## परीक्षा उपयोगी वन-लाइनर्स (Exam-Oriented High Yield Points)
{{examPoints}}

## संभावित अभ्यास बहुविकल्पीय प्रश्न (Practice MCQs)
{{mcqsSection}}

## आधिकारिक एवं सत्यापित संदर्भ (Verified References)
{{sourcesSection}}
  `,
  guidelines: [
    'Always state exact dates and numbers verified from primary sources.',
    'Distinguish between current event dates and historical background.',
    'Never use vague terms like "recently" or "latest" without specific dates.',
    'Highlight relevant exams like RAS, CET, Rajasthan Police, Patwari, VDO.',
    'Include 3-5 verified exam-level MCQs with clear explanations.'
  ]
};
