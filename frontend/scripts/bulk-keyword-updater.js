// scripts/bulk-keyword-updater.js - NEW FILE
const fs = require('fs');
const path = require('path');

// Read current toolSeoData.ts
const toolSeoDataPath = path.join(__dirname, '../lib/seo/toolSeoData.ts');
const content = fs.readFileSync(toolSeoDataPath, 'utf8');

// Keyword expansion patterns
const KEYWORD_PATTERNS = {
  // Informational intent
  'how': ['how to use', 'how does work', 'how to get', 'how to make'],
  'what': ['what is', 'what does mean', 'what are benefits'],
  'why': ['why use', 'why important', 'why needed'],
  'best': ['best free', 'best online', 'best for beginners'],
  
  // Commercial intent  
  'free': ['free online', 'free without registration', 'free no watermark'],
  'online': ['online tool', 'web based', 'browser based'],
  'tool': ['software', 'application', 'utility', 'generator'],
  
  // Comparison intent
  'vs': ['vs competitors', 'vs alternatives', 'compared to'],
  'alternative': ['alternative to', 'similar to', 'like'],
  
  // Question intent
  '?': ['how to', 'what is', 'why use', 'when to', 'where to find'],
};

function expandKeywords(baseKeywords, toolName, category) {
  const expanded = [...baseKeywords];
  
  // Add category-specific keywords
  expanded.push(`${category} tools`, `online ${category}`, `free ${category}`);
  
  // Add tool-specific patterns
  Object.entries(KEYWORD_PATTERNS).forEach(([type, patterns]) => {
    patterns.forEach(pattern => {
      expanded.push(`${pattern} ${toolName}`);
      expanded.push(`${toolName} ${pattern}`);
    });
  });
  
  // Add local keywords
  expanded.push(`${toolName} in pakistan`, `${toolName} for pakistani users`);
  
  // Add year-based keywords
  const currentYear = new Date().getFullYear();
  expanded.push(`${toolName} ${currentYear}`, `best ${toolName} ${currentYear}`);
  
  // Remove duplicates and limit to 20 keywords
  return [...new Set(expanded)].slice(0, 20);
}

// Parse and update the file
console.log('🔧 Expanding keywords for all 50 tools...\n');

let updatedContent = content;
let toolsUpdated = 0;

// Find and update each tool's keywords
Object.keys(require('../lib/seo/toolSeoData').TOOL_SEO_DATA).forEach(toolSlug => {
  const toolName = toolSlug.replace(/-/g, ' ');
  const regex = new RegExp(`'${toolSlug}':\\s*{[^}]+keywords:\\s*\\[[^\\]]+\\]`, 'g');
  
  updatedContent = updatedContent.replace(regex, match => {
    toolsUpdated++;
    
    // Extract existing keywords
    const keywordsMatch = match.match(/keywords:\s*\[([^\]]+)\]/);
    const existingKeywords = keywordsMatch ? 
      keywordsMatch[1].replace(/'/g, '').split(',').map(k => k.trim()) : [];
    
    // Expand keywords
    const expandedKeywords = expandKeywords(existingKeywords, toolName, 'tools');
    
    // Replace keywords array
    return match.replace(
      /keywords:\s*\[[^\]]+\]/,
      `keywords: [${expandedKeywords.map(k => `'${k}'`).join(', ')}]`
    );
  });
});

// Write updated file
fs.writeFileSync(toolSeoDataPath, updatedContent);

console.log(`✅ Updated keywords for ${toolsUpdated} tools`);
console.log(`📁 File saved: ${toolSeoDataPath}`);
console.log('\n🎯 NEXT STEPS:');
console.log('1. Run: npm run build (to test)');
console.log('2. Check: Each tool now has 20+ keywords');
console.log('3. Monitor: Google Search Console for improvements');