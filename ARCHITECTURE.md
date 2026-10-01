# Rajasthan Exam Twister — Autonomous AI Blog Engine Architecture

## 1. System Overview
Rajasthan Exam Twister Autonomous AI Blog Engine is a production-grade content research, synthesis, fact verification, SEO, and draft generation system specifically designed for Rajasthan state competitive examinations (RPSC RAS, Rajasthan CET, REET, Rajasthan Police, Patwari, VDO, School Lecturer, etc.).

All generated articles are strictly stored as **`DRAFT`** status in the CMS database (`blogs` collection) alongside a separate research and source verification record in the `blog_researches` collection for human admin editorial review. Auto-publishing is blocked by design in v1.

```
                    ┌─────────────────────────┐
                    │ Topic Input             │
                    │ Mode A (Manual) /       │
                    │ Mode B (Auto Discovery) │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ Topic Scoring Engine    │
                    │ (Relevance, Gaps, PYQs) │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ Live Research Engine    │
                    │ Tier 1: Official/Govt   │
                    │ Tier 2: Ref Academy     │
                    │ Tier 3: General Web     │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ Fact Verification & QA  │
                    │ (Verified, Supported,   │
                    │ Uncertain, Conflicting) │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ SEO & Content Brief     │
                    │ (Slug, Meta, Live Links)│
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ AI Article Writer       │
                    │ (Devanagari, Anti-Fluff,│
                    │ Tables, MCQs, FAQs)     │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ Taxonomy Engine         │
                    │ (Find-or-Create Cat/Tags│
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ Featured Image Concept  │
                    │ (1200x630 Branded Prompt│
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ Editorial QA Gate       │
                    │ (Hard Blocks & Warnings)│
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ CMS Draft Persistence   │
                    │ Status = DRAFT          │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ Human Admin Review      │
                    │ (Edit, Regenerate, Pub) │
                    └─────────────────────────┘
```

## 2. Research & Source Prioritization (Tiered Hierarchy)
- **Tier 1 (Official / Government Primary Sources):**
  - `rsmssb.rajasthan.gov.in` (RSSB notifications, CET schemes)
  - `rpsc.rajasthan.gov.in` (RPSC RAS, Lecturer, SI notifications)
  - `rajeduboard.rajasthan.gov.in` (RBSE standard textbooks)
  - `dipr.rajasthan.gov.in` (State Government Information & Public Relations)
  - `police.rajasthan.gov.in` (Police recruitment board)
- **Tier 2 (Reputable Academic & Educational References):**
  - Rajasthan Hindi Granth Academy standard reference publications
  - State gazetteers and legislative archives
- **Tier 3 (General Web / Cross-Checking):**
  - Used strictly for discovering candidate questions and cross-verifying without relying on unverified third-party blogs for factual claims.

## 3. Fact Verification Matrix
Claims extracted during research are categorized into:
- `VERIFIED`: Backed directly by official portals or Rajasthan standard reference texts.
- `SUPPORTED`: Backed by secondary academic consensus.
- `UNCERTAIN`: Marked with an editorial review note if gazette notification is pending.
- `CONFLICTING`: Hard-flagged to prevent automated publishing until verified by human editor.

## 4. Editorial QA Gate & Hard Blocks
- **Hard Blocks (Draft Cannot Be Saved):**
  - Missing H1 heading
  - Empty or short content (<200 words)
  - Duplicate slug or exact title
  - Unsupported/conflicting factual claims
  - Dangerous / unescaped script tags
- **Warnings (Flagged for Review):**
  - Research sources count < 2
  - Meta description outside 60-180 character window

## 5. Selective Section Regeneration
The admin can selectively regenerate individual components without rewriting the entire article:
- FAQs (`FAQS`)
- MCQs (`MCQS`)
- SEO metadata (`SEO`)
- Featured image prompt (`IMAGE_PROMPT`)
- Tags (`TAGS`)
- Excerpt (`EXCERPT`)
