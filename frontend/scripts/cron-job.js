// scripts/cron-job.js
// Removed shebang line for Windows compatibility

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Configuration
const LOG_DIR = path.join(process.cwd(), 'logs', 'cron');
const CRON_LOG = path.join(LOG_DIR, 'cron-job.log');
const ERROR_LOG = path.join(LOG_DIR, 'cron-errors.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Tasks configuration
const TASKS = {
  // Generate sitemap every day at 2 AM
  generateSitemap: {
    schedule: '0 2 * * *', // 2 AM daily
    command: 'node scripts/generate-sitemap.js',
    description: 'Generate sitemap.xml and robots.txt',
  },
  
  // Ping Google every 6 hours
  pingSearchEngines: {
    schedule: '0 */6 * * *', // Every 6 hours
    command: 'node scripts/ping-google.js --silent',
    description: 'Ping search engines with sitemap',
  },
  
  // Update SEO data every week on Monday at 3 AM
  updateSEOData: {
    schedule: '0 3 * * 1', // 3 AM every Monday
    command: 'node scripts/update-seo-data.js --analyze',
    description: 'Analyze and update SEO data',
  },
  
  // Backup SEO data every day at 4 AM
  backupSEOData: {
    schedule: '0 4 * * *', // 4 AM daily
    command: 'node scripts/update-seo-data.js --backup',
    description: 'Create backup of SEO data',
  },
  
  // Check for broken links every Sunday at 5 AM
  checkBrokenLinks: {
    schedule: '0 5 * * 0', // 5 AM every Sunday
    command: 'echo "Broken link checker would run here"',
    description: 'Check for broken links (placeholder)',
  },
  
  // Performance check every day at 6 AM
  performanceCheck: {
    schedule: '0 6 * * *', // 6 AM daily
    command: 'echo "Performance check would run here"',
    description: 'Check website performance (placeholder)',
  },
};

// Logging functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;
  
  // Write to combined log
  fs.appendFileSync(CRON_LOG, logMessage);
  
  // Write to error log if it's an error
  if (type === 'error') {
    fs.appendFileSync(ERROR_LOG, logMessage);
  }
  
  // Also log to console in development
  if (process.env.NODE_ENV !== 'production') {
    const color = type === 'error' ? '\x1b[31m' : '\x1b[32m';
    const reset = '\x1b[0m';
    console.log(`${color}[${type.toUpperCase()}]${reset} ${message}`);
  }
}

function executeTask(taskName, taskConfig) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    log(`Starting task: ${taskName} - ${taskConfig.description}`);
    
    exec(taskConfig.command, (error, stdout, stderr) => {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      if (error) {
        log(`Task ${taskName} failed after ${duration}s: ${error.message}`, 'error');
        if (stderr) {
          log(`Stderr: ${stderr}`, 'error');
        }
        resolve({ success: false, duration, error: error.message });
      } else {
        log(`Task ${taskName} completed successfully in ${duration}s`);
        if (stdout && stdout.trim()) {
          log(`Output: ${stdout.trim().substring(0, 200)}...`);
        }
        resolve({ success: true, duration, output: stdout });
      }
    });
  });
}

async function runAllTasks() {
  log('='.repeat(60));
  log('🚀 Starting scheduled SEO maintenance tasks');
  log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  log(`Timestamp: ${new Date().toISOString()}`);
  log('='.repeat(60));
  
  const results = [];
  
  for (const [taskName, taskConfig] of Object.entries(TASKS)) {
    const result = await executeTask(taskName, taskConfig);
    results.push({ taskName, ...result });
    
    // Small delay between tasks
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Print summary
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  const successRate = ((successful / total) * 100).toFixed(1);
  
  log('='.repeat(60));
  log(`📊 Task Execution Summary:`);
  log(`   Successful: ${successful}/${total} (${successRate}%)`);
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    log(`   ${icon} ${result.taskName.padEnd(25)} ${result.duration}s`);
  });
  
  log('='.repeat(60));
  log(`✨ All tasks completed at ${new Date().toISOString()}`);
  
  return results;
}

