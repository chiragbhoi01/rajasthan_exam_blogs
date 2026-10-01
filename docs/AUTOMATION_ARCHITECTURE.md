# Rajasthan Exam Twister — Content Automation Architecture

**Autonomous AI Blog Research, Fact Verification, SEO, AEO, MCQ, Image & CMS Package Engine**

- **Primary Production Domain:** `https://rajasthanexamtwister.in`
- **Engine Paradigm:** Antigravity-Native AI & Live Research Environment (Zero External API Keys Required)

---

## 1. Final Responsibility Split

| Function / Component | `rajasthan_exam_blogs` (This Repository) | Website Repository (`trynew` / Production Web App) |
| :--- | :---: | :---: |
| **Topic Discovery & Deduplication** | ✅ Yes | ❌ No |
| **Live Web Research & Official Sources** | ✅ Yes | ❌ No |
| **Fact Verification Matrix & Claim Audit** | ✅ Yes | ❌ No |
| **Article Generation & Blueprint Templates** | ✅ Yes | ❌ No |
| **SEO & AEO (Answer Engine Optimization)** | ✅ Yes | ❌ No |
| **Exam MCQs & FAQs Generation** | ✅ Yes | ❌ No |
| **Internal Link Opportunities** | ✅ Yes | ❌ No |
| **Image Concept & Branded 1200x630 Prompts** | ✅ Yes | ❌ No |
| **Editorial QA Gate (Hard Blocks & Warnings)**| ✅ Yes | ❌ No |
| **Batch Planning & JSON Package Export** | ✅ Yes | ❌ No |
| **Blog CMS & MongoDB Persistence** | ❌ No (Clean Contract) | ✅ Yes |
| **Admin UI & Draft Review** | ❌ No | ✅ Yes |
| **Categories, Tags & Cloudinary Storage** | ❌ No | ✅ Yes |
| **Scheduling & Human Publishing Approval** | ❌ No | ✅ Yes |
| **Public SSR/SSG Blog Routes, Sitemap & Robots**| ❌ No | ✅ Yes |

---

## 2. Antigravity-Native AI Content Pipeline

```
                              ┌──────────────────────────────────┐
                              │ Topic Discovery / Input Batch    │
                              │ (Syllabus, Gaps, Trends, Notices)│
                              └────────────────┬─────────────────┘
                                               ↓
                              ┌──────────────────────────────────┐
                              │ Deduplication & Angle Classifier │
                              │ (CREATE_NEW, UPDATE, ANGLE, SKIP)│
                              └────────────────┬─────────────────┘
                                               ↓
                              ┌──────────────────────────────────┐
                              │ Multi-Dimensional Topic Scorer   │
                              │ (Relevance, Intent, PYQs, Score) │
                              └────────────────┬─────────────────┘
                                               ↓
                              ┌──────────────────────────────────┐
                              │ Live Tiered Research Engine      │
                              │ Tier 1: Official/Govt Portals    │
                              │ Tier 2: Academic Reference Texts │
                              │ Tier 3: General Web Cross-Check  │
                              └────────────────┬─────────────────┘
                                               ↓
                              ┌──────────────────────────────────┐
                              │ Fact Verification & Claim Matrix │
                              │ (VERIFIED, SUPPORTED, UNCERTAIN) │
                              └────────────────┬─────────────────┘
                                               ↓
                              ┌──────────────────────────────────┐
                              │ Content Brief: SEO + AEO Design  │
                              │ (Direct Answer, Entities, Slugs) │
                              └────────────────┬─────────────────┘
                                               ↓
                              ┌──────────────────────────────────┐
                              │ Article Writer (Devanagari Hindi)│
                              │ (Anti-Fluff, Tables, MCQs, FAQs) │
                              └────────────────┬─────────────────┘
                                               ↓
                              ┌──────────────────────────────────┐
                              │ Editorial QA Gate                │
                              │ (Hard Blocks, Checks, Quality)   │
                              └────────────────┬─────────────────┘
                                               ↓
                              ┌──────────────────────────────────┐
                              │ Content Package & Manifest Export│
                              │ (JSON / Batch / Local Preview)   │
                              └────────────────┬─────────────────┘
                                               ↓
                              ┌──────────────────────────────────┐
                              │ Rajasthan Exam Twister Website   │
                              │ (CMS DRAFTS -> Human Review)     │
                              └──────────────────────────────────┘
```

