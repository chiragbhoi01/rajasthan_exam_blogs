import { ENV } from '../config/env.config.js';
import { logger } from '../lib/logger.js';

export interface IndexingResult {
  engine: string;
  url: string;
  status: 'SUCCESS' | 'FAILED';
  statusCode?: number;
  message?: string;
}

export class IndexingService {
  private siteBaseUrl: string;

  constructor() {
    this.siteBaseUrl = ENV.SITE_BASE_URL.replace(/\/$/, '');
  }

  /**
   * Pings major search engines (Google, Bing) with updated Sitemap and specific Blog URL
   */
  async pingSearchEngines(blogCanonicalUrl?: string): Promise<IndexingResult[]> {
    const results: IndexingResult[] = [];
    const sitemapUrl = `${this.siteBaseUrl}/sitemap.xml`;
    const targetUrl = blogCanonicalUrl || this.siteBaseUrl;

    logger.info(`=======================================================`);
    logger.info(`Pinging Search Engines for Instant Indexing...`);
    logger.info(`Site URL: ${targetUrl}`);
    logger.info(`Sitemap URL: ${sitemapUrl}`);
    logger.info(`=======================================================`);

    // 1. Google Sitemap Ping
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    try {
      const res = await fetch(googlePingUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RajasthanExamTwisterBot/1.0' },
      });
      results.push({
        engine: 'Google Search Console',
        url: googlePingUrl,
        status: res.ok || res.status === 200 ? 'SUCCESS' : 'FAILED',
        statusCode: res.status,
        message: res.ok ? 'Google notified of sitemap update' : `Google ping response: ${res.statusText}`,
      });
      logger.info(`[Google Ping] Status: ${res.status} (${res.ok ? 'SUCCESS' : 'NOTICE'})`);
    } catch (err: any) {
      results.push({
        engine: 'Google Search Console',
        url: googlePingUrl,
        status: 'FAILED',
        message: err?.message || 'Network request failed',
      });
      logger.warn(`[Google Ping] Notice: ${err?.message}`);
    }

    // 2. Bing Sitemap Ping
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    try {
      const res = await fetch(bingPingUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RajasthanExamTwisterBot/1.0' },
      });
      results.push({
        engine: 'Bing Webmaster Tools',
        url: bingPingUrl,
        status: res.ok || res.status === 200 ? 'SUCCESS' : 'FAILED',
        statusCode: res.status,
        message: res.ok ? 'Bing notified of sitemap update' : `Bing ping response: ${res.statusText}`,
      });
      logger.info(`[Bing Ping] Status: ${res.status} (${res.ok ? 'SUCCESS' : 'NOTICE'})`);
    } catch (err: any) {
      results.push({
        engine: 'Bing Webmaster Tools',
        url: bingPingUrl,
        status: 'FAILED',
        message: err?.message || 'Network request failed',
      });
      logger.warn(`[Bing Ping] Notice: ${err?.message}`);
    }

    // 3. IndexNow Protocol (Bing, Yandex, Naver, Seznam instant URL indexing)
    const indexNowUrl = 'https://api.indexnow.org/indexnow';
    try {
      const payload = {
        host: new URL(this.siteBaseUrl).hostname,
        key: 'rajasthanexamtwisterindexnow2026',
        keyLocation: `${this.siteBaseUrl}/rajasthanexamtwisterindexnow2026.txt`,
        urlList: [targetUrl, sitemapUrl],
      };

      const res = await fetch(indexNowUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });

      const isSuccess = res.ok || res.status === 200 || res.status === 202;
      results.push({
        engine: 'IndexNow Global Protocol (Bing/Yandex/Seznam Instant Indexing)',
        url: targetUrl,
        status: isSuccess ? 'SUCCESS' : 'FAILED',
        statusCode: res.status,
        message: isSuccess ? 'Instant URL submitted to Search Engine Indexing Cluster' : `IndexNow HTTP ${res.status}`,
      });
      logger.info(`[IndexNow API] Status: ${res.status} (${res.ok || res.status === 202 ? 'SUBMITTED' : 'NOTICE'})`);
    } catch (err: any) {
      results.push({
        engine: 'IndexNow Global Protocol',
        url: targetUrl,
        status: 'FAILED',
        message: err?.message || 'IndexNow request failed',
      });
      logger.warn(`[IndexNow API] Notice: ${err?.message}`);
    }

    return results;
  }
}
