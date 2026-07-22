const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const budayaDir = 'src/assets/budaya';
if (!fs.existsSync(budayaDir)) {
  console.log('budaya dir does not exist');
  process.exit(0);
}

const files = fs.readdirSync(budayaDir);

async function optimizeBudayaAssets() {
  for (const f of files) {
    const full = path.join(budayaDir, f);
    const stat = fs.statSync(full);
    console.log('Original size:', f, (stat.size / 1024 / 1024).toFixed(2), 'MB');

    if (f.endsWith('.svg')) {
      // Convert huge SVG to compact WebP buffer
      const webpBuf = await sharp(full)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();
      
      const base64 = webpBuf.toString('base64');
      const cleanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><image href="data:image/webp;base64,${base64}" width="800" height="600"/></svg>`;
      
      fs.writeFileSync(full, cleanSvg);
      console.log('Optimized SVG:', f, (cleanSvg.length / 1024).toFixed(1), 'KB');
    } else if (f.endsWith('.png')) {
      const pngBuf = await sharp(full)
        .resize({ width: 800, withoutEnlargement: true })
        .png({ quality: 75, compressionLevel: 9 })
        .toBuffer();
      
      fs.writeFileSync(full, pngBuf);
      console.log('Optimized PNG:', f, (pngBuf.length / 1024).toFixed(1), 'KB');
    }
  }
}

optimizeBudayaAssets().catch(console.error);