---

## 3. Answer Engine Optimization (AEO) Design
Every article produces structured AEO metadata to ensure answer engines (Google SGE, AI Overviews, Perplexity, Bing Copilot) extract precise facts:
- **`directAnswer`**: 2–3 sentence direct factual answer without conversational filler.
- **`questions`**: Precise question variations matching student voice and search queries.
- **`entities`**: Key entities (rulers, districts, exams, commissions, acts, schemes).
- **`keyFacts`**: Core bulleted facts with verification citations.

---

## 4. Tiered Source Hierarchy & Fact Verification Matrix
- **Tier 1 (Official & Government Primary Sources):**
  - RPSC (`rpsc.rajasthan.gov.in`)
  - RSSB / RSMSSB (`rsmssb.rajasthan.gov.in`)
  - RBSE (`rajeduboard.rajasthan.gov.in`)
  - Rajasthan Information & Public Relations (`dipr.rajasthan.gov.in`)
  - Rajasthan Police (`police.rajasthan.gov.in`)
- **Tier 2 (Reputable Academic References):**
  - Rajasthan Hindi Granth Academy texts
  - Standard state gazetteers & budget documents
- **Tier 3 (General Web):**
  - Used strictly for discovering candidate questions; never overrides Tier 1/2.

---

## 5. Structured Content Package Schema (v1.0)
Every completed article exports in a unified JSON contract:

```json
{
  "version": "1.0",
  "topic": "राजस्थान के प्रमुख लोक नृत्य: घूमर, कालबेलिया, तेरहताली एवं अग्नि नृत्य",
  "articleType": "RAJASTHAN_GK",
  "article": {
    "title": "...",
    "slug": "rajasthan-ke-lok-nritya",
    "excerpt": "...",
    "content": "<p>...</p>"
  },
  "seo": {
    "title": "...",
    "metaDescription": "...",
    "primaryKeyword": "राजस्थान के लोक नृत्य",
    "secondaryKeywords": ["Rajasthan GK", "RPSC Notes"],
    "searchIntent": "EXAM_PREPARATION",
    "canonicalPath": "/blogs/rajasthan-ke-lok-nritya"
  },
  "aeo": {
    "directAnswer": "राजस्थान का राज्य नृत्य घूमर है...",
    "questions": ["राजस्थान का राज्य नृत्य कौन सा है?"],
    "entities": ["घूमर", "कालबेलिया", "तेरहताली", "अग्नि नृत्य"],
    "keyFacts": ["2010 में कालबेलिया यूनेस्को अमूर्त विरासत सूची में शामिल"]
  },
  "faq": [
    { "question": "...", "answer": "..." }
  ],
  "mcqs": [
    {
      "question": "...",
      "options": [{ "key": "A", "text": "..." }, ...],
      "correctAnswer": "B",
      "explanation": "...",
      "sourceOrVerification": "..."
    }
  ],
  "sources": [
    { "title": "...", "url": "...", "domain": "...", "sourceType": "GOVERNMENT", "tier": 1 }
  ],
  "internalLinks": [
    { "title": "...", "url": "/quizzes/rajasthan-gk", "slug": "rajasthan-gk-quiz", "type": "QUIZ" }
  ],
  "image": {
    "prompt": "...",
    "altText": "...",
    "width": 1200,
    "height": 630
  },
  "research": {
    "verifiedClaims": [],
    "uncertainClaims": [],
    "conflictingClaims": []
  },
  "qa": {
    "status": "PASS",
    "score": 100,
    "warnings": [],
    "errors": []
  }
}
```

---

## 6. Batch Generation & Manifest Protocol
The batch orchestrator writes all packages to `batch/` along with `batch/manifest.json`:
- `batch/article-001.json`
- `batch/article-002.json`
- `batch/manifest.json` containing total count, pass/warning/hold status, topic breakdowns, and execution timestamps.
