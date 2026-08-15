// scripts/check-accessibility.js
const puppeteer = require('puppeteer');

async function checkAccessibility() {
  console.log('🔍 Running Accessibility Checks...\n');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Check for buttons without aria-label
    const buttons = await page.$$eval('button', buttons => 
      buttons.map(btn => ({
        html: btn.outerHTML.substring(0, 100),
        hasAriaLabel: btn.hasAttribute('aria-label'),
        hasText: btn.textContent.trim().length > 0,
        className: btn.className
      }))
    );
    
    const problematicButtons = buttons.filter(btn => !btn.hasAriaLabel && !btn.hasText);
    
    console.log(`📊 Found ${buttons.length} total buttons`);
    console.log(`⚠️  ${problematicButtons.length} buttons without aria-label or text\n`);
    
    if (problematicButtons.length > 0) {
      console.log('❌ Problematic buttons:');
      problematicButtons.forEach((btn, i) => {
        console.log(`${i+1}. ${btn.html}...`);
        console.log(`   Class: ${btn.className}`);
      });
    } else {
      console.log('✅ All buttons have proper accessibility attributes!');
    }
    
    // Check contrast issues
    console.log('\n🎨 Checking contrast issues...');
    const lowContrastElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const issues = [];
      
      // Simple check for low contrast (blue on light blue)
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const bgColor = style.backgroundColor;
        const textColor = style.color;
        
        // Check for common low contrast patterns
        if (bgColor.includes('rgb(37, 99, 235)') || bgColor.includes('#2563EB')) {
          if (textColor.includes('rgb(37, 99, 235)') || textColor.includes('#2563EB')) {
            issues.push({
              element: el.outerHTML.substring(0, 150),
              backgroundColor: bgColor,
              color: textColor
            });
          }
        }
      });
      
      return issues;
    });
    
    if (lowContrastElements.length > 0) {
      console.log(`⚠️  Found ${lowContrastElements.length} potential contrast issues`);
      console.log('   Fix: Change text color from #2563EB to #1E40AF or #1D4ED8');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkAccessibility();