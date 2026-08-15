const https = require('https');
const fs = require('fs');
const path = require('path');

// ✅ REMOVED theme parameter from OG image URL
const OG_IMAGE_URL = 'https://www.centre.com.pk/api/og-image?title=Centre.com.pk%20-%20Free%20Educational%20%26%20Computer%20Tools&description=500%2B%20completely%20free%20tools%20for%20students%2C%20professionals%2C%20and%20everyday%20users';

console.log('🔧 Generating OG Image for Centre.com.pk...');
console.log('📥 Downloading from:', OG_IMAGE_URL);

https.get(OG_IMAGE_URL, (response) => {
  if (response.statusCode === 200) {
    const chunks = [];
    
    response.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    response.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const filePath = path.join(__dirname, '../public/og-image.png');
      
      fs.writeFileSync(filePath, buffer);
      
      const fileSize = (buffer.length / 1024).toFixed(2);
      console.log(`✅ OG image created: ${filePath}`);
      console.log(`📏 File size: ${fileSize} KB`);
      console.log(`🎨 Dimensions: 1200x630 pixels`);
      console.log(`🎯 Ready for social media sharing!`);
      
      // Verify the file
      const stats = fs.statSync(filePath);
      if (stats.size > 1000) {
        console.log('✅ Image looks good (>1KB)');
      } else {
        console.log('⚠️  Warning: Image might be too small (<1KB)');
      }
    });
  } else {
    console.error('❌ Failed to download OG image. Status:', response.statusCode);
    process.exit(1);
  }
}).on('error', (error) => {
  console.error('❌ Network error:', error.message);
  console.log('\n💡 Alternative: Using local server...');
  generateFromLocalServer();
});

function generateFromLocalServer() {
  // If production API fails, try localhost
  const http = require('http');
  // ✅ REMOVED theme parameter from local URL too
  const LOCAL_URL = 'http://localhost:3000/api/og-image?title=Centre.com.pk%20-%20Free%20Educational%20%26%20Computer%20Tools&description=500%2B%20completely%20free%20tools%20for%20students%2C%20professionals%2C%20and%20everyday%20users';
  
  console.log('🔄 Trying local server:', LOCAL_URL);
  
  http.get(LOCAL_URL, (response) => {
    const chunks = [];
    
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const filePath = path.join(__dirname, '../public/og-image.png');
      
      fs.writeFileSync(filePath, buffer);
      console.log(`✅ OG image created from local server: ${filePath}`);
    });
  }).on('error', () => {
    console.log('❌ Both APIs failed. Creating simple OG image...');
    createSimpleOGImage();
  });
}

function createSimpleOGImage() {
  const { createCanvas } = require('canvas');
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Professional gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#2563EB');
  gradient.addColorStop(1, '#059669');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Logo
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 80px Arial';
  ctx.fillText('Centre.com.pk', 100, 200);

  // Tagline
  ctx.font = 'bold 50px Arial';
  ctx.fillStyle = '#F0FDF4';
  ctx.fillText('Free Educational & Computer Tools', 100, 300);

  // Description
  ctx.font = '35px Arial';
  ctx.fillStyle = '#E2E8F0';
  ctx.fillText('500+ Tools • No Registration • 100% Free', 100, 400);

  // URL
  ctx.font = '25px Arial';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('centre.com.pk', width - 250, height - 50);

  const filePath = path.join(__dirname, '../public/og-image.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  console.log(`✅ Simple OG image created: ${filePath}`);
}