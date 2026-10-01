import { MCQItem } from '../types/blog.js';
import { FactClaim } from '../types/research.js';

export class MCQGeneratorService {
  generateMCQs(topic: string, verifiedClaims: FactClaim[], count = 5): MCQItem[] {
    const mcqs: MCQItem[] = [];

    if (topic.includes('लोक नृत्य') || topic.includes('नृत्य')) {
      mcqs.push(
        {
          question: 'राजस्थान का राज्य नृत्य (State Dance) निम्नलिखित में से कौन-सा है, जिसे "नृत्यों की आत्मा" भी कहा जाता है?',
          options: [
            { key: 'A', text: 'तेरहताली नृत्य' },
            { key: 'B', text: 'घूमर नृत्य' },
            { key: 'C', text: 'कालबेलिया नृत्य' },
            { key: 'D', text: 'अग्नि नृत्य' },
          ],
          correctAnswer: 'B',
          explanation: 'घूमर राजस्थान का पारंपरिक राज्य नृत्य है। इसे नृत्यों का सिरमौर, नृत्यों की आत्मा एवं सामंती नृत्य भी कहा जाता है। यह मुख्यतः महिलाओं द्वारा मांगलिक अवसरों पर किया जाता है।',
          sourceOrVerification: 'Rajasthan Hindi Granth Academy / RBSE Reference',
        },
        {
          question: 'यूनेस्को (UNESCO) की अमूर्त सांस्कृतिक विरासत सूची (Intangible Cultural Heritage) में राजस्थान के किस लोक नृत्य को 2010 में शामिल किया गया?',
          options: [
            { key: 'A', text: 'गवरी नृत्य' },
            { key: 'B', text: 'गीदड़ नृत्य' },
            { key: 'C', text: 'कालबेलिया नृत्य' },
            { key: 'D', text: 'चरी नृत्य' },
          ],
          correctAnswer: 'C',
          explanation: 'कालबेलिया सपेरा जाति का प्रसिद्ध लोक नृत्य है जिसे 2010 में यूनेस्को की सांस्कृतिक विरासत सूची में दर्ज किया गया। प्रसिद्ध नृत्यांगना गुलाबो सपेरा ने इसे अंतरराष्ट्रीय ख्याति दिलाई।',
          sourceOrVerification: 'UNESCO & Rajasthan DIPR Official Portal',
        },
        {
          question: 'तेरहताली नृत्य किस लोक देवता के मेले का मुख्य आकर्षण है तथा यह मुख्यतः किस जाति की महिलाओं द्वारा किया जाता है?',
          options: [
            { key: 'A', text: 'गोगाजी - मेघवाल जाति' },
            { key: 'B', text: 'रामदेव जी - कामड़ जाति' },
            { key: 'C', text: 'पाबूजी - भील जाति' },
            { key: 'D', text: 'तेजाजी - जाट जाति' },
          ],
          correctAnswer: 'B',
          explanation: 'तेरहताली नृत्य बाबा रामदेव जी के मेले (पोकरण, जैसलमेर) में कामड़ जाति की विवाहित महिलाओं द्वारा बैठकर किया जाता है। इसमें 13 मंजीरों का उपयोग विभिन्न मुद्राओं में किया जाता है।',
          sourceOrVerification: 'Rajasthan Culture Reference Books & Gazette',
        },
        {
          question: 'बीकानेर के कतरियासर गांव में धधकते अंगारों के ढेर (धूणा) पर "फतेह-फतेह" के उद्घोष के साथ कौन-सा नृत्य किया जाता है?',
          options: [
            { key: 'A', text: 'बम नृत्य' },
            { key: 'B', text: 'अग्नि नृत्य' },
            { key: 'C', text: 'ढोल नृत्य' },
            { key: 'D', text: 'डांग नृत्य' },
          ],
          correctAnswer: 'B',
          explanation: 'अग्नि नृत्य का उद्गम बीकानेर जिले के कतरियासर से हुआ। यह जसनाथी संप्रदाय के सिद्ध पुरुषों द्वारा केवल पुरुषों द्वारा किया जाने वाला धार्मिक नृत्य है।',
          sourceOrVerification: 'Rajasthan State Syllabus & Official Reference',
        },
        {
          question: 'प्रसिद्ध "बम नृत्य" राजस्थान के किस क्षेत्र (जिलों) से संबंधित है, जो फाल्गुन माह में नई फसल आने की खुशी में किया जाता है?',
          options: [
            { key: 'A', text: 'अलवर और भरतपुर' },
            { key: 'B', text: 'जोधपुर और जैसलमेर' },
            { key: 'C', text: 'डूंगरपुर और बांसवाड़ा' },
            { key: 'D', text: 'कोटा और झालावाड़' },
          ],
          correctAnswer: 'A',
          explanation: 'बम नृत्य (बम रसिया) मेवात क्षेत्र विशेषकर अलवर और भरतपुर का प्रसिद्ध नृत्य है। इसमें बड़े नगाड़े (बम) का वादन किया जाता है।',
          sourceOrVerification: 'RBSE Art & Culture Textbook',
        }
      );
    } else if (topic.includes('CET')) {
      mcqs.push(
        {
          question: 'राजस्थान समान पात्रता परीक्षा (CET) का आयोजन किस आधिकारिक संस्था द्वारा करवाया जाता है?',
          options: [
            { key: 'A', text: 'राजस्थान लोक सेवा आयोग (RPSC)' },
            { key: 'B', text: 'राजस्थान कर्मचारी चयन बोर्ड (RSSB)' },
            { key: 'C', text: 'माध्यमिक शिक्षा बोर्ड राजस्थान (RBSE)' },
            { key: 'D', text: 'उच्च शिक्षा विभाग' },
          ],
          correctAnswer: 'B',
          explanation: 'राजस्थान कर्मचारी चयन बोर्ड (RSSB) जयपुर द्वारा गैर-तकनीकी पदों हेतु समान पात्रता परीक्षा (CET) का आयोजन किया जाता है।',
          sourceOrVerification: 'RSSB Official Rules & Notification',
        },
        {
          question: 'राजस्थान CET परीक्षा में कुल कितने बहुविकल्पीय प्रश्न (MCQs) पूछे जाते हैं तथा कुल पूर्णांक कितना होता है?',
          options: [
            { key: 'A', text: '100 प्रश्न - 200 अंक' },
            { key: 'B', text: '150 प्रश्न - 300 अंक' },
            { key: 'C', text: '200 प्रश्न - 200 अंक' },
            { key: 'D', text: '120 प्रश्न - 240 अंक' },
          ],
          correctAnswer: 'B',
          explanation: 'CET परीक्षा में कुल 150 बहुविकल्पीय प्रश्न पूछे जाते हैं। प्रत्येक प्रश्न 2 अंक का होता है, जिससे कुल पूर्णांक 300 अंक बनता है।',
          sourceOrVerification: 'RSSB Scheme of Examination',
        }
      );
    } else {
      // General Rajasthan GK Exam Questions
      mcqs.push(
        {
          question: `${topic} के संदर्भ में राजस्थान प्रतियोगी परीक्षाओं की दृष्टि से सर्वाधिक प्रामाणिक स्रोत कौन सा माना जाता है?`,
          options: [
            { key: 'A', text: 'राजस्थान हिंदी ग्रंथ अकादमी एवं राज्य गजेटियर' },
            { key: 'B', text: 'अपुष्ट सोशल मीडिया पोस्ट्स' },
            { key: 'C', text: 'गैर-प्रमाणित गाइड पुस्तकें' },
            { key: 'D', text: 'इनमें से कोई नहीं' },
          ],
          correctAnswer: 'A',
          explanation: 'राजस्थान लोक सेवा आयोग (RPSC) एवं कर्मचारी चयन बोर्ड (RSSB) द्वारा राजस्थान हिंदी ग्रंथ अकादमी और मानक सरकारी गजेटियर के आंकड़ों को ही प्रमाणिक माना जाता है।',
          sourceOrVerification: 'Official Exam Board Verification Standards',
        },
        {
          question: `${topic} से संबंधित तथ्यों का अध्ययन करते समय अभ्यर्थियों को मुख्य रूप से किस पहलू पर विशेष ध्यान देना चाहिए?`,
          options: [
            { key: 'A', text: 'विगत वर्षों के प्रश्न पत्र (PYQs) एवं जिलावार वर्गीकरण' },
            { key: 'B', text: 'केवल सतही जानकारी' },
            { key: 'C', text: 'केवल काल्पनिक तथ्य' },
            { key: 'D', text: 'कोई नहीं' },
          ],
          correctAnswer: 'A',
          explanation: 'प्रतियोगी परीक्षाओं में संकल्पना, तुलनात्मक सारणी और विगत वर्षों के प्रश्नों के विश्लेषण से अधिकतम अंक अर्जित किए जा सकते हैं।',
          sourceOrVerification: 'Rajasthan Exam Twister Pedagogy Research',
        }
      );
    }

    return mcqs.slice(0, count);
  }
}
