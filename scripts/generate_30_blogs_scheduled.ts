import { BlogAutomationPipeline } from '../src/services/pipeline.service.js';
import { getDb, closeDb } from '../src/lib/mongodb.js';
import { logger } from '../src/lib/logger.js';

const SCHEDULED_TOPICS = [
  {
    topic: 'CET Senior Secondary Exam 2026: विस्तृत परीक्षा पैटर्न, सिलेबस व तैयारी रणनीति',
    primaryKeyword: 'CET Senior Secondary 2026',
    articleType: 'STUDY_GUIDE',
  },
  {
    topic: 'Rajasthan Police Constable 2026: 3500+ पदों हेतु शारीरिक दक्षता, लिखित परीक्षा गाइड',
    primaryKeyword: 'Rajasthan Police Constable 2026',
    articleType: 'EXAM_UPDATE',
  },
  {
    topic: 'REET Level 1 & Level 2 2026: पात्रता परीक्षा, नया पाठ्यक्रम व अंक विभाजन',
    primaryKeyword: 'REET Exam 2026',
    articleType: 'STUDY_GUIDE',
  },
  {
    topic: 'Rajasthan High Court LDC 2026: टाइपिंग टेस्ट, हिंदी-अंग्रेजी व्याकरण गाइड',
    primaryKeyword: 'Rajasthan High Court LDC 2026',
    articleType: 'STUDY_GUIDE',
  },
  {
    topic: 'Rajasthan Sub Inspector (SI) 2026: दो पेपर रणनीति, हिंदी व्याकरण व जीके',
    primaryKeyword: 'Rajasthan SI Exam 2026',
    articleType: 'STUDY_GUIDE',
  },
  {
    topic: 'Rajasthan Sanganak & Computer Teacher 2026: विस्तृत पाठ्यक्रम व बुक लिस्ट',
    primaryKeyword: 'Rajasthan Sanganak 2026',
    articleType: 'EXAM_UPDATE',
  },
  {
    topic: 'RPSC 2nd Grade Teacher 2026: प्रथम प्रश्न पत्र जीके व विषयवार अंक योजना',
    primaryKeyword: 'RPSC 2nd Grade Syllabus 2026',
    articleType: 'STUDY_GUIDE',
  },
  {
    topic: 'Rajasthan Animal Attendant (पशु परिचर) 2026: पार्ट-बी पशुपालन विशेष गाइड',
    primaryKeyword: 'Pashu Parichar Exam 2026',
    articleType: 'STUDY_GUIDE',
  },
  {
    topic: 'Rajasthan Geography: नवीन 50 जिलों अनुसार नदियाँ, झीलें व जल सम्पादित तथ्य',
    primaryKeyword: 'Rajasthan New Geography 50 Districts',
    articleType: 'RAJASTHAN_GK',
  },
  {
    topic: 'Rajasthan History: दुर्ग, किले, महल व स्थापत्य कला की संपूर्ण प्रामाणिक जानकारी',
    primaryKeyword: 'Rajasthan Forts and Palaces',
    articleType: 'RAJASTHAN_GK',
  },
  {
    topic: 'Rajasthan Fairs & Festivals: राजस्थान के प्रमुख मेले, त्योहार एवं सांस्कृतिक परंपराएं',
    primaryKeyword: 'Rajasthan Mele aur Tyohar',
    articleType: 'RAJASTHAN_GK',
  },
  {
    topic: 'Rajasthan Prajamandal Movement: प्रमुख स्वतंत्रता सेनानी एवं जन जागृति',
    primaryKeyword: 'Rajasthan Prajamandal Andolan',
    articleType: 'STATIC_GK',
  },
  {
    topic: 'RPSC 1st Grade School Lecturer 2026: प्रथम प्रश्न पत्र सामान्य ज्ञान व शैक्षणिक प्रबंधन',
    primaryKeyword: 'RPSC 1st Grade Syllabus 2026',
    articleType: 'STUDY_GUIDE',
  },
  {
    topic: 'RSSB Gram Vikas Adhikari (VDO) 2026: मुख्य परीक्षा पैटर्न व राजस्थान की अर्थव्यवस्था',
    primaryKeyword: 'RSSB VDO Exam 2026',
    articleType: 'EXAM_UPDATE',
  },
  {
    topic: 'Rajasthan Revenue Officer (RO/EO) Exam: नगर पालिका अधिनियम 2009 एवं योजनाएं',
    primaryKeyword: 'Rajasthan RO EO Exam 2026',
    articleType: 'STUDY_GUIDE',
  },
  {
    topic: 'Rajasthan Agriculture Supervisor: उद्यानिकी, शस्य विज्ञान व पशुपालन विशेष गाइड',
    primaryKeyword: 'Rajasthan Krishi Supervisor 2026',
    articleType: 'STUDY_GUIDE',
  },
  {
    topic: 'Rajasthan Lab Assistant 2026: विज्ञान एवं भूगोल वर्ग हेतु संपूर्ण पाठ्यक्रम',
    primaryKeyword: 'Rajasthan Lab Assistant Exam 2026',
    articleType: 'STUDY_GUIDE',
  },
  {
    topic: 'Rajasthan Women Supervisor (महिला पर्यवेक्षक): महिला एवं बाल विकास योजनाएं',
    primaryKeyword: 'Rajasthan Mahila Supervisor 2026',
    articleType: 'EXAM_UPDATE',
  },
  {
    topic: 'Rajasthan Cooperative Bank Recruitment 2026: बैंकिंग प्रणाली एवं राजस्थान जीके',
    primaryKeyword: 'Rajasthan Apex Bank Recruitment 2026',
    articleType: 'EXAM_UPDATE',
  },
  {
    topic: 'Rajasthan ITI Instructor & Technical Assistant: तकनीकी योग्यता एवं परीक्षा गाइड',
    primaryKeyword: 'Rajasthan ITI Instructor 2026',
    articleType: 'EXAM_UPDATE',
  },
  {
    topic: 'Rajasthan General Knowledge Top 100 MCQs: परीक्षा में बार-बार पूछे जाने वाले प्रश्न',
    primaryKeyword: 'Rajasthan GK Top 100 MCQs',
    articleType: 'STATIC_GK',
  },
  {
    topic: 'Mewar Dynasty & Maharana Pratap: मेवाड़ का इतिहास, हल्दीघाटी युद्ध व गौरवशाली परंपरा',
    primaryKeyword: 'Mewar History Maharana Pratap',
    articleType: 'STATIC_GK',
  },
  {
    topic: 'Marwar Dynasty & Rathore Rulers: मारवाड़ का इतिहास, राव जोधा व दुर्गादास राठौड़',
    primaryKeyword: 'Marwar History Rathore Dynasty',
    articleType: 'STATIC_GK',
  },
  {
    topic: 'Jaipur Kachhwaha Dynasty: आमेर व जयपुर का इतिहास, मानसिंह व सवाई जयसिंह',
    primaryKeyword: 'Jaipur Kachhwaha Dynasty History',
    articleType: 'STATIC_GK',
  },
  {
    topic: 'Rajasthan Saints & Sects: राजस्थान के लोक संत, सम्प्रदाय एवं उनकी शिक्षाएं',
    primaryKeyword: 'Rajasthan Lok Sant Sampraday',
    articleType: 'RAJASTHAN_GK',
  },
  {
    topic: 'Rajasthan Handicrafts & Arts: मथेरना कला, उस्ता कला, थेवा कला व ब्लू पॉटरी',
    primaryKeyword: 'Rajasthan Hastkala Blue Pottery Usta Kala',
    articleType: 'RAJASTHAN_GK',
  },
  {
    topic: 'Rajasthan Wildlife Sanctuaries & National Parks: राष्ट्रीय उद्यान व टाइगर रिजर्व',
    primaryKeyword: 'Rajasthan National Parks Wildlife Sanctuaries',
    articleType: 'RAJASTHAN_GK',
  },
  {
    topic: 'Rajasthan Irrigation Projects & Dams: इंदिरा गांधी नहर, चंबल व बीसलपुर परियोजना',
    primaryKeyword: 'Rajasthan Irrigation Projects IGNP Bisalpur',
    articleType: 'RAJASTHAN_GK',
  },
  {
    topic: 'Rajasthan Economic Review (आर्थिक समीक्षा) Highlights: कृषि व उद्योग विशेष आंकड़े',
    primaryKeyword: 'Rajasthan Economic Review 2026 Highlights',
    articleType: 'CURRENT_AFFAIRS',
  },
  {
    topic: 'Rajasthan Current Affairs 2026 Special Digest: प्रमुख योजनाएं, पुरस्कार व खेलकूद',
    primaryKeyword: 'Rajasthan Current Affairs 2026 Digest',
    articleType: 'CURRENT_AFFAIRS',
  }
];

