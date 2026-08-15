// C:\Users\AamirAli\Desktop\centre.com.pk\scripts\find-breakpoint-issues.js
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const oldBreakpointNames = [
  "'mobile'",
  "'tablet'",
  "'desktop'",
  "'large'",
  "'xl'",
  "'2xl'",
  "'4k'",
  '"mobile"',
  '"tablet"',
  '"desktop"',
  '"large"',
  '"xl"',
  '"2xl"',
  '"4k"'
];

function searchInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    oldBreakpointNames.forEach(oldName => {
      if (content.includes(oldName)) {
        // Check if it's not inside a string comment or string literal
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(oldName) && !line.includes('//') && !line.includes('*')) {
            issues.push({
              file: path.relative(projectRoot, filePath),
              line: index + 1,
              text: line.trim(),
              oldName
            });
          }
        });
      }
    });
    
    return issues;
  } catch (error) {
    return [];
  }
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      walkDir(filePath, callback);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
      callback(filePath);
    }
  });
}

console.log('🔍 Searching for old breakpoint names...\n');

const allIssues = [];
walkDir(projectRoot, (filePath) => {
  const issues = searchInFile(filePath);
  if (issues.length > 0) {
    allIssues.push(...issues);
  }
});

if (allIssues.length === 0) {
  console.log('✅ No old breakpoint names found!');
} else {
  console.log(`❌ Found ${allIssues.length} issues:\n`);
  
  // Group by file
  const issuesByFile = {};
  allIssues.forEach(issue => {
    if (!issuesByFile[issue.file]) {
      issuesByFile[issue.file] = [];
    }
    issuesByFile[issue.file].push(issue);
  });
  
  Object.entries(issuesByFile).forEach(([file, issues]) => {
    console.log(`📄 ${file}:`);
    issues.forEach(issue => {
      console.log(`   Line ${issue.line}: ${issue.text}`);
      console.log(`   Found: ${issue.oldName}\n`);
    });
  });
}