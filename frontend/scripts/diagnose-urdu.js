// scripts/diagnose-urdu.js
const http = require('http');

console.log('🔍 URDU REDIRECT DIAGNOSTIC TOOL\n');
console.log('Testing: http://localhost:3000/ur\n');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/ur',
  method: 'GET',
  followRedirect: false  // CRITICAL - don't follow redirects!
};

const req = http.request(options, (res) => {
  console.log('📊 RESPONSE:');
  console.log(`  Status Code: ${res.statusCode}`);
  console.log(`  Status Message: ${res.statusMessage}`);
  console.log(`  Headers:`, res.headers);
  
  if (res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
    console.log('\n🚨 REDIRECT DETECTED!');
    console.log(`  Location: ${res.headers.location}`);
    console.log('\n❌ PROBLEM: Kahi na kahi /ur redirect ho raha hai!');
    console.log('\n🔍 CHECK THESE FILES:');
    console.log('   1. proxy.ts');
    console.log('   2. next.config.js (redirects)');
    console.log('   3. middleware.ts (agar hai)');
  } else if (res.statusCode === 200) {
    console.log('\n✅ SUCCESS! /ur correctly renders!');
  }
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (data) console.log(`\nResponse body length: ${data.length} chars`);
  });
});

req.on('error', (e) => {
  console.error('❌ ERROR:', e.message);
});

req.end();