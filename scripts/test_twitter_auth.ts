import { generateOAuth1Header } from '../src/services/suvichar-generator.service.js';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.TWITTER_API_KEY?.trim() || '';
const apiSecret = process.env.TWITTER_API_SECRET?.trim() || '';
const accessToken = process.env.TWITTER_ACCESS_TOKEN?.trim() || '';
const accessSecret = process.env.TWITTER_ACCESS_SECRET?.trim() || '';

console.log('--- CREDENTIALS ---');
console.log('API Key:', apiKey);
console.log('API Secret:', apiSecret);
console.log('Access Token:', accessToken);
console.log('Access Secret:', accessSecret);
console.log('-------------------\n');

async function testOAuth1Post() {
  const url = 'https://api.twitter.com/2/tweets';
  const testText = `test tweet ${Date.now()}`;
  const authHeader = generateOAuth1Header('POST', url, {}, apiKey, apiSecret, accessToken, accessSecret);

  console.log('Auth Header:', authHeader);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: testText }),
  });

  console.log('Response Status:', res.status);
  const data = await res.text();
  console.log('Response Body:', data);
}

testOAuth1Post();
