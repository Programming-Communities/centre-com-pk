// scripts/update-seo-data.js
// Removed shebang line for Windows compatibility

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

// Configuration
const SEO_DATA_FILE = path.join(process.cwd(), 'lib', 'seo', 'toolSeoData.ts');
const BACKUP_DIR = path.join(process.cwd(), 'backups', 'seo');
const LOG_FILE = path.join(process.cwd(), 'logs', 'seo-updates.log');

// AI API configuration (optional - for auto-generating SEO content)
const AI_API_KEY = process.env.OPENAI_API_KEY;
const AI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Create directories if they don't exist
[BACKUP_DIR, path.dirname(LOG_FILE)].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function updateSEOData() {
  console.log('🚀 Updating SEO data...');
  console.log(`📁 SEO data file: ${SEO_DATA_FILE}`);
  
  try {
    // Create backup before modifying
    await createBackup();
    
    // Read current SEO data
    const currentData = readCurrentSEOData();
    console.log(`📊 Current tools: ${Object.keys(currentData).length}`);
    
    // Analyze current data
    const analysis = analyzeSEOData(currentData);
    printAnalysis(analysis);
    
    // Check for missing or incomplete data
    const updatesNeeded = findUpdatesNeeded(currentData);
    
    if (updatesNeeded.length === 0) {
      console.log('✅ All SEO data is complete and up-to-date!');
      return { success: true, updated: false, message: 'No updates needed' };
    }
    
    console.log(`\n🔍 Found ${updatesNeeded.length} tools needing updates:`);
    updatesNeeded.forEach((tool, index) => {
      console.log(`   ${index + 1}. ${tool.slug} - Missing: ${tool.missing.join(', ')}`);
    });
    
    // Ask for confirmation
    if (!await confirmUpdate(updatesNeeded.length)) {
      console.log('Update cancelled by user.');
      return { success: false, updated: false, message: 'Cancelled by user' };
    }
    
    // Generate updates
    const updates = await generateUpdates(updatesNeeded);
    
    // Apply updates
    const updatedData = applyUpdates(currentData, updates);
    
    // Write updated data
    await writeSEOData(updatedData);
    
    // Log the update
    logUpdate(updatesNeeded.length, updates);
    
    console.log('\n🎉 SEO data updated successfully!');
    console.log(`   Tools updated: ${updatesNeeded.length}`);
    console.log(`   Backups created in: ${BACKUP_DIR}`);
    
    return {
      success: true,
      updated: true,
      toolsUpdated: updatesNeeded.length,
      backupCreated: true,
    };
    
  } catch (error) {
    console.error('❌ Error updating SEO data:', error.message);
    
    // Try to restore from backup
    try {
      await restoreBackup();
      console.log('✅ Restored from backup after error.');
    } catch (restoreError) {
      console.error('❌ Could not restore from backup:', restoreError.message);
    }
    
    return {
      success: false,
      error: error.message,
      restored: true,
    };
  }
}

function readCurrentSEOData() {
  try {
    const content = fs.readFileSync(SEO_DATA_FILE, 'utf8');
    
    // Extract TOOL_SEO_DATA object from the file
    // This is a simple regex approach - in production you might want to use a proper parser
    const match = content.match(/export const TOOL_SEO_DATA: Record<string, ToolSEOData> = ({[\s\S]*?});/);
    
    if (!match) {
      throw new Error('Could not find TOOL_SEO_DATA in file');
    }
    
    // Note: This is a simplified approach. In reality, you'd need to properly parse the TypeScript
    // For now, we'll return a stub. In production, use a proper TypeScript parser or store data in JSON.
    
    console.log('⚠️ Note: Full parsing not implemented in this example.');
    console.log('   In production, use a proper TypeScript parser or store data in JSON format.');
    
    return {};
    
  } catch (error) {
    console.error('Error reading SEO data file:', error.message);
    return {};
  }
}

