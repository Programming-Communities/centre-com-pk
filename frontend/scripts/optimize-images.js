// scripts/optimize-images.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '../public');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (!imageExtensions.includes(ext)) return;
    
    const stats = fs.statSync(filePath);
    if (stats.size < 10240) return; // Skip small files (<10KB)
    
    console.log(`Optimizing: ${path.relative(publicDir, filePath)}`);
    
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Create WebP version
    const webpPath = filePath.replace(ext, '.webp');
    await image
      .webp({ quality: 80, effort: 6 })
      .toFile(webpPath);
    
    // Create AVIF version (optional)
    const avifPath = filePath.replace(ext, '.avif');
    await image
      .avif({ quality: 70, effort: 9 })
      .toFile(avifPath)
      .catch(() => {}); // Skip if AVIF fails
    
    console.log(`✅ Created optimized versions for: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${filePath}:`, error.message);
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else {
      await optimizeImage(filePath);
    }
  }
}

async function main() {
  console.log('🖼️ Starting image optimization...\n');
  await processDirectory(publicDir);
  console.log('\n✅ Image optimization complete!');
}

main();