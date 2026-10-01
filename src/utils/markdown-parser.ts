import { slugify } from './slugify.js';

export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  const htmlLines: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let inTable = false;
  let tableHeaderParsed = false;
  let inBlockquote = false;

  const closeList = () => {
    if (inList && listType) {
      htmlLines.push(`</${listType}>`);
      inList = false;
      listType = null;
    }
  };

  const closeTable = () => {
    if (inTable) {
      htmlLines.push('</tbody></table></div>');
      inTable = false;
      tableHeaderParsed = false;
    }
  };

  const closeBlockquote = () => {
    if (inBlockquote) {
      htmlLines.push('</blockquote>');
      inBlockquote = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Blank line
    if (!line) {
      closeList();
      closeTable();
      closeBlockquote();
      continue;
    }

    // Markdown Table row
    if (line.startsWith('|') && line.endsWith('|')) {
      closeList();
      closeBlockquote();

      const cells = line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());

      // Check if it's separator line (e.g. |---|---|)
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        tableHeaderParsed = true;
        continue;
      }

      if (!inTable) {
        htmlLines.push('<div class="table-responsive my-6"><table class="min-w-full divide-y divide-slate-200 border border-slate-200 shadow-sm rounded-lg overflow-hidden">');
        inTable = true;
      }

      if (!tableHeaderParsed) {
        // Render Header
        htmlLines.push('<thead class="bg-amber-50 text-slate-900 font-semibold"><tr>');
        cells.forEach((cell) => {
          htmlLines.push(`<th scope="col" class="px-4 py-3 text-left text-sm font-semibold">${formatInline(cell)}</th>`);
        });
        htmlLines.push('</tr></thead><tbody class="divide-y divide-slate-200 bg-white">');
      } else {
        // Render Body row
        htmlLines.push('<tr class="hover:bg-amber-50/40 transition-colors">');
        cells.forEach((cell) => {
          htmlLines.push(`<td class="px-4 py-3 text-sm text-slate-700">${formatInline(cell)}</td>`);
        });
        htmlLines.push('</tr>');
      }
      continue;
    } else {
      closeTable();
    }

    // Headings
    if (line.startsWith('# ')) {
      closeList();
      closeBlockquote();
      const text = line.substring(2).trim();
      const id = slugify(text) || 'heading-1';
      htmlLines.push(`<h1 id="${id}" class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6 mt-8">${formatInline(text)}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      closeList();
      closeBlockquote();
      const text = line.substring(3).trim();
      const id = slugify(text) || `section-${i}`;
      htmlLines.push(`<h2 id="${id}" class="text-2xl font-bold text-slate-800 tracking-tight mt-10 mb-4 border-b border-amber-200 pb-2 flex items-center gap-2">${formatInline(text)}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      closeBlockquote();
      const text = line.substring(4).trim();
      const id = slugify(text) || `sub-${i}`;
      htmlLines.push(`<h3 id="${id}" class="text-xl font-semibold text-slate-800 mt-6 mb-3">${formatInline(text)}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      closeList();
      closeBlockquote();
      const text = line.substring(5).trim();
      htmlLines.push(`<h4 class="text-lg font-medium text-slate-800 mt-4 mb-2">${formatInline(text)}</h4>`);
      continue;
    }

    // Blockquote / Callout
    if (line.startsWith('> ')) {
      closeList();
      const quoteText = line.substring(2).trim();
      if (!inBlockquote) {
        htmlLines.push('<blockquote class="border-l-4 border-amber-500 bg-amber-50/60 p-4 my-4 rounded-r-lg text-slate-800 italic">');
        inBlockquote = true;
      }
      htmlLines.push(`<p class="mb-1">${formatInline(quoteText)}</p>`);
      continue;
    } else {
      closeBlockquote();
    }

    // Unordered List
    if (/^[-*+]\s+/.test(line)) {
      const itemText = line.replace(/^[-*+]\s+/, '').trim();
      if (!inList || listType !== 'ul') {
        closeList();
        htmlLines.push('<ul class="list-disc list-inside space-y-2 my-4 text-slate-700">');
        inList = true;
        listType = 'ul';
      }
      htmlLines.push(`<li class="leading-relaxed">${formatInline(itemText)}</li>`);
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(line)) {
      const itemText = line.replace(/^\d+\.\s+/, '').trim();
      if (!inList || listType !== 'ol') {
        closeList();
        htmlLines.push('<ol class="list-decimal list-inside space-y-2 my-4 text-slate-700">');
        inList = true;
        listType = 'ol';
      }
      htmlLines.push(`<li class="leading-relaxed">${formatInline(itemText)}</li>`);
      continue;
    }

    // Standard Paragraph
    closeList();
    closeBlockquote();
    htmlLines.push(`<p class="text-base text-slate-700 leading-relaxed mb-4">${formatInline(line)}</p>`);
  }

  closeList();
  closeTable();
  closeBlockquote();

  return htmlLines.join('\n');
}

function formatInline(text: string): string {
  let formatted = text;

  // Escape basic HTML chars to prevent dangerous scripts
  formatted = formatted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
  
  // Italic *text* or _text_
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  formatted = formatted.replace(/_(.*?)_/g, '<em class="italic">$1</em>');

  // Inline Code `code`
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-amber-800 text-sm font-mono">$1</code>');

  // Markdown links [text](url)
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    const isInternal = url.startsWith('/') || url.includes('rajasthanexamtwister.com');
    const targetAttr = isInternal ? '' : ' target="_blank" rel="noopener noreferrer"';
    return `<a href="${url}" class="text-amber-700 hover:text-amber-800 font-medium underline underline-offset-2 transition-colors"${targetAttr}>${linkText}</a>`;
  });

  return formatted;
}