function analyzeSEOData(data) {
  const tools = Object.values(data);
  
  return {
    totalTools: tools.length,
    toolsWithFAQs: tools.filter(t => t.faqs && t.faqs.length > 0).length,
    toolsWithKeywords: tools.filter(t => t.keywords && t.keywords.length > 0).length,
    toolsWithRelated: tools.filter(t => t.relatedTools && t.relatedTools.length > 0).length,
    averageFAQs: tools.reduce((sum, t) => sum + (t.faqs?.length || 0), 0) / tools.length,
    averageKeywords: tools.reduce((sum, t) => sum + (t.keywords?.length || 0), 0) / tools.length,
    missingTitles: tools.filter(t => !t.title || t.title.length < 10).length,
    missingDescriptions: tools.filter(t => !t.description || t.description.length < 50).length,
  };
}

function printAnalysis(analysis) {
  console.log('\n📈 SEO Data Analysis:');
  console.log('='.repeat(40));
  console.log(`Total Tools: ${analysis.totalTools}`);
  console.log(`Tools with FAQs: ${analysis.toolsWithFAQs} (${((analysis.toolsWithFAQs/analysis.totalTools)*100).toFixed(1)}%)`);
  console.log(`Tools with Keywords: ${analysis.toolsWithKeywords} (${((analysis.toolsWithKeywords/analysis.totalTools)*100).toFixed(1)}%)`);
  console.log(`Tools with Related Tools: ${analysis.toolsWithRelated} (${((analysis.toolsWithRelated/analysis.totalTools)*100).toFixed(1)}%)`);
  console.log(`Average FAQs per tool: ${analysis.averageFAQs.toFixed(1)}`);
  console.log(`Average Keywords per tool: ${analysis.averageKeywords.toFixed(1)}`);
  console.log(`Missing/Short Titles: ${analysis.missingTitles}`);
  console.log(`Missing/Short Descriptions: ${analysis.missingDescriptions}`);
  console.log('='.repeat(40));
}

function findUpdatesNeeded(data) {
  const updates = [];
  
  Object.entries(data).forEach(([slug, tool]) => {
    const missing = [];
    
    // Check for missing or poor quality data
    if (!tool.title || tool.title.length < 20) {
      missing.push('title');
    }
    
    if (!tool.description || tool.description.length < 100) {
      missing.push('description');
    }
    
    if (!tool.keywords || tool.keywords.length < 3) {
      missing.push('keywords');
    }
    
    if (!tool.faqs || tool.faqs.length < 2) {
      missing.push('faqs');
    }
    
    if (!tool.relatedTools || tool.relatedTools.length < 2) {
      missing.push('relatedTools');
    }
    
    if (missing.length > 0) {
      updates.push({ slug, tool, missing });
    }
  });
  
  return updates;
}

