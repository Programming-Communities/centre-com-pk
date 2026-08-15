// scripts/create-og-image.js
const fs = require('fs');
const { createCanvas } = require('canvas');

const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#2563EB'); // Blue
gradient.addColorStop(1, '#059669'); // Green
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Logo/Title
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

// Stats
ctx.font = '30px Arial';
ctx.fillStyle = '#CBD5E1';
ctx.fillText('For Students • Professionals • Everyday Users', 100, 480);

// URL
ctx.font = '25px Arial';
ctx.fillStyle = '#94A3B8';
ctx.fillText('centre.com.pk', width - 250, height - 50);

// Save file
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/og-image.png', buffer);
console.log('✅ OG image created: public/og-image.png');
console.log('Size:', (buffer.length / 1024).toFixed(2), 'KB');