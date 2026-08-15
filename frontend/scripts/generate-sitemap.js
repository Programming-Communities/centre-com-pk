// scripts/generate-sitemap.js
// Removed shebang line for Windows compatibility

const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const { createGzip } = require('zlib');

// Site configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.centre.com.pk';
const OUTPUT_DIR = path.join(process.cwd(), 'public');
const SITEMAP_FILE = path.join(OUTPUT_DIR, 'sitemap.xml');
const SITEMAP_GZ_FILE = path.join(OUTPUT_DIR, 'sitemap.xml.gz');

// Tool data - in a real app, this would come from a database or API
const TOOLS_DATA = require('../lib/seo/toolSeoData').TOOL_SEO_DATA;

async function generateSitemap() {
  console.log('🚀 Generating sitemap...');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Define URLs for sitemap
    const links = [
      // Homepage
      {
        url: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      // Tools page
      {
        url: '/tools',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      // Category pages
      ...getCategoryPages(),
      // Individual tool pages
      ...getToolPages(),
    ];

    // Create sitemap stream
    const stream = new SitemapStream({
      hostname: SITE_URL,
      xmlns: {
        news: false,
        xhtml: false,
        image: true,
        video: false,
      },
    });

    // Create readable stream from links
    const readableStream = Readable.from(links);
    
    // Pipe through sitemap stream
    readableStream.pipe(stream);
    
    // Generate sitemap XML
    const sitemap = await streamToPromise(stream);
    
    // Write sitemap.xml
    fs.writeFileSync(SITEMAP_FILE, sitemap.toString());
    console.log(`✅ Sitemap written to: ${SITEMAP_FILE}`);
    
    // Create compressed version
    const gzippedSitemap = await streamToPromise(
      Readable.from(sitemap).pipe(createGzip())
    );
    fs.writeFileSync(SITEMAP_GZ_FILE, gzippedSitemap);
    console.log(`✅ Compressed sitemap written to: ${SITEMAP_GZ_FILE}`);
    
    // Generate sitemap index if needed
    generateSitemapIndex(links.length);
    
    // Log statistics
    console.log('\n📊 Sitemap Statistics:');
    console.log(`   Total URLs: ${links.length}`);
    console.log(`   Homepage priority: 1.0`);
    console.log(`   Category pages: ${getUniqueCategories().length}`);
    console.log(`   Tool pages: ${Object.keys(TOOLS_DATA).length}`);
    console.log(`   Generated: ${new Date().toISOString()}`);
    
    return {
      success: true,
      urls: links.length,
      fileSize: (sitemap.length / 1024).toFixed(2) + ' KB',
      compressedSize: (gzippedSitemap.length / 1024).toFixed(2) + ' KB',
    };
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

function getCategoryPages() {
  const categories = getUniqueCategories();
  return categories.map(category => ({
    url: `/tools/${category}`,
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  }));
}

function getToolPages() {
  return Object.values(TOOLS_DATA).map(tool => ({
    url: `/tools/${tool.category}/${tool.slug}`,
    changefreq: tool.changefreq || 'weekly',
    priority: tool.priority || 0.7,
    lastmod: tool.lastModified || new Date().toISOString(),
  }));
}

function getUniqueCategories() {
  const categories = new Set();
  Object.values(TOOLS_DATA).forEach(tool => {
    categories.add(tool.category);
  });
  return Array.from(categories);
}

function generateSitemapIndex(totalUrls) {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;
  
  const indexFile = path.join(OUTPUT_DIR, 'sitemap-index.xml');
  fs.writeFileSync(indexFile, sitemapIndex);
  console.log(`✅ Sitemap index written to: ${indexFile}`);
}

// Generate robots.txt
function generateRobotsTxt() {
  const robotsTxt = `# Robots.txt for ${SITE_URL}
# Generated: ${new Date().toISOString()}

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/

Crawl-delay: 2

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/sitemap-index.xml

# Block AI scrapers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

# Allow search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

# Important files
Allow: /ads.txt
Allow: /security.txt
Allow: /humans.txt
Allow: /.well-known/
Allow: /favicon.ico
Allow: /apple-touch-icon.png
Allow: /favicon-32x32.png
Allow: /favicon-16x16.png
Allow: /site.webmanifest
`;

  const robotsFile = path.join(OUTPUT_DIR, 'robots.txt');
  fs.writeFileSync(robotsFile, robotsTxt);
  console.log(`✅ Robots.txt written to: ${robotsFile}`);
}

// Run if called directly
if (require.main === module) {
  generateSitemap().then(result => {
    if (result.success) {
      generateRobotsTxt();
      console.log('\n🎉 Sitemap generation completed successfully!');
      process.exit(0);
    } else {
      console.error('\n💥 Sitemap generation failed!');
      process.exit(1);
    }
  });
}

module.exports = { generateSitemap, generateRobotsTxt };