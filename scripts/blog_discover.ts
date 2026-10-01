import { TopicDiscoveryService } from '../src/services/topic-discovery.service.js';

async function main() {
  const discovery = new TopicDiscoveryService();
  const topics = await discovery.discoverTrendingTopics();

  console.log('\n================ AUTONOMOUS TOPIC DISCOVERY REPORT ================');
  console.log(`Discovered ${topics.length} potential high-utility exam topics:\n`);

  topics.forEach((t, idx) => {
    console.log(`[#${idx + 1}] Score: ${t.score}/100 | Type: ${t.articleType}`);
    console.log(`  Topic: ${t.topic}`);
    console.log(`  Target Exams: ${t.targetExam.join(', ')}`);
    console.log(`  Category: ${t.categorySuggestion}`);
    console.log(`  Selection Reason: ${t.selectionReason}`);
    console.log(`  Search Volume: ${t.searchVolume}`);
    console.log('--------------------------------------------------------------------');
  });
  console.log('====================================================================\n');
}

main();
