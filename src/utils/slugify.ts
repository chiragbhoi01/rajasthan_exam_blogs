const HINDI_TRANSLITERATION_MAP: Record<string, string> = {
  'राजस्थान': 'rajasthan',
  'के': 'ke',
  'की': 'ki',
  'का': 'ka',
  'लोक': 'lok',
  'नृत्य': 'nritya',
  'इतिहास': 'history',
  'भूगोल': 'geography',
  'कला': 'art',
  'संस्कृति': 'culture',
  'राजव्यवस्था': 'polity',
  'योजना': 'yojana',
  'परीक्षा': 'exam',
  'भर्ती': 'recruitment',
  'सिलेबस': 'syllabus',
  'नोट्स': 'notes',
  'तैयारी': 'preparation',
  'मेले': 'mele',
  'त्योहार': 'tyohar',
  'दुर्ग': 'durg',
  'किले': 'kile',
  'मंदिर': 'mandir',
  'नदियां': 'nadiyan',
  'झीलें': 'jheelein',
  'खनिज': 'khanij',
  'जनजाति': 'janjati',
};

export function slugify(text: string): string {
  let processed = text.trim().toLowerCase();

  // Transliterate known common Hindi keywords for cleaner SEO slugs
  for (const [hindi, eng] of Object.entries(HINDI_TRANSLITERATION_MAP)) {
    processed = processed.split(hindi).join(eng);
  }

  return processed
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start
    .replace(/-+$/, '');      // Trim - from end
}
