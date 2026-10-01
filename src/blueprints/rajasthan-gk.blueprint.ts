import { ArticleBlueprint } from './current-affairs.blueprint.js';

export const RajasthanGKBlueprint: ArticleBlueprint = {
  type: 'RAJASTHAN_GK',
  name: 'Rajasthan General Knowledge (History, Art & Culture, Geography, Polity)',
  targetWordCount: { min: 1000, max: 2000 },
  requiredSections: [
    'H1 Title',
    'Introduction (प्रस्तावना एवं ऐतिहासिक/भौगोलिक पृष्ठभूमि)',
    'Key Facts (मुख्य एवं प्रामाणिक तथ्य)',
    'Detailed Explanation (विस्तृत व्याख्या एवं वर्गीकरण)',
    'Important One-Liners (परीक्षा उपयोगी वन-लाइनर तथ्य)',
    'Previous Year Exam Questions & Facts (विगत परीक्षाओं में पूछे गए तथ्य)',
    'MCQs with Explanations (अभ्यास प्रश्न एवं विस्तृत उत्तर)',
    'Quick Revision Summary (त्वरित पुनरावृत्ति सार)',
    'References & Sources (प्रामाणिक संदर्भ)'
  ],
  templateStructure: `
# {{title}}

## प्रस्तावना (Introduction)
{{introduction}}

## मुख्य एवं प्रामाणिक तथ्य (Key Facts at a Glance)
{{keyFacts}}

## विस्तृत विवरण एवं वर्गीकरण (Detailed Analysis & Classification)
{{detailedContent}}

## महत्वपूर्ण तुलनात्मक सारणी (Comparative Data Table)
{{dataTable}}

## परीक्षा उपयोगी वन-लाइनर तथ्य (High-Yield Exam One-Liners)
{{oneLiners}}

## विगत परीक्षाओं के आधार पर संभावित प्रश्न (Exam Level MCQs)
{{mcqsSection}}

## त्वरित पुनरावृत्ति (Quick Revision Bullet Points)
{{quickRevision}}

## प्रामाणिक स्रोत (Verified References)
{{sourcesSection}}
  `,
  guidelines: [
    'Use standardized Hindi terminology with standard English terms where relevant in RPSC/RSSB syllabus.',
    'Organize classifications with clear headings, subheadings, and structured comparison tables.',
    'Ground all historical, geographical, and cultural assertions in authentic texts and gazetteers.',
    'Do not include AI filler phrases like "इस लेख में हम विस्तार से जानेंगे".',
    'Provide 5-8 verified MCQs with clear explanations.'
  ]
};