function startCronScheduler() {
  log('🕐 Starting cron job scheduler...');
  
  // Schedule each task
  Object.entries(TASKS).forEach(([taskName, taskConfig]) => {
    cron.schedule(taskConfig.schedule, async () => {
      await executeTask(taskName, taskConfig);
    });
    
    log(`   Scheduled: ${taskName} (${taskConfig.schedule})`);
  });
  
  log('✅ Cron scheduler started successfully');
  log('Press Ctrl+C to stop the scheduler');
  
  // Keep the process running
  process.on('SIGINT', () => {
    log('👋 Shutting down cron scheduler...');
    process.exit(0);
  });
}

function showTaskStatus() {
  log('\n📋 Scheduled Tasks:');
  log('='.repeat(80));
  
  Object.entries(TASKS).forEach(([taskName, taskConfig]) => {
    log(`${taskName.padEnd(25)} ${taskConfig.schedule.padEnd(15)} ${taskConfig.description}`);
  });
  
  log('='.repeat(80));
  
  // Show next run times
  log('\n⏰ Next Scheduled Runs:');
  log('='.repeat(80));
  
  Object.entries(TASKS).forEach(([taskName, taskConfig]) => {
    try {
      const task = cron.schedule(taskConfig.schedule, () => {}, { scheduled: false });
      const nextDate = task.nextDate();
      const nextRun = nextDate ? nextDate.toISO() : 'Not scheduled';
      log(`${taskName.padEnd(25)} ${nextRun}`);
    } catch (error) {
      log(`${taskName.padEnd(25)} Error: ${error.message}`, 'error');
    }
  });
  
  log('='.repeat(80));
}

function showRecentLogs(limit = 20) {
  try {
    if (!fs.existsSync(CRON_LOG)) {
      log('No cron logs found.');
      return;
    }
    
    const logs = fs.readFileSync(CRON_LOG, 'utf8')
      .trim()
      .split('\n')
      .reverse()
      .slice(0, limit);
    
    log('\n📜 Recent Cron Logs:');
    log('='.repeat(100));
    
    logs.forEach(logLine => {
      console.log(logLine);
    });
    
    log('='.repeat(100));
    
  } catch (error) {
    log(`Error reading logs: ${error.message}`, 'error');
  }
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--run') || args.includes('-r')) {
    // Run all tasks once
    runAllTasks().then(() => {
      process.exit(0);
    });
    return;
  }
  
  if (args.includes('--status') || args.includes('-s')) {
    // Show task status
    showTaskStatus();
    showRecentLogs(10);
    process.exit(0);
  }
  
  if (args.includes('--logs') || args.includes('-l')) {
    // Show logs
    const limit = parseInt(args[args.indexOf('--logs') + 1] || args[args.indexOf('-l') + 1] || '50');
    showRecentLogs(limit);
    process.exit(0);
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node scripts/cron-job.js [options]

Options:
  --run, -r           Run all tasks once (immediate execution)
  --status, -s        Show scheduled tasks and next run times
  --logs, -l [limit]  Show recent logs (default: 50 lines)
  --start             Start cron scheduler (default if no options)
  --help, -h          Show this help message

Examples:
  node scripts/cron-job.js --run     # Run all tasks immediately
  node scripts/cron-job.js --status  # Show task schedule
  node scripts/cron-job.js --logs 20 # Show last 20 log entries
  node scripts/cron-job.js           # Start cron scheduler
  
Environment Variables:
  NODE_ENV=production  # Run in production mode
  LOG_LEVEL=debug      # Set log level (debug, info, error)
    `);
    process.exit(0);
  }
  
  // Default: start the cron scheduler
  startCronScheduler();
}

module.exports = {
  TASKS,
  executeTask,
  runAllTasks,
  startCronScheduler,
  showTaskStatus,
  showRecentLogs,
  log,
};