const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';
const urls = [
  '/',
  '/test-cache',
  '/api/cache/stats',
  '/api/cache/health',
  '/tools',
  '/tools/image-tools',
  '/tools/pdf-tools'
];

async function warmCache() {
  console.log(`🚀 Starting cache warmup for ${BASE_URL}`);
  console.log(`🔥 Warming ${urls.length} URLs...\n`);
  
  let success = 0;
  let failed = 0;
  
  for (const url of urls) {
    try {
      const start = Date.now();
      const response = await fetch(BASE_URL + url, {
        timeout: 5000
      });
      const duration = Date.now() - start;
      
      const cacheHeader = response.headers.get('x-cache') || 
                         response.headers.get('x-cache-hit') ||
                         response.headers.get('cf-cache-status');
      
      const cached = cacheHeader === 'HIT' || cacheHeader === 'true';
      
      if (response.ok) {
        success++;
        console.log(`✅ ${url} - ${response.status} (${duration}ms) - Cache: ${cached ? 'HIT' : 'MISS'}`);
      } else {
        failed++;
        console.log(`❌ ${url} - ${response.status} (${duration}ms)`);
      }
    } catch (error) {
      failed++;
      console.log(`⏰ ${url} - Error: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Summary:');
  console.log(`   Success: ${success}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total: ${urls.length}`);
  
  if (success > 0) {
    console.log('\n✅ Cache warmup completed!');
  } else {
    console.log('\n❌ Cache warmup failed. Make sure server is running.');
  }
}

warmCache().catch(console.error);