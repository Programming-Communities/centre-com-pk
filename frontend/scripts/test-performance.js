// scripts/test-performance.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const isMobile = args.includes('--mobile');
const isDesktop = args.includes('--desktop');
const url = 'http://localhost:3000';

console.log('🚀 Starting Performance Tests...\n');

// Check if server is running
try {
  execSync(`curl -s -o /dev/null -w "%{http_code}" ${url}`, { stdio: 'pipe' });
} catch (error) {
  console.log('❌ Server not running. Starting development server...');
  console.log('Run: npm run build && npm start');
  console.log('Then run: npm run test:performance');
  process.exit(1);
}

// Run Lighthouse tests
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouseTest(formFactor = 'mobile') {
  console.log(`📱 Running Lighthouse test for ${formFactor}...`);
  
  const chrome = await chromeLauncher.launch({ 
    chromeFlags: ['--headless', '--no-sandbox'] 
  });
  
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    formFactor: formFactor,
    screenEmulation: formFactor === 'mobile' ? {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    } : undefined,
    throttling: formFactor === 'mobile' ? {
      rttMs: 150,
      throughputKbps: 1.6 * 1024,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150 * 3.75,
      downloadThroughputKbps: 1.6 * 1024 * 0.9,
      uploadThroughputKbps: 750 * 0.9,
    } : {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  };

  try {
    const runnerResult = await lighthouse(url, options);
    
    // Save report
    const reportFile = `lighthouse-${formFactor}-${Date.now()}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(runnerResult.lhr, null, 2));
    
    // Print scores
    const categories = runnerResult.lhr.categories;
    console.log('\n📊 Lighthouse Scores:');
    console.log('='.repeat(50));
    Object.keys(categories).forEach(category => {
      const score = categories[category].score * 100;
      const emoji = score >= 90 ? '✅' : score >= 50 ? '⚠️' : '❌';
      console.log(`${emoji} ${category.charAt(0).toUpperCase() + category.slice(1)}: ${score.toFixed(0)}`);
    });
    
    // Print metrics
    console.log('\n📈 Core Web Vitals:');
    console.log('-'.repeat(50));
    const metrics = runnerResult.lhr.audits;
    const importantMetrics = [
      'first-contentful-paint',
      'largest-contentful-paint',
      'total-blocking-time',
      'cumulative-layout-shift',
      'speed-index'
    ];
    
    importantMetrics.forEach(metric => {
      if (metrics[metric]) {
        console.log(`${metrics[metric].title}: ${metrics[metric].displayValue}`);
      }
    });
    
    console.log('\n📁 Report saved to:', reportFile);
    
    await chrome.kill();
    return runnerResult.lhr;
  } catch (error) {
    console.error('Error running Lighthouse:', error);
    await chrome.kill();
    return null;
  }
}

async function runAllTests() {
  if (isMobile) {
    await runLighthouseTest('mobile');
  } else if (isDesktop) {
    await runLighthouseTest('desktop');
  } else {
    console.log('Running both mobile and desktop tests...\n');
    await runLighthouseTest('mobile');
    console.log('\n' + '='.repeat(50) + '\n');
    await runLighthouseTest('desktop');
  }
}

runAllTests();