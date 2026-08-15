// scripts/ping-google.js
// Removed shebang line for Windows compatibility

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.centre.com.pk';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const LOG_FILE = path.join(process.cwd(), 'logs', 'seo-ping.log');

// Search engine ping URLs
const SEARCH_ENGINES = {
  google: `https://www.google.com/ping?sitemap=`,
  bing: `https://www.bing.com/ping?sitemap=`,
  yandex: `https://webmaster.yandex.com/ping?sitemap=`,
};

// Create logs directory if it doesn't exist
const logsDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

async function pingSearchEngines() {
  console.log('🚀 Pinging search engines...');
  console.log(`🔗 Sitemap URL: ${SITEMAP_URL}`);
  
  const results = {};
  const timestamp = new Date().toISOString();
  
  for (const [engine, baseUrl] of Object.entries(SEARCH_ENGINES)) {
    try {
      const pingUrl = `${baseUrl}${encodeURIComponent(SITEMAP_URL)}`;
      console.log(`\n📤 Pinging ${engine.toUpperCase()}...`);
      console.log(`   URL: ${pingUrl}`);
      
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CentersPK-SEO-Bot/1.0; +https://www.centre.com.pk/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 10000, // 10 seconds timeout
      });
      
      const status = response.status;
      const success = status >= 200 && status < 300;
      
      results[engine] = {
        success,
        status,
        timestamp,
        message: success ? 'Ping successful' : `HTTP ${status}`,
      };
      
      if (success) {
        console.log(`   ✅ Success! Status: ${status}`);
      } else {
        console.log(`   ❌ Failed! Status: ${status}`);
      }
      
    } catch (error) {
      console.error(`   💥 Error pinging ${engine}:`, error.message);
      results[engine] = {
        success: false,
        error: error.message,
        timestamp,
        message: `Error: ${error.message}`,
      };
    }
    
    // Small delay between pings to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Log results
  logResults(results, timestamp);
  
  // Print summary
  printSummary(results);
  
  return results;
}

function logResults(results, timestamp) {
  const logEntry = {
    timestamp,
    results,
    summary: {
      successful: Object.values(results).filter(r => r.success).length,
      total: Object.keys(results).length,
    },
  };
  
  const logLine = JSON.stringify(logEntry) + '\n';
  
  try {
    fs.appendFileSync(LOG_FILE, logLine);
    console.log(`\n📝 Results logged to: ${LOG_FILE}`);
  } catch (error) {
    console.error('Failed to write log file:', error.message);
  }
}

function printSummary(results) {
  console.log('\n📊 Ping Summary:');
  console.log('='.repeat(40));
  
  Object.entries(results).forEach(([engine, result]) => {
    const icon = result.success ? '✅' : '❌';
    const status = result.success ? 'SUCCESS' : 'FAILED';
    console.log(`${icon} ${engine.toUpperCase().padEnd(10)} ${status.padEnd(10)} ${result.message}`);
  });
  
  const successful = Object.values(results).filter(r => r.success).length;
  const total = Object.keys(results).length;
  const successRate = ((successful / total) * 100).toFixed(1);
  
  console.log('='.repeat(40));
  console.log(`📈 Success Rate: ${successful}/${total} (${successRate}%)`);
  
  if (successful === total) {
    console.log('🎉 All search engines pinged successfully!');
  } else if (successful > 0) {
    console.log('⚠️ Some search engines failed to ping');
  } else {
    console.log('💥 All search engine pings failed!');
  }
}

// Read recent logs
function readRecentLogs(limit = 10) {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      console.log('No log file found.');
      return [];
    }
    
    const logs = fs.readFileSync(LOG_FILE, 'utf8')
      .trim()
      .split('\n')
      .map(line => JSON.parse(line))
      .reverse()
      .slice(0, limit);
    
    return logs;
  } catch (error) {
    console.error('Error reading logs:', error.message);
    return [];
  }
}

// Show ping history
function showPingHistory(limit = 5) {
  console.log('\n📜 Recent Ping History:');
  console.log('='.repeat(60));
  
  const logs = readRecentLogs(limit);
  
  if (logs.length === 0) {
    console.log('No ping history found.');
    return;
  }
  
  logs.forEach((log, index) => {
    const date = new Date(log.timestamp).toLocaleString();
    const successful = log.summary.successful;
    const total = log.summary.total;
    const successRate = ((successful / total) * 100).toFixed(0);
    
    console.log(`\n${index + 1}. ${date}`);
    console.log(`   Success: ${successful}/${total} (${successRate}%)`);
    
    Object.entries(log.results).forEach(([engine, result]) => {
      const icon = result.success ? '✓' : '✗';
      console.log(`   ${icon} ${engine}`);
    });
  });
  
  console.log('='.repeat(60));
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--history') || args.includes('-h')) {
    const limit = parseInt(args[args.indexOf('--history') + 1] || args[args.indexOf('-h') + 1] || '5');
    showPingHistory(limit);
    process.exit(0);
  }
  
  if (args.includes('--help')) {
    console.log(`
Usage: node scripts/ping-google.js [options]

Options:
  --history, -h [limit]  Show recent ping history (default: 5)
  --help                 Show this help message
  --silent               Run silently (only output errors)
  
Examples:
  node scripts/ping-google.js           # Ping all search engines
  node scripts/ping-google.js --history # Show ping history
  node scripts/ping-google.js -h 10     # Show last 10 pings
    `);
    process.exit(0);
  }
  
  const silent = args.includes('--silent');
  
  pingSearchEngines().then(results => {
    const successful = Object.values(results).filter(r => r.success).length;
    
    if (successful === 0 && !silent) {
      console.error('\n💥 Critical: All search engine pings failed!');
      console.error('Please check your internet connection and sitemap URL.');
      process.exit(1);
    }
    
    if (!silent) {
      console.log('\n✨ Ping process completed!');
    }
    
    process.exit(0);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { pingSearchEngines, readRecentLogs, showPingHistory };