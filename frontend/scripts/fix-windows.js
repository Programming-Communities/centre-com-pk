const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Windows Cache System Fix...');
console.log('='.repeat(50));

try {
  // 1. Create Windows-compatible package.json scripts
  console.log('\n📌 Updating package.json scripts for Windows...');
  
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Update scripts for Windows compatibility
  packageJson.scripts = {
    ...packageJson.scripts,
    "clear-cache-windows": "if exist .next rmdir /s /q .next && if exist node_modules\\.cache rmdir /s /q node_modules\\.cache",
    "kill-ports-windows": "for /f \"tokens=5\" %i in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %i",
    "full-reset-windows": "npm run kill-ports-windows && npm run clear-cache-windows && npm run dev",
    "cache:stats": "curl http://localhost:3000/api/cache/stats",
    "cache:health": "curl http://localhost:3000/api/cache/health",
    "cache:clear": "curl -X DELETE http://localhost:3000/api/cache"
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json with Windows scripts');
  
  // 2. Create basic warm-cache.js if missing
  console.log('\n📌 Creating warm-cache.js script...');
  const warmCacheScript = `const fetch = require('node-fetch');

async function warmCache() {
  const urls = [
    '/',
    '/test-cache',
    '/api/cache/stats',
    '/api/cache/health'
  ];
  
  console.log('🔥 Warming cache for ' + urls.length + ' URLs');
  
  for (const url of urls) {
    try {
      const response = await fetch('http://localhost:3000' + url);
      console.log(\`✅ \${url} - \${response.status}\`);
    } catch (error) {
      console.log(\`❌ \${url} - \${error.message}\`);
    }
  }
}

warmCache();`;
  
  const warmCachePath = path.join(__dirname, 'warm-cache.js');
  fs.writeFileSync(warmCachePath, warmCacheScript);
  console.log('✅ Created warm-cache.js');
  
  // 3. Create test-compression.js if missing
  console.log('\n📌 Creating test-compression.js script...');
  const testCompressionScript = `const http = require('http');

async function testCompression() {
  console.log('🔧 Testing compression...');
  
  const urls = ['/', '/test-cache'];
  
  for (const url of urls) {
    http.get('http://localhost:3000' + url, (res) => {
      const encoding = res.headers['content-encoding'];
      console.log(\`\${url}: \${encoding ? '✅ ' + encoding : '❌ No compression'}\`);
    }).on('error', () => {
      console.log(\`\${url}: ❌ Connection failed\`);
    });
  }
}

// Wait 2 seconds for server to start
setTimeout(testCompression, 2000);`;
  
  const testCompressionPath = path.join(__dirname, 'test-compression.js');
  fs.writeFileSync(testCompressionPath, testCompressionScript);
  console.log('✅ Created test-compression.js');
  
  // 4. Install node-fetch if needed
  console.log('\n📌 Installing required dependencies...');
  try {
    execSync('npm list node-fetch', { stdio: 'ignore' });
    console.log('✅ node-fetch already installed');
  } catch {
    console.log('📦 Installing node-fetch...');
    execSync('npm install node-fetch', { stdio: 'inherit' });
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Windows fix completed!');
  console.log('\n📋 Available commands:');
  console.log('npm run clear-cache-windows   - Clear cache (Windows)');
  console.log('npm run kill-ports-windows    - Kill port 3000 (Windows)');
  console.log('npm run full-reset-windows    - Full reset (Windows)');
  console.log('npm run warm:cache           - Warm up cache');
  console.log('npm run test:compression     - Test compression');
  console.log('npm run cache:stats          - Get cache stats');
  console.log('npm run dev                  - Start dev server');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
}