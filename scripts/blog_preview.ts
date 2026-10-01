import fs from 'fs';
import path from 'path';
import { BlogAutomationPipeline } from '../src/services/pipeline.service.js';
import { BRANDING } from '../src/config/constants.js';

function parseTopic(): string {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--topic' || args[i] === '-t') && args[i + 1]) {
      return args[i + 1];
    }
  }
  if (args.length > 0 && !args[0].startsWith('-')) {
    return args.join(' ');
  }
  return 'राजस्थान के प्रमुख लोक नृत्य: घूमर, कालबेलिया, तेरहताली एवं अग्नि नृत्य';
}

function renderFullHtmlPage(result: any): string {
  const draft = result.blogDraft;
  const research = result.research;
  const imagePrompt = result.imageResult?.prompt;

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${draft.title} | ${BRANDING.SITE_NAME}</title>
  <meta name="description" content="${draft.metaDescription}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Noto Sans Devanagari"', '"Outfit"', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace']
          },
          colors: {
            brand: {
              50: '#fffbeb',
              100: '#fef3c7',
              500: '#f59e0b',
              600: '#d97706',
              700: '#b45309',
              900: '#78350f',
            },
            slate: {
              850: '#151f32',
              900: '#0f172a',
              950: '#090d16',
            }
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Noto Sans Devanagari', 'Outfit', sans-serif; background-color: #0b0f19; color: #f1f5f9; }
    .glass-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .gradient-border { background: linear-gradient(135deg, rgba(217, 119, 6, 0.4), rgba(245, 158, 11, 0.1)); }
    .table-responsive { overflow-x: auto; margin: 1.5rem 0; border-radius: 0.75rem; border: 1px solid rgba(255,255,255,0.1); }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    thead th { background: rgba(217, 119, 6, 0.15); color: #fbbf24; padding: 0.85rem 1rem; font-weight: 600; font-size: 0.95rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    tbody td { padding: 0.85rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.95rem; color: #cbd5e1; }
    tbody tr:hover { background: rgba(255, 255, 255, 0.03); }
    blockquote { border-left: 4px solid #f59e0b; background: rgba(245, 158, 11, 0.08); padding: 1rem 1.25rem; border-radius: 0 0.5rem 0.5rem 0; margin: 1.25rem 0; color: #fde68a; }
    code { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">

  <!-- Navigation Bar -->
  <header class="sticky top-0 z-50 glass-card border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20">
          RT
        </div>
        <div>
          <span class="font-bold text-lg text-white tracking-tight">${BRANDING.SITE_NAME}</span>
          <span class="hidden sm:inline-block text-xs text-amber-400 ml-2 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 font-medium">Local Live Preview</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          QA Score: ${result.qaReport?.score}/100
        </span>
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          STATUS: DRAFT
        </span>
      </div>
    </div>
  </header>

  <!-- Main Content Layout -->
  <main class="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

    <!-- Left Column: Article Content -->
    <article class="lg:col-span-8 space-y-8">

      <!-- Featured Image Card -->
      <div class="rounded-2xl overflow-hidden glass-card border border-slate-700/60 shadow-2xl relative group">
        <div class="w-full aspect-[1200/630] bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-950 flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
          <!-- Ambient Glows -->
          <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>
          <div class="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

          <div class="flex items-center justify-between z-10">
            <span class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
              ${imagePrompt?.subheading || 'Rajasthan GK'}
            </span>
            <span class="text-xs text-slate-400 font-mono">1200 × 630 Branded Banner</span>
          </div>

          <div class="z-10 my-auto py-4">
            <h1 class="text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              ${imagePrompt?.headline || draft.title}
            </h1>
            <p class="text-sm sm:text-base text-amber-200/80 mt-2 max-w-2xl font-medium">
              सम्पूर्ण परीक्षा उपयोगी नोट्स, तुलनात्मक सारणी एवं अभ्यास प्रश्न
            </p>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-700/50 z-10">
            <div class="flex items-center gap-2 text-xs text-slate-300">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>${draft.author}</span>
            </div>
            <div class="text-xs text-slate-400 font-mono">
              ⏱️ ${draft.readingTime} min read
            </div>
          </div>
        </div>
      </div>

      <!-- Article Header Meta -->
      <div class="glass-card p-6 rounded-2xl space-y-4">
        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>🎯 Target: RPSC RAS | CET | REET | Police</span>
          <span>•</span>
          <span>📅 ${new Date().toLocaleDateString('hi-IN', { dateStyle: 'long' })}</span>
          <span>•</span>
          <span>📖 ${result.qaReport?.metrics.wordCount} शब्द</span>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm leading-relaxed">
          <strong class="text-amber-400">संक्षिप्त सार (Excerpt):</strong> ${draft.excerpt}
        </div>
      </div>

      <!-- Article Rich Content Body -->
      <div class="glass-card p-6 sm:p-10 rounded-2xl prose prose-invert max-w-none text-slate-300 space-y-6">
        ${draft.content}
      </div>

    </article>

    <!-- Right Column: Sidebar (QA, Sources, Fact Verification & SEO) -->
    <aside class="lg:col-span-4 space-y-6">

      <!-- Editorial QA Summary Card -->
      <div class="glass-card p-6 rounded-2xl border border-emerald-500/30 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            🛡️ Editorial QA Report
          </h3>
          <span class="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
            ${result.qaReport?.score}/100
          </span>
        </div>
        <div class="space-y-3 text-xs">
          <div class="flex justify-between py-1.5 border-b border-slate-700/50">
            <span class="text-slate-400">Hard Blocks</span>
            <span class="text-emerald-400 font-bold">0 (None)</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-700/50">
            <span class="text-slate-400">Word Count</span>
            <span class="text-slate-200 font-mono">${result.qaReport?.metrics.wordCount} words</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-700/50">
            <span class="text-slate-400">Verified Sources</span>
            <span class="text-amber-400 font-bold">${research?.sources.length} Portals</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-700/50">
            <span class="text-slate-400">Practice MCQs</span>
            <span class="text-slate-200 font-bold">${draft.mcqs?.length} Questions</span>
          </div>
          <div class="flex justify-between py-1.5">
            <span class="text-slate-400">Student FAQs</span>
            <span class="text-slate-200 font-bold">${draft.faqs?.length} Items</span>
          </div>
        </div>
      </div>

      <!-- Verified Sources Card -->
      <div class="glass-card p-6 rounded-2xl space-y-4">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          🏛️ Research Sources Trail
        </h3>
        <div class="space-y-3">
          ${research?.sources.map((s: any, idx: number) => `
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  Tier ${s.tier} • ${s.sourceType}
                </span>
              </div>
              <p class="font-semibold text-slate-200 leading-snug">${s.title}</p>
              <a href="${s.url}" target="_blank" class="text-amber-400 hover:underline block truncate text-[11px] font-mono">
                🔗 ${s.url}
              </a>
              <p class="text-slate-400 text-[11px]">${s.relevance}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Verified Claims Card -->
      <div class="glass-card p-6 rounded-2xl space-y-4">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          ✅ Verified Fact Claims
        </h3>
        <div class="space-y-2.5">
          ${research?.verifiedClaims.map((c: any) => `
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
              <div class="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] mb-1">
                <span>✓ ${c.status}</span>
                <span class="text-slate-500 font-normal">(${c.category})</span>
              </div>
              <p class="text-slate-300 leading-relaxed">${c.claim}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SEO Metadata Card -->
      <div class="glass-card p-6 rounded-2xl space-y-3">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          🔍 SEO Metadata Brief
        </h3>
        <div class="space-y-2 text-xs">
          <div>
            <span class="text-slate-400 block font-medium">Suggested Slug:</span>
            <code class="text-amber-300 font-mono bg-slate-950 px-2 py-1 rounded block mt-1 overflow-x-auto">/${draft.slug}</code>
          </div>
          <div>
            <span class="text-slate-400 block font-medium">Meta Title:</span>
            <p class="text-slate-200 mt-0.5">${draft.metaTitle}</p>
          </div>
          <div>
            <span class="text-slate-400 block font-medium">Primary Keyword:</span>
            <span class="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium mt-1">
              ${draft.primaryKeyword}
            </span>
          </div>
        </div>
      </div>

    </aside>

  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-800 glass-card mt-12 py-6">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-400">
      ${BRANDING.SITE_NAME} © 2026 • Autonomous AI Blog Research & Content Pipeline • Strictly DRAFT Mode
    </div>
  </footer>

</body>
</html>`;
}

async function main() {
  const topic = parseTopic();
  const pipeline = new BlogAutomationPipeline();

  console.log(`\n================ GENERATING LOCAL BLOG PREVIEW ================\n`);
  console.log(`Topic: "${topic}"`);

  // Run in dryRun mode so no MongoDB connection is attempted
  const result = await pipeline.runPipeline({
    topic,
    dryRun: true,
  });

  if (!result.success || !result.blogDraft) {
    console.error('Failed to generate blog preview:', result.errors);
    process.exit(1);
  }

  // Create preview folder if it doesn't exist
  const previewDir = path.join(process.cwd(), 'preview');
  if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir, { recursive: true });
  }

  const htmlContent = renderFullHtmlPage(result);
  const previewPath = path.join(previewDir, 'blog-preview.html');
  fs.writeFileSync(previewPath, htmlContent, 'utf-8');

  console.log('\n================ PREVIEW GENERATED SUCCESSFULLY ================');
  console.log(`Title: ${result.blogDraft.title}`);
  console.log(`Word Count: ${result.qaReport?.metrics.wordCount}`);
  console.log(`QA Score: ${result.qaReport?.score}/100`);
  console.log(`MCQs: ${result.blogDraft.mcqs?.length} items`);
  console.log(`FAQs: ${result.blogDraft.faqs?.length} items`);
  console.log(`\nLocal Preview File: ${previewPath}`);
  console.log('=================================================================\n');
}

main();
