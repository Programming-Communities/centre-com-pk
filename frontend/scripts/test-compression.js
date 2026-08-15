const http = require('http');

const urls = ['/', '/test-cache', '/api/cache/stats'];

function testUrl(url) {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000' + url, (res) => {
      const encoding = res.headers['content-encoding'] || 'none';
      const contentType = res.headers['content-type'] || 'unknown';
      const contentLength = res.headers['content-length'] || 'unknown';
      
      resolve({
        url,
        encoding,
        contentType,
        contentLength,
        success: true
      });
      
      // Drain response
      res.on('data', () => {});
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        error: error.message,
        success: false
      });
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve({
        url,
        error: 'Timeout',
        success: false
      });
    });
  });
}

async function testCompression() {
  console.log('🔧 Testing compression for http://localhost:3000\n');
  
  const results = [];
  
  for (const url of urls) {
    const result = await testUrl(url);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${url}`);
      console.log(`   Encoding: ${result.encoding}`);
      console.log(`   Type: ${result.contentType}`);
      console.log(`   Size: ${result.contentLength} bytes\n`);
    } else {
      console.log(`❌ ${url} - ${result.error}\n`);
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Summary
  const successful = results.filter(r => r.success);
  const withCompression = successful.filter(r => r.encoding !== 'none');
  
  console.log('📊 Summary:');
  console.log(`   URLs tested: ${results.length}`);
  console.log(`   Successful: ${successful.length}`);
  console.log(`   With compression: ${withCompression.length}`);
  
  if (withCompression.length === successful.length && successful.length > 0) {
    console.log('\n✅ Compression is working correctly!');
  } else if (successful.length > 0) {
    console.log('\n⚠️ Some URLs are not compressed');
    console.log('   Check next.config.js compression settings');
  } else {
    console.log('\n❌ No URLs could be tested');
    console.log('   Make sure server is running: npm run dev');
  }
}

// Run test
testCompression();