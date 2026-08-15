// Quick ranking check script
// scripts/check-ranking.js
const axios = require('axios');

const toolsToCheck = [
  'age-calculator',
  'bmi-calculator', 
  'currency-converter',
  'password-generator'
];

async function checkGoogleRanking() {
  console.log('🔍 Checking Google Rankings...');
  
  for (const tool of toolsToCheck) {
    const url = `https://www.centre.com.pk/tools/calculators/${tool}`;
    try {
      // Check if indexed
      const googleCheck = `https://www.google.com/search?q=site:${url}`;
      console.log(`Checking: ${tool}`);
      // Simulate check - we'll implement real check
    } catch (error) {
      console.error(`Error checking ${tool}:`, error.message);
    }
  }
}

checkGoogleRanking();