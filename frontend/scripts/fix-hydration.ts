import fs from 'fs';
import path from 'path';

interface FixResult {
  file: string;
  status: 'fixed' | 'skipped' | 'error';
  reason?: string;
}

const results: FixResult[] = [];

// Directory paths
const TOOLS_DIR = path.join(process.cwd(), 'components', 'tools');

// Get all .client.tsx files
function getAllClientFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getAllClientFiles(fullPath));
    } else if (item.name.endsWith('.client.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Fix a single file
function fixFile(filePath: string): FixResult {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    const fileName = path.relative(process.cwd(), filePath);
    
    // Skip if already has mounted
    if (content.includes('const [mounted, setMounted]')) {
      return { file: fileName, status: 'skipped', reason: 'Already has mounted' };
    }
    
    // Skip if no useTheme
    if (!content.includes('useTheme')) {
      return { file: fileName, status: 'skipped', reason: 'No useTheme' };
    }
    
    // Check for useState import
    const hasUseState = /import\s*{[^}]*useState[^}]*}\s*from\s*['"]react['"]/.test(content);
    
    if (!hasUseState) {
      // Add useState to React import
      content = content.replace(
        /import\s*{([^}]+)}\s*from\s*['"]react['"]/,
        (match, imports) => {
          if (imports.includes('useState')) return match;
          return `import {${imports.trim()}, useState, useEffect } from 'react'`;
        }
      );
      
      // If no react import at all, add it
      if (!content.includes("from 'react'") && !content.includes('from "react"')) {
        content = `import { useState, useEffect } from 'react';\n` + content;
      }
    } else {
      // Ensure useEffect is also imported
      if (!content.includes('useEffect')) {
        content = content.replace(
          /import\s*{([^}]*useState[^}]*)}\s*from\s*['"]react['"]/,
          (match, imports) => {
            if (imports.includes('useEffect')) return match;
            return `import {${imports.trim()}, useEffect } from 'react'`;
          }
        );
      }
    }
    
    // Find the useTheme line and add mounted after it
    const useThemeRegex = /(const\s*{\s*[^}]*themeColors[^}]*\s*}\s*=\s*useTheme\(\);)/;
    
    if (!useThemeRegex.test(content)) {
      return { file: fileName, status: 'skipped', reason: 'themeColors pattern not found' };
    }
    
    // Add mounted state and useEffect after useTheme
    content = content.replace(useThemeRegex, (match) => {
      return `${match}
  
  // ✅ HYDration FIX
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ✅ Safe colors (light theme during SSR)
  const colors = mounted ? themeColors : {
    background: '#ffffff',
    surface: '#f8fafc',
    text: { primary: '#0f172a', secondary: '#334155', accent: '#ffffff' },
    border: '#e2e8f0',
    primary: '#1d4ed8',
    secondary: '#1e40af',
  };`;
    });
    
    // Replace themeColors.X with colors.X (but NOT themeColors itself)
    // This replaces all occurrences in JSX/styles
    content = content.replace(/themeColors\.(text\.\w+|background|surface|border|primary|secondary|success|warning|error|shadow)/g, 'colors.$1');
    
    // Add suppressHydrationWarning to main root div if missing
    // Find first div after return (
    const returnRegex = /(return\s*\(\s*<[a-zA-Z]+)/;
    if (returnRegex.test(content) && !content.includes('suppressHydrationWarning')) {
      content = content.replace(
        /return\s*\(\s*<(div|main|section|article)/,
        (match, tag) => {
          return match.replace(`<${tag}`, `<${tag} suppressHydrationWarning`);
        }
      );
    }
    
    // Write file
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { file: fileName, status: 'fixed' };
    }
    
    return { file: fileName, status: 'skipped', reason: 'No changes needed' };
    
  } catch (error: any) {
    return { 
      file: path.relative(process.cwd(), filePath), 
      status: 'error', 
      reason: error.message 
    };
  }
}

// Main function
function main() {
  console.log('🔧 Starting hydration fix...\n');
  
  // Get all client files
  const files = getAllClientFiles(TOOLS_DIR);
  console.log(`📁 Found ${files.length} client files\n`);
  
  // Fix each file
  for (const file of files) {
    const result = fixFile(file);
    results.push(result);
    
    const icon = result.status === 'fixed' ? '✅' : result.status === 'skipped' ? '⏭️' : '❌';
    const reason = result.reason ? ` — ${result.reason}` : '';
    console.log(`${icon} ${result.file}${reason}`);
  }
  
  // Summary
  console.log('\n📊 Summary:');
  const fixed = results.filter(r => r.status === 'fixed').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  console.log(`  ✅ Fixed: ${fixed}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  📁 Total: ${results.length}`);
  
  if (errors > 0) {
    console.log('\n❌ Errors:');
    results.filter(r => r.status === 'error').forEach(r => {
      console.log(`  ${r.file}: ${r.reason}`);
    });
  }
}

main();
