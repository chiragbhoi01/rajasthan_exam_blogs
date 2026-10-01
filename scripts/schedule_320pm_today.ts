import { getDb, closeDb } from '../src/lib/mongodb.js';
import { logger } from '../src/lib/logger.js';
import { IndexingService } from '../src/services/indexing.service.js';

async function schedule320pmBlog() {
  logger.info('=======================================================');
  logger.info('Scheduling Today 3:20 PM IST Special Blog Document');
  logger.info('=======================================================');

  const db = await getDb();

  // Set target published time to exactly 3:20 PM IST today (Oct 2, 2026)
  const targetTime = new Date();
  targetTime.setHours(15, 20, 0, 0); // 3:20 PM IST

  const title = 'राजस्थान प्रतियोगी परीक्षा 2026: 3:20 PM विशेष लाइव स्टडी गाइड व परीक्षा रणनीति';
  const slug = `rajasthan-exam-special-320pm-guide-2026-${Date.now()}`;
  const canonicalUrl = `https://rajasthanexamtwister.in/blogs/${slug}`;

  const content = `
    <article class="prose max-w-none">
      <h1>${title}</h1>
      <p>राजस्थान राज्य स्तरीय प्रतियोगी परीक्षाओं (RPSC RAS, REET, Rajasthan Police, Patwari, CET 2026) की तैयारी कर रहे अभ्यर्थियों के लिए आज का 3:20 PM विशेष लाइव स्टडी गाइड जारी कर दिया गया है।</p>
      
      <h2>1. परीक्षा दृष्टि से प्रमुख बिंदु</h2>
      <p>राजस्थान प्रतियोगी परीक्षाओं में राजस्थान सामान्य ज्ञान (GK), इतिहास, कला-संस्कृति एवं सामयिकी का विशेष वेटेज रहता है।</p>

      <h2>2. महत्वपूर्ण तथ्य सारणी</h2>
      <table class="table-auto w-full border-collapse border border-slate-400 my-4">
        <thead>
          <tr class="bg-slate-100">
            <th class="border border-slate-300 p-2">विषय क्षेत्र</th>
            <th class="border border-slate-300 p-2">प्रामाणिक स्रोत</th>
            <th class="border border-slate-300 p-2">वेटेज (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-300 p-2">राजस्थान इतिहास व संस्कृति</td>
            <td class="border border-slate-300 p-2">हिंदी ग्रंथ अकादमी</td>
            <td class="border border-slate-300 p-2">35%</td>
          </tr>
          <tr>
            <td class="border border-slate-300 p-2">राजस्थान का भूगोल (50 जिले)</td>
            <td class="border border-slate-300 p-2">राजस्व विभाग गजेटियर</td>
            <td class="border border-slate-300 p-2">30%</td>
          </tr>
        </tbody>
      </table>

      <h2>3. अभ्यास हेतु महत्वपूर्ण MCQs</h2>
      <div class="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200">
        <p class="font-bold">प्रश्न 1: राजस्थान के नवीन 50 जिलों की घोषणा किस समिति की सिफारिश पर की गई थी?</p>
        <p>(A) बी.आर. मेहता समिति<br/>(B) रामलुभाया समिति<br/>(C) परमेश चंद समिति<br/>(D) शिवचरण माथुर आयोग</p>
        <p class="text-green-700 font-semibold mt-2">सही उत्तर: (B) रामलुभाया समिति</p>
      </div>

      <h2>4. अक्सर पूछे जाने वाले प्रश्न (FAQs)</h2>
      <div class="my-4">
        <p class="font-bold">Q1: इस स्टडी गाइड का मुख्य उद्देश्य क्या है?</p>
        <p>Ans: राजस्थान की आगामी भर्ती परीक्षाओं के अभ्यर्थियों को सटीक, प्रामाणिक और त्वरित अध्ययन सामग्री उपलब्ध कराना।</p>
      </div>
    </article>
  `;

  const doc = {
    title,
    slug,
    excerpt: 'राजस्थान प्रतियोगी परीक्षा 2026 हेतु आज 3:20 PM विशेष लाइव शेड्यूल्ड स्टडी गाइड व परीक्षा रणनीति।',
    content,
    status: 'PUBLISHED',
    metaTitle: title,
    metaDescription: 'राजस्थान प्रतियोगी परीक्षा 2026 हेतु आज 3:20 PM विशेष लाइव शेड्यूल्ड स्टडी गाइड व परीक्षा रणनीति।',
    canonicalUrl,
    readingTime: 6,
    featured: true,
    author: 'Rajasthan Exam Twister Editorial Team',
    articleType: 'STUDY_GUIDE',
    primaryKeyword: 'Rajasthan Exam 3:20 PM Special Guide',
    faqs: [
      {
        question: 'इस स्टडी गाइड का मुख्य उद्देश्य क्या है?',
        answer: 'राजस्थान की आगामी भर्ती परीक्षाओं के अभ्यर्थियों को सटीक, प्रामाणिक और त्वरित अध्ययन सामग्री उपलब्ध कराना।'
      }
    ],
    mcqs: [
      {
        question: 'राजस्थान के नवीन 50 जिलों की घोषणा किस समिति की सिफारिश पर की गई थी?',
        options: [
          { key: 'A', text: 'बी.आर. मेहता समिति' },
          { key: 'B', text: 'रामलुभाया समिति' },
          { key: 'C', text: 'परमेश चंद समिति' },
          { key: 'D', text: 'शिवचरण माथुर आयोग' }
        ],
        correctAnswer: 'B',
        explanation: 'रामलुभाया समिति की सिफारिश पर राजस्थान में नवीन जिलों का गठन किया गया था।',
        sourceOrVerification: 'राजस्व विभाग राजस्थान'
      }
    ],
    publishedAt: targetTime,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('blogs').insertOne(doc as any);

  // Ping Search Engines IndexNow
  try {
    const indexingService = new IndexingService();
    await indexingService.pingSearchEngines(canonicalUrl);
  } catch {
    // ignore
  }

  console.log('\n=======================================================');
  console.log(`✅ SPECIAL TODAY 3:20 PM IST BLOG SCHEDULED SUCCESSFULLY!`);
  console.log(`Title: "${doc.title}"`);
  console.log(`Slug: ${doc.slug}`);
  console.log(`Scheduled Live Date/Time: ${targetTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  console.log(`Canonical URL: ${doc.canonicalUrl}`);
  console.log(`MongoDB Document ID: ${result.insertedId}`);
  console.log('=======================================================\n');

  await closeDb();
}

schedule320pmBlog();