async function main() {
  logger.info('=======================================================');
  logger.info('Generating & Scheduling 30 High-Quality Blogs for 30 Days');
  logger.info('=======================================================');

  const pipeline = new BlogAutomationPipeline();
  const db = await getDb();

  const now = new Date();
  let successCount = 0;

  for (let i = 0; i < SCHEDULED_TOPICS.length; i++) {
    const item = SCHEDULED_TOPICS[i];
    const dayOffset = i + 1; // Starting tomorrow (Day 1 to Day 30)
    
    // Scheduled publication time at 7:00 AM IST (01:30 UTC) each day
    const scheduledDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, 7, 0, 0);

    logger.info(`\n[${i + 1}/30] Generating blog for Day ${dayOffset} (${scheduledDate.toDateString()} 07:00 AM IST)...`);
    logger.info(`Topic: "${item.topic}"`);

    try {
      const result = await pipeline.runPipeline({
        customTopic: item.topic,
        customKeyword: item.primaryKeyword,
        dryRun: false,
      });

      if (result.success && result.blogDraft && result.blogDraft._id) {
        const blogId = result.blogDraft._id;

        // Schedule blog in MongoDB Atlas with PUBLISHED status & future publishedAt timestamp
        await db.collection('blogs').updateOne(
          { _id: blogId },
          {
            $set: {
              status: 'PUBLISHED',
              publishedAt: scheduledDate,
              updatedAt: new Date(),
            }
          }
        );

        successCount++;
        logger.info(`✅ Day ${dayOffset} Blog Scheduled! ID: ${blogId} | Title: "${result.blogDraft.title}" | Scheduled For: ${scheduledDate.toISOString()}`);
      } else {
        logger.warn(`❌ Day ${dayOffset} Blog generation failed: ${result.errors?.join(', ')}`);
      }
    } catch (err: any) {
      logger.error(`Error generating blog #${i + 1}: ${err?.message || err}`);
    }
  }

  logger.info('\n=======================================================');
  logger.info(`BATCH SCHEDULING COMPLETE! ${successCount}/30 Blogs Generated & Scheduled Successfully.`);
  logger.info('=======================================================');

  await closeDb();
}

main();
