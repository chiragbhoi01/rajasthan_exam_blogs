import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { logger } from '../lib/logger.js';

export interface SuvicharCardParams {
  dateStr: string; // e.g., "02 अक्टूबर 2026"
  quoteLines: string[];
  subBullet1: string;
  subBullet2: string;
  tagline: string;
  outputPath: string;
}

export class SuvicharImageService {
  /**
   * Generates a 1080x1080 High-Res Devanagari Hindi Suvichar Graphic Card
   * Matching Rajasthan Exam Twister X (Twitter) Graphic Style
   */
  async createSuvicharCard(params: SuvicharCardParams): Promise<string> {
    const { dateStr, quoteLines, subBullet1, subBullet2, tagline, outputPath } = params;

    logger.info(`Generating 1080x1080 Suvichar Image Card for date: ${dateStr}...`);

    const width = 1080;
    const height = 1080;

    const quoteLine1 = quoteLines[0] || '';
    const quoteLine2 = quoteLines[1] || '';
    const quoteLine3 = quoteLines[2] || '';

    // Create high-quality SVG graphic canvas
    const svgContent = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Background Gradient -->
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF8E7" />
          <stop offset="50%" stop-color="#FEEBC8" />
          <stop offset="100%" stop-color="#FBD38D" />
        </linearGradient>

        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ECC94B" />
          <stop offset="100%" stop-color="#D69E2E" />
        </linearGradient>

        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#FAFAFA" />
        </linearGradient>

        <linearGradient id="pillGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFF5F5" />
          <stop offset="100%" stop-color="#FED7D7" />
        </linearGradient>

        <linearGradient id="pillGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#EBF8FF" />
          <stop offset="100%" stop-color="#BEE3F8" />
        </linearGradient>

        <linearGradient id="taglineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1A202C" />
          <stop offset="100%" stop-color="#2D3748" />
        </linearGradient>

        <!-- Drop Shadow Filters -->
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#744210" flood-opacity="0.15" />
        </filter>
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.1" />
        </filter>
      </defs>

      <!-- Outer Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

      <!-- Decorative Background Fort Silhouette Elements -->
      <path d="M0,750 Q270,720 540,760 T1080,740 L1080,1080 L0,1080 Z" fill="#E2E8F0" opacity="0.3" />
      <path d="M0,820 Q360,780 720,840 T1080,810 L1080,1080 L0,1080 Z" fill="#CBD5E0" opacity="0.4" />

      <!-- Left Side Books Stack Graphic Frame -->
      <g transform="translate(60, 360)">
        <!-- Stack of Books -->
        <rect x="0" y="0" width="160" height="24" rx="4" fill="#2B6CB0" />
        <text x="80" y="16" font-family="'Segoe UI', Arial, sans-serif" font-weight="bold" font-size="11" fill="#FFFFFF" text-anchor="middle">DISCIPLINE</text>

        <rect x="-10" y="30" width="180" height="24" rx="4" fill="#C53030" />
        <text x="80" y="46" font-family="'Segoe UI', Arial, sans-serif" font-weight="bold" font-size="11" fill="#FFFFFF" text-anchor="middle">FOCUS</text>

        <rect x="-5" y="60" width="170" height="24" rx="4" fill="#D69E2E" />
        <text x="80" y="76" font-family="'Segoe UI', Arial, sans-serif" font-weight="bold" font-size="11" fill="#FFFFFF" text-anchor="middle">CONSISTENCY</text>

        <rect x="-15" y="90" width="190" height="24" rx="4" fill="#2F855A" />
        <text x="80" y="106" font-family="'Segoe UI', Arial, sans-serif" font-weight="bold" font-size="11" fill="#FFFFFF" text-anchor="middle">HARD WORK</text>

        <rect x="-8" y="120" width="176" height="24" rx="4" fill="#805AD5" />
        <text x="80" y="136" font-family="'Segoe UI', Arial, sans-serif" font-weight="bold" font-size="11" fill="#FFFFFF" text-anchor="middle">PATIENCE</text>

        <rect x="-12" y="150" width="184" height="24" rx="4" fill="#DD6B20" />
        <text x="80" y="166" font-family="'Segoe UI', Arial, sans-serif" font-weight="bold" font-size="11" fill="#FFFFFF" text-anchor="middle">SELF BELIEF</text>

        <rect x="-20" y="180" width="200" height="28" rx="4" fill="#319795" />
        <text x="80" y="198" font-family="'Segoe UI', Arial, sans-serif" font-weight="bold" font-size="13" fill="#FFFFFF" text-anchor="middle">★ SUCCESS ★</text>
      </g>

      <!-- Brand Logo Badge (Top Left) -->
      <g transform="translate(60, 50)" filter="url(#shadow)">
        <circle cx="75" cy="75" r="70" fill="#1A202C" stroke="#ECC94B" stroke-width="4" />
        <!-- Owl Mascot Icon / Safa Placeholder -->
        <circle cx="75" cy="65" r="35" fill="#D69E2E" />
        <text x="75" y="55" font-family="'Segoe UI', Arial, sans-serif" font-size="28" text-anchor="middle">🦉</text>
        <rect x="25" y="100" width="100" height="22" rx="11" fill="#C53030" />
        <text x="75" y="115" font-family="'Segoe UI', Arial, sans-serif" font-weight="bold" font-size="9" fill="#FFFFFF" text-anchor="middle">EXAM TWISTER</text>
      </g>

      <!-- Header Banner Pill: आज का सुविचार | Date -->
      <g transform="translate(300, 70)" filter="url(#shadow)">
        <rect x="0" y="0" width="600" height="85" rx="42" fill="url(#headerGrad)" stroke="#FFFFFF" stroke-width="4" />
        <text x="300" y="42" font-family="'Mangal', 'Nirmala UI', Arial, sans-serif" font-weight="bold" font-size="32" fill="#1A202C" text-anchor="middle">
          🗓️ आज का सुविचार
        </text>
        <rect x="180" y="52" width="240" height="26" rx="13" fill="#1A202C" />
        <text x="300" y="70" font-family="'Mangal', 'Nirmala UI', Arial, sans-serif" font-weight="bold" font-size="14" fill="#ECC94B" text-anchor="middle">
          ${dateStr}
        </text>
      </g>

      <!-- Main Quote White Card Container -->
      <g transform="translate(260, 190)" filter="url(#cardShadow)">
        <rect x="0" y="0" width="760" height="420" rx="30" fill="url(#cardGrad)" stroke="#ECC94B" stroke-width="3" />
        
        <!-- Large Gold Quote Marks -->
        <text x="35" y="80" font-family="Georgia, serif" font-size="90" font-weight="bold" fill="#D69E2E" opacity="0.6">“</text>
        <text x="680" y="380" font-family="Georgia, serif" font-size="90" font-weight="bold" fill="#D69E2E" opacity="0.6">”</text>

        <!-- Quote Content Lines -->
        <text x="380" y="130" font-family="'Mangal', 'Nirmala UI', Arial, sans-serif" font-weight="bold" font-size="34" fill="#1A202C" text-anchor="middle">
          ${quoteLine1}
        </text>
        <text x="380" y="195" font-family="'Mangal', 'Nirmala UI', Arial, sans-serif" font-weight="bold" font-size="34" fill="#2B6CB0" text-anchor="middle">
          ${quoteLine2}
        </text>
        <text x="380" y="260" font-family="'Mangal', 'Nirmala UI', Arial, sans-serif" font-weight="bold" font-size="34" fill="#C53030" text-anchor="middle">
          ${quoteLine3}
        </text>

        <text x="380" y="335" font-family="Arial, sans-serif" font-size="32" text-anchor="middle">🌱 ☀️ 🔥</text>
      </g>

      <!-- Sub Card Pill 1 -->
      <g transform="translate(320, 645)" filter="url(#cardShadow)">
        <rect x="0" y="0" width="670" height="80" rx="20" fill="url(#pillGrad1)" stroke="#FEB2B2" stroke-width="2" />
        <text x="35" y="48" font-family="Arial, sans-serif" font-size="30">📖</text>
        <text x="80" y="48" font-family="'Mangal', 'Nirmala UI', Arial, sans-serif" font-weight="bold" font-size="22" fill="#9B2C2C">
          ${subBullet1}
        </text>
      </g>

      <!-- Sub Card Pill 2 -->
      <g transform="translate(320, 745)" filter="url(#cardShadow)">
        <rect x="0" y="0" width="670" height="80" rx="20" fill="url(#pillGrad2)" stroke="#90CDF4" stroke-width="2" />
        <text x="35" y="48" font-family="Arial, sans-serif" font-size="30">🎯</text>
        <text x="80" y="48" font-family="'Mangal', 'Nirmala UI', Arial, sans-serif" font-weight="bold" font-size="22" fill="#2C5282">
          ${subBullet2}
        </text>
      </g>

      <!-- Bottom Tagline Banner -->
      <g transform="translate(260, 875)" filter="url(#shadow)">
        <rect x="0" y="0" width="760" height="75" rx="37.5" fill="url(#taglineGrad)" stroke="#ECC94B" stroke-width="3" />
        <text x="380" y="48" font-family="'Mangal', 'Nirmala UI', Arial, sans-serif" font-weight="bold" font-size="28" fill="#ECC94B" text-anchor="middle">
          ${tagline} 🧠 🔥
        </text>
      </g>

      <!-- Footer Brand Watermark -->
      <text x="540" y="1025" font-family="'Segoe UI', Arial, sans-serif" font-weight="bold" font-size="16" fill="#718096" text-anchor="middle">
        @examtwister • https://rajasthanexamtwister.in
      </text>
    </svg>
    `;

    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Convert SVG to PNG High-Res Image & Composite Brand Logo using Sharp
    const svgBuffer = Buffer.from(svgContent);
    const logoPath = path.join(process.cwd(), 'brand_assets', 'examtwister_logo.png');

    if (fs.existsSync(logoPath)) {
      try {
        const resizedLogo = await sharp(logoPath)
          .resize(170, 170, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .toBuffer();

        await sharp(svgBuffer)
          .composite([{ input: resizedLogo, top: 35, left: 50 }])
          .png({ quality: 100 })
          .toFile(outputPath);

        logger.info(`Suvichar 1080x1080 PNG Image Card created with authentic brand logo at: ${outputPath}`);
        return outputPath;
      } catch (err: any) {
        logger.warn(`Brand logo composite notice: ${err?.message}`);
      }
    }

    await sharp(svgBuffer)
      .png({ quality: 100 })
      .toFile(outputPath);

    logger.info(`Suvichar 1080x1080 PNG Image Card created successfully at: ${outputPath}`);
    return outputPath;
  }
}
