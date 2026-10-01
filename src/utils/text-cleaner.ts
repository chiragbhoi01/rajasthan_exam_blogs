import { FORBIDDEN_AI_FLUFF_PHRASES } from '../config/constants.js';

export function removeAIFluff(content: string): { cleaned: string; fluffFound: string[] } {
  let cleaned = content;
  const fluffFound: string[] = [];

  for (const phrase of FORBIDDEN_AI_FLUFF_PHRASES) {
    const regex = new RegExp(phrase, 'gi');
    if (regex.test(cleaned)) {
      fluffFound.push(phrase);
      cleaned = cleaned.replace(regex, '');
    }
  }

  // Clean up double spaces and consecutive newlines
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');

  return {
    cleaned: cleaned.trim(),
    fluffFound,
  };
}

export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  // Hindi reading speed ~150-180 words per minute
  const wpm = 160;
  const minutes = Math.ceil(words / wpm);
  return Math.max(1, minutes);
}

export function countWords(text: string): number {
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/[#*`_~]/g, '');
  return plain.trim().split(/\s+/).filter(Boolean).length;
}
