// scripts/optimize.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Performance Optimization...');

// 1. Generate placeholder screenshots
const screenshotsDir = path.join(__dirname, '../public/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  console.log('✅ Created screenshots directory');
}

// 2. Generate manifest.json with proper icons
const manifest = {
  name: 'Centre.com.pk - Professional Tools',
  short_name: 'Centre.com.pk',
  description: '50+ professional online tools platform',
  start_url: '/',
  display: 'standalone',
  background_color: '#0F172A',
  theme_color: '#2563EB',
  icons: [
    {
      src: '/android/android-launchericon-192-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: '/android/android-launchericon-512-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    }
  ]
};

fs.writeFileSync(
  path.join(__dirname, '../public/manifest.json'),
  JSON.stringify(manifest, null, 2)
);
console.log('✅ Updated manifest.json');

// 3. Create robots.txt
const robots = `# Centre.com.pk Robots.txt
User-agent: *
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.centre.com.pk'}/sitemap.xml
`;

fs.writeFileSync(
  path.join(__dirname, '../public/robots.txt'),
  robots
);
console.log('✅ Updated robots.txt');

console.log('\n🎉 Performance optimization complete!');
console.log('Next steps:');
console.log('1. Run: npm run build');
console.log('2. Test with Lighthouse');
console.log('3. Deploy to production');