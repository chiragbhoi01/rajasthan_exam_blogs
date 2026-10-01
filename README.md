# Rajasthan Exam Twister — Autonomous Blog Automation System

Autonomous AI Blog Research, Content Generation, Fact Verification, SEO, Image & CMS Draft Automation for Rajasthan Competitive Examinations.

## Features
- **Mode A (Manual Generation):** Generate targeted exam guides and GK notes for specific topics.
- **Mode B (Autonomous Topic Discovery):** Discovers high-utility exam topics based on Rajasthan exam syllabus gaps, RPSC/RSSB updates, and past question frequencies.
- **Tier 1 Official Source Prioritization:** RPSC, RSSB, RBSE, DIPR, and Rajasthan Government department portals.
- **Fact Verification Engine:** Rigorous fact-checking categorizing claims into `VERIFIED`, `SUPPORTED`, `UNCERTAIN`, and `CONFLICTING`.
- **Exam-Aligned Blueprints:** 5 specialized blueprints (Current Affairs, Rajasthan GK, Exam Updates, Static GK, Study Guides).
- **Anti-AI Fluff Cleaning:** Automatically detects and removes AI filler phrases for natural, crisp Devanagari Hindi.
- **Verified Practice MCQs & FAQs:** Generates 3-10 authentic MCQs with explanations and 3-6 high search-intent FAQs.
- **Editorial QA Gate:** Enforces hard blocks on malformed HTML, missing H1, unverified claims, or duplicate slugs.
- **DRAFT Safety:** All generated content is saved as `DRAFT` in MongoDB (`blogs` collection) alongside complete research logs in `blog_researches`. Auto-publishing is disabled by default.
- **Selective Regeneration:** Fine-grained regeneration for FAQs, MCQs, SEO, Image Prompts, and Tags.
- **Full Dry-Run Mode:** Test complete generation pipelines without database modifications.

---

## Available Commands

### 1. Dry Run (No DB writes)
```bash
npm run blog:dry-run -- --topic "राजस्थान के लोक नृत्य: घूमर, कालबेलिया, तेरहताली एवं अग्नि नृत्य"
```

### 2. Manual Blog Generation & CMS Draft Creation
```bash
npm run blog:generate -- --topic "राजस्थान के लोक नृत्य" --category "Rajasthan Art & Culture"
```

### 3. Autonomous Topic Discovery
```bash
npm run blog:discover
```

### 4. Standalone Research & Fact Verification Session
```bash
npm run blog:research -- --topic "Rajasthan CET 2026"
```

### 5. Run Editorial QA on Existing Draft
```bash
npm run blog:qa -- --id <BLOG_MONGO_ID>
```

### 6. Inspect / Generate Featured Image Specification
```bash
npm run blog:image -- --id <BLOG_MONGO_ID>
```

### 7. Selective Section Regeneration
```bash
npm run blog:regenerate -- --id <BLOG_MONGO_ID> --section FAQS
npm run blog:regenerate -- --id <BLOG_MONGO_ID> --section MCQS
npm run blog:regenerate -- --id <BLOG_MONGO_ID> --section SEO
```

### 8. Run Typecheck & Test Suite
```bash
npm run typecheck
npm test
```
