import { describe, it, expect } from 'vitest';
import { markdownToHtml } from '../src/utils/markdown-parser.js';

describe('markdownToHtml', () => {
  it('should format headings with ids', () => {
    const md = '# राजस्थान के दुर्ग\n\n## मेहरानगढ़ दुर्ग';
    const html = markdownToHtml(md);
    expect(html).toContain('<h1 id="');
    expect(html).toContain('<h2 id="');
  });

  it('should render structured responsive tables', () => {
    const md = `
| नृत्य | जिला |
|---|---|
| घूमर | जयपुर |
| अग्नि | बीकानेर |
    `;
    const html = markdownToHtml(md);
    expect(html).toContain('<table');
    expect(html).toContain('<thead');
    expect(html).toContain('<tbody');
    expect(html).toContain('घूमर');
    expect(html).toContain('बीकानेर');
  });

  it('should format blockquotes and bold tags', () => {
    const md = '> **महत्वपूर्ण तथ्य:** यह परीक्षा में पूछा गया है।';
    const html = markdownToHtml(md);
    expect(html).toContain('<blockquote');
    expect(html).toContain('<strong class="font-semibold text-slate-900">महत्वपूर्ण तथ्य:</strong>');
  });
});
