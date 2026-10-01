import { getDb } from '../lib/mongodb.js';
import { SuvicharImageService } from './suvichar-image.service.js';
import { logger } from '../lib/logger.js';
import path from 'path';
import fs from 'fs';
import crypto from 'node:crypto';

export interface SuvicharPost {
  text: string;
  imagePath: string;
  hashtags: string[];
  link?: string;
  createdAt: string;
}

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

export function generateOAuth1Header(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessSecret: string
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
    ...params,
  };

  const sortedKeys = Object.keys(oauthParams).sort();
  const paramString = sortedKeys.map((k) => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`).join('&');

  const baseString = `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(paramString)}`;
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(accessSecret)}`;

  const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
  oauthParams['oauth_signature'] = signature;

  const headerParts = Object.keys(oauthParams)
    .filter((k) => k.startsWith('oauth_'))
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`);

  return `OAuth ${headerParts.join(', ')}`;
}

export class SuvicharGeneratorService {
  private static SUVICHAR_COLLECTION = [
    {
      lines: [
        'हर नई सुबह एक नया मौका देती है,',
        'खुद को बेहतर बनाने का',
        'और अपने सपनों के करीब जाने का।'
      ],
      sub1: 'आज का छोटा प्रयास ही कल की बड़ी उपलब्धि बन सकता है।',
      sub2: 'नया दिन, नया Focus और लक्ष्य वही — Success! 💪',
      tagline: 'सवाल सीधा नहीं, सोच टेढ़ी करो!',
    },
    {
      lines: [
        'जब तक आप प्रयास करना बंद नहीं करते,',
        'तब तक आप हार नहीं सकते।',
        'सपने वो हैं जो हमें सोने नहीं देते।'
      ],
      sub1: 'निरंतर अभ्यास ही आपकी सबसे बड़ी ताकत है।',
      sub2: 'लक्ष्य पर नजर, इरादों में अटूट विश्वास! 🎯',
      tagline: 'सवाल सीधा नहीं, सोच टेढ़ी करो!',
    },
    {
      lines: [
        'ज्ञान में किया गया निवेश हमेशा',
        'सबसे अच्छा ब्याज देता है।',
        'अभ्यास ही सफलता की सीढ़ी है।'
      ],
      sub1: 'रोज़ाना 1% सुधार आपको साल में 37 गुना बेहतर बनाता है।',
      sub2: 'मेहनत खामोशी से करो, सफलता शोर मचा दे! ⚡',
      tagline: 'सवाल सीधा नहीं, सोच टेढ़ी करो!',
    },
    {
      lines: [
        'मंजिलें उन्हीं को मिलती हैं',
        'जिनके सपनों में जान होती है,',
        'हौसलों से ही आसमान में उड़ान होती है।'
      ],
      sub1: 'संघर्ष जितना कठिन होगा, जीत उतनी ही शानदार होगी।',
      sub2: 'खुद पर भरोसा रखो, तुम सब कुछ कर सकते हो! 🚀',
      tagline: 'सवाल सीधा नहीं, सोच टेढ़ी करो!',
    },
    {
      lines: [
        'सफलता का कोई शॉर्टकट नहीं होता,',
        'कड़ी मेहनत और धैर्य ही',
        'हर परीक्षा को पास करने का एकमात्र मंत्र है।'
      ],
      sub1: 'आज का कठिन परिश्रम कल के सुखद परिणाम की नींव है।',
      sub2: 'अनुशासन + निरंतरता = शत-प्रतिशत सफलता! 🏆',
      tagline: 'सवाल सीधा नहीं, सोच टेढ़ी करो!',
    },
    {
      lines: [
        'समय और शिक्षा का सही उपयोग',
        'इंसान को सफल और समर्थ बनाता है।',
        'हर दिन एक नया पाठ सीखने का संकल्प लें।'
      ],
      sub1: 'अपनी कमियों को पहचानें और उन्हें अपनी ताकत बनाएं।',
      sub2: 'मेहनत इतनी खामोशी से करो कि परिणाम गूंज उठे! 🌟',
      tagline: 'सवाल सीधा नहीं, सोच टेढ़ी करो!',
    },
    {
      lines: [
        'असंभव कुछ भी नहीं है,',
        'बस आपकी इच्छाशक्ति और सही दिशा में',
        'किया गया निरंतर प्रयास मायने रखता है।'
      ],
      sub1: 'छोटे-छोटे लक्ष्य निर्धारित करें और उन्हें प्रतिदिन हासिल करें।',
      sub2: 'अड़चनें आएंगी, पर रुकना मना है! 🔥',
      tagline: 'सवाल सीधा नहीं, सोच टेढ़ी करो!',
    },
    {
      lines: [
        'सफलता उन्हीं को मिलती है जो',
        'विपरीत परिस्थितियों में भी शांत रहकर',
        'अपने लक्ष्य की ओर बढ़ते रहते हैं।'
      ],
      sub1: 'सकारात्मक सोच और आत्मविश्वास ही आपकी ढाल है।',
      sub2: 'दृढ़ निश्चय के साथ कदम बढ़ाएं, जीत आपकी होगी! 🎯',
      tagline: 'सवाल सीधा नहीं, सोच टेढ़ी करो!',
    }
  ];

  async generateDailySuvichar(): Promise<SuvicharPost> {
    logger.info('Generating daily inspiring Suvichar caption & graphic card...');

    const now = new Date();
    const monthsHindi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
    const dateStr = `${String(now.getDate()).padStart(2, '0')} ${monthsHindi[now.getMonth()]} ${now.getFullYear()}`;

    // Deduplication logic: Check previously used indices in MongoDB / local history
    let usedIndices: number[] = [];
    try {
      const db = await getDb();
      const historyDoc = await db.collection('suvichar_history').find({}).toArray();
      usedIndices = historyDoc.map((d: any) => d.index);
    } catch {
      // ignore
    }

    // Pick a non-duplicate item
    let selectedIndex = 0;
    const poolSize = SuvicharGeneratorService.SUVICHAR_COLLECTION.length;
    for (let i = 0; i < poolSize; i++) {
      const candidateIndex = (Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000) + i) % poolSize;
      if (!usedIndices.includes(candidateIndex)) {
        selectedIndex = candidateIndex;
        break;
      }
    }

    const item = SuvicharGeneratorService.SUVICHAR_COLLECTION[selectedIndex];

    // Log selected index to DB for deduplication
    try {
      const db = await getDb();
      await db.collection('suvichar_history').insertOne({
        index: selectedIndex,
        quote: item.lines.join(' '),
        usedAt: now,
      });
    } catch {
      // ignore
    }

    // Get latest published blog link
    let latestBlogUrl = 'https://rajasthanexamtwister.in';
    try {
      const db = await getDb();
      const recentBlog = await db.collection('blogs').findOne(
        { status: 'PUBLISHED' },
        { sort: { publishedAt: -1 } }
      );
      if (recentBlog && recentBlog.canonicalUrl) {
        latestBlogUrl = recentBlog.canonicalUrl;
      }
    } catch {
      // ignore
    }

    const hashtags = [
      '#RajasthanExamTwister',
      '#SuVichar',
      '#StudyMotivation',
      '#ExamMotivation',
      '#Motivation',
      '#RajasthanGK',
      '#CompetitiveExams'
    ];

    const tweetText = `🌅 आज का सुविचार | ${dateStr}\n\n“${item.lines.join('\n')}” 🌱🔥\n\n📚 ${item.sub1}\n🎯 ${item.sub2}\n\n${item.tagline} 🧠🔥\n\n🔗 पढ़िये आज का विशेष लेख: ${latestBlogUrl}\n\n${hashtags.join(' ')}`;

    // Generate 1080x1080 Image Card using SuvicharImageService
    const imageService = new SuvicharImageService();
    const imagePath = path.join(process.cwd(), 'scratch', 'suvichar_card.png');
    await imageService.createSuvicharCard({
      dateStr,
      quoteLines: item.lines,
      subBullet1: item.sub1,
      subBullet2: item.sub2,
      tagline: item.tagline,
      outputPath: imagePath,
    });

    return {
      text: tweetText,
      imagePath,
      hashtags,
      link: latestBlogUrl,
      createdAt: now.toISOString(),
    };
  }

  /**
   * Helper to upload image to Twitter API v1.1 media upload endpoint
   */
  private async uploadMediaToX(
    imagePath: string,
    apiKey: string,
    apiSecret: string,
    accessToken: string,
    accessSecret: string
  ): Promise<string | null> {
    try {
      if (!fs.existsSync(imagePath)) return null;
      const mediaBuffer = fs.readFileSync(imagePath);
      const base64Media = mediaBuffer.toString('base64');

      const uploadEndpoint = 'https://upload.twitter.com/1.1/media/upload.json';
      const authHeader = generateOAuth1Header(
        'POST',
        uploadEndpoint,
        {},
        apiKey,
        apiSecret,
        accessToken,
        accessSecret
      );

      const params = new URLSearchParams();
      params.append('media_data', base64Media);

      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data: any = await res.json();
      if (data && data.media_id_string) {
        logger.info(`Successfully uploaded image card to X! Media ID: ${data.media_id_string}`);
        return data.media_id_string;
      }
      logger.warn(`Media upload response: ${JSON.stringify(data)}`);
      return null;
    } catch (err: any) {
      logger.warn(`Failed media upload to X: ${err?.message || err}`);
      return null;
    }
  }

  /**
   * Posts Suvichar to X (Twitter API v2) if credentials exist in process.env
   */
  async postToX(suvichar: SuvicharPost): Promise<{ success: boolean; message: string }> {
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = process.env.TWITTER_ACCESS_SECRET;

    if (!accessToken || accessToken.includes('आपकी_')) {
      logger.info('Twitter API Credentials not configured in .env. Suvichar generated and saved locally.');
      return {
        success: false,
        message: 'Twitter/X API credentials missing in .env. Generated post text & image card saved in scratch folder.',
      };
    }

    try {
      logger.info('Posting Suvichar automatically to X (Twitter API v2)...');

      const isOAuth2Token = accessToken.includes(':at:') || (accessSecret && accessSecret.includes(':rt:'));
      let mediaId: string | null = null;

      // Only attempt v1.1 media upload if using OAuth 1.0a keys
      if (!isOAuth2Token && apiKey && apiSecret && accessSecret && suvichar.imagePath) {
        mediaId = await this.uploadMediaToX(
          suvichar.imagePath,
          apiKey,
          apiSecret,
          accessToken,
          accessSecret
        );
      }

      const tweetEndpoint = 'https://api.twitter.com/2/tweets';
      let authHeader = `Bearer ${accessToken}`;

      if (!isOAuth2Token && apiKey && apiSecret && accessSecret && !apiKey.includes('आपकी_')) {
        authHeader = generateOAuth1Header('POST', tweetEndpoint, {}, apiKey, apiSecret, accessToken, accessSecret);
      }

      const tweetBody: any = {
        text: suvichar.text,
      };

      if (mediaId) {
        tweetBody.media = {
          media_ids: [mediaId],
        };
      }

      let res = await fetch(tweetEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tweetBody),
      });

      let responseData: any = await res.json();

      // If OAuth 1.0a attempt failed, retry with Bearer token
      if (!res.ok && !isOAuth2Token && accessToken) {
        logger.info('Retrying X API post with OAuth 2.0 Bearer token...');
        res = await fetch(tweetEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: suvichar.text }),
        });
        responseData = await res.json();
      }

      if (res.ok || res.status === 201) {
        logger.info(`Successfully posted Suvichar to X (Twitter)! Tweet ID: ${responseData?.data?.id || 'N/A'}`);
        return {
          success: true,
          message: `Successfully posted to X (Twitter)! Tweet ID: ${responseData?.data?.id || 'N/A'}${mediaId ? ' (with Image Card)' : ''}`,
        };
      } else {
        logger.warn(`X API response (HTTP ${res.status}): ${JSON.stringify(responseData)}`);
        return {
          success: false,
          message: `X API HTTP ${res.status}: ${responseData?.detail || responseData?.title || responseData?.error || JSON.stringify(responseData)}`,
        };
      }
    } catch (err: any) {
      logger.warn(`Failed to post to X: ${err?.message || err}`);
      return {
        success: false,
        message: `X posting notice: ${err?.message || err}`,
      };
    }
  }
}
