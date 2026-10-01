import { logger } from '../lib/logger.js';

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: { maxRetries?: number; initialDelayMs?: number; factor?: number; operationName?: string } = {}
): Promise<T> {
  const maxRetries = options.maxRetries || 3;
  const initialDelay = options.initialDelayMs || 1000;
  const factor = options.factor || 2;
  const name = options.operationName || 'Operation';

  let attempt = 0;
  let delay = initialDelay;

  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (err: any) {
      attempt++;
      logger.warn(`${name} failed (attempt ${attempt}/${maxRetries}): ${err?.message || err}`);
      if (attempt >= maxRetries) {
        throw err;
      }
      await sleep(delay);
      delay *= factor;
    }
  }

  throw new Error(`${name} exceeded maximum retries`);
}