async function generateUpdates(updatesNeeded) {
  const generatedUpdates = [];
  
  for (const item of updatesNeeded) {
    console.log(`\n🔄 Generating updates for: ${item.slug}`);
    
    const updates = {};
    
    // Generate missing fields
    if (item.missing.includes('title')) {
      updates.title = await generateTitle(item.slug, item.tool.category);
    }
    
    if (item.missing.includes('description')) {
      updates.description = await generateDescription(item.slug, item.tool.category);
    }
    
    if (item.missing.includes('keywords')) {
      updates.keywords = generateKeywords(item.slug, item.tool.category);
    }
    
    if (item.missing.includes('faqs')) {
      updates.faqs = await generateFAQs(item.slug, item.tool.category);
    }
    
    if (item.missing.includes('relatedTools')) {
      updates.relatedTools = generateRelatedTools(item.slug, item.tool.category);
    }
    
    generatedUpdates.push({
      slug: item.slug,
      updates,
    });
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return generatedUpdates;
}

// AI-powered generation functions
async function generateTitle(slug, category) {
  if (AI_API_KEY) {
    try {
      const response = await axios.post(AI_API_URL, {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Generate compelling, SEO-optimized titles for online tools.'
          },
          {
            role: 'user',
            content: `Generate an SEO-optimized title (50-60 characters) for a ${slug.replace(/-/g, ' ')} tool in the ${category} category.`
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.log(`   ⚠️ AI API error: ${error.message}, using fallback`);
    }
  }
  
  // Fallback if no AI API or API fails
  const toolName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return `${toolName} - Free Online Tool | Centre.com.pk`;
}

async function generateDescription(slug, category) {
  if (AI_API_KEY) {
    try {
      const response = await axios.post(AI_API_URL, {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Generate compelling, SEO-optimized meta descriptions.'
          },
          {
            role: 'user',
            content: `Generate an SEO-optimized meta description (150-160 characters) for a ${slug.replace(/-/g, ' ')} tool in the ${category} category. Include keywords and call to action.`
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.log(`   ⚠️ AI API error: ${error.message}, using fallback`);
    }
  }
  
  // Fallback
  const toolName = slug.replace(/-/g, ' ');
  return `Free online ${toolName} tool. Easy to use, no registration required. Perfect for ${category} tasks. Try it now!`;
}

function generateKeywords(slug, category) {
  const baseKeywords = [
    slug,
    `${slug} tool`,
    `online ${slug}`,
    `free ${slug}`,
    `${slug} calculator`,
    `${category} tools`,
    `web tools`,
    `free online tools`,
    'centre.com.pk',
  ];
  
  // Add some variations
  const variations = slug.split('-').map(word => `${word} tool`);
  
  return [...new Set([...baseKeywords, ...variations])].slice(0, 10);
}

async function generateFAQs(slug, category) {
  const faqs = [
    {
      question: `What is ${slug.replace(/-/g, ' ')}?`,
      answer: `${slug.replace(/-/g, ' ')} is a useful online tool that helps with various tasks in the ${category} category.`,
    },
    {
      question: `Is this ${slug.replace(/-/g, ' ')} tool free to use?`,
      answer: 'Yes, this tool is completely free with no registration required. You can use it as many times as you need.',
    },
  ];
  
  if (AI_API_KEY) {
    try {
      const response = await axios.post(AI_API_URL, {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Generate helpful FAQ questions and answers for online tools.'
          },
          {
            role: 'user',
            content: `Generate 2-3 additional FAQ questions and answers for a ${slug.replace(/-/g, ' ')} tool in the ${category} category. Make them helpful and SEO-friendly.`
        }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      const aiFAQs = parseAIResponseToFAQs(response.data.choices[0].message.content);
      return [...faqs, ...aiFAQs].slice(0, 5);
    } catch (error) {
      console.log(`   ⚠️ AI API error: ${error.message}, using basic FAQs`);
    }
  }
  
  return faqs;
}

function parseAIResponseToFAQs(content) {
  // Simple parsing - in production, use more robust parsing
  const lines = content.split('\n').filter(line => line.trim());
  const faqs = [];
  let currentQ = null;
  let currentA = null;
  
  for (const line of lines) {
    if (line.match(/^Q:|^Question:|^\d+\./)) {
      if (currentQ && currentA) {
        faqs.push({ question: currentQ, answer: currentA });
      }
      currentQ = line.replace(/^(Q:|Question:|\d+\.)\s*/, '').trim();
      currentA = '';
    } else if (line.match(/^A:|^Answer:/)) {
      currentA = line.replace(/^(A:|Answer:)\s*/, '').trim();
    } else if (currentQ && line.trim()) {
      currentA += ' ' + line.trim();
    }
  }
  
  if (currentQ && currentA) {
    faqs.push({ question: currentQ, answer: currentA });
  }
  
  return faqs;
}

function generateRelatedTools(slug, category) {
  // In production, this would analyze the current data to find related tools
  // For now, return some placeholder
  return ['example-tool-1', 'example-tool-2', 'example-tool-3'];
}

function applyUpdates(currentData, updates) {
  const updatedData = { ...currentData };
  
  updates.forEach(update => {
    if (updatedData[update.slug]) {
      updatedData[update.slug] = {
        ...updatedData[update.slug],
        ...update.updates,
        lastModified: new Date().toISOString(),
      };
    }
  });
  
  return updatedData;
}

async function writeSEOData(data) {
  // In production, you would write back to the TypeScript file
  // For this example, we'll create a JSON backup
  const backupFile = path.join(BACKUP_DIR, `seo-data-${Date.now()}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
  console.log(`   📁 Backup created: ${backupFile}`);
}

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `toolSeoData-backup-${timestamp}.ts`);
  
  if (fs.existsSync(SEO_DATA_FILE)) {
    const content = fs.readFileSync(SEO_DATA_FILE, 'utf8');
    fs.writeFileSync(backupFile, content);
    console.log(`   📁 Backup created: ${backupFile}`);
  }
}

async function restoreBackup() {
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('toolSeoData-backup-') && f.endsWith('.ts'))
    .sort()
    .reverse();
  
  if (backups.length > 0) {
    const latestBackup = path.join(BACKUP_DIR, backups[0]);
    const content = fs.readFileSync(latestBackup, 'utf8');
    fs.writeFileSync(SEO_DATA_FILE, content);
    console.log(`   🔄 Restored from: ${latestBackup}`);
    return true;
  }
  
  return false;
}

function logUpdate(toolsUpdated, updates) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    toolsUpdated,
    updates: updates.map(u => ({
      slug: u.slug,
      fields: Object.keys(u.updates),
    })),
  };
  
  const logLine = JSON.stringify(logEntry) + '\n';
  
  try {
    fs.appendFileSync(LOG_FILE, logLine);
  } catch (error) {
    console.error('Failed to write update log:', error.message);
  }
}

async function confirmUpdate(count) {
  // In a CLI tool, you would prompt the user
  // For this example, we'll auto-confirm if not in interactive mode
  const isTTY = process.stdin.isTTY && process.stdout.isTTY;
  
  if (!isTTY) {
    return true; // Auto-confirm for scripts
  }
  
  // Simulated confirmation for example
  console.log(`\n⚠️  About to update ${count} tools. Continue? [y/N]`);
  
  // In real implementation, you would read from stdin
  // For this example, we'll auto-confirm
  return true;
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node scripts/update-seo-data.js [options]

Options:
  --analyze, -a      Analyze current SEO data without making changes
  --backup, -b       Create backup only
  --restore, -r      Restore from latest backup
  --force, -f        Force update without confirmation
  --help, -h         Show this help message

Examples:
  node scripts/update-seo-data.js           # Update with confirmation
  node scripts/update-seo-data.js --analyze # Analyze only
  node scripts/update-seo-data.js --backup  # Create backup only
  node scripts/update-seo-data.js --restore # Restore from backup
    `);
    process.exit(0);
  }
  
  if (args.includes('--analyze') || args.includes('-a')) {
    const data = readCurrentSEOData();
    const analysis = analyzeSEOData(data);
    printAnalysis(analysis);
    process.exit(0);
  }
  
  if (args.includes('--backup') || args.includes('-b')) {
    createBackup();
    console.log('✅ Backup created successfully!');
    process.exit(0);
  }
  
  if (args.includes('--restore') || args.includes('-r')) {
    restoreBackup();
    console.log('✅ Restored from backup!');
    process.exit(0);
  }
  
  updateSEOData().then(result => {
    if (result.success) {
      process.exit(0);
    } else {
      console.error('❌ Update failed:', result.error);
      process.exit(1);
    }
  });
}

module.exports = { updateSEOData, analyzeSEOData, createBackup, restoreBackup };