import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const budayaDir = 'src/assets/budaya';
const files = fs.readdirSync(budayaDir);

async function optimizeBudayaAssets() {
  for (const f of files) {
    const full = path.join(budayaDir, f);
    const stat = fs.statSync(full);
    console.log('Processing:', f, (stat.size / 1024 / 1024).toFixed(2), 'MB');

    if (stat.size > 200 * 1024) {
      if (f.endsWith('.svg')) {
        try {
          const content = fs.readFileSync(full, 'utf8');
          // If the SVG contains raw embedded base64 image data, extract or clean it
          const match = content.match(/data:image\/[a-zA-Z]+;base64,([^"'\s>]+)/);
          if (match) {
            const imgBuffer = Buffer.from(match[1], 'base64');
            const compressedWebp = await sharp(imgBuffer)
              .resize({ width: 800, withoutEnlargement: true })
              .webp({ quality: 75 })
              .toBuffer();
            const base64 = compressedWebp.toString('base64');
            const cleanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><image href="data:image/webp;base64,${base64}" width="800" height="600"/></svg>`;
            fs.writeFileSync(full, cleanSvg);
            console.log('Successfully cleaned SVG:', f, (cleanSvg.length / 1024).toFixed(1), 'KB');
          }
        } catch (err) {
          console.error('Error cleaning SVG:', f, err.message);
        }
      } else if (f.endsWith('.png')) {
        try {
          const pngBuf = await sharp(full)
            .resize({ width: 800, withoutEnlargement: true })
            .png({ quality: 75, compressionLevel: 9 })
            .toBuffer();
          fs.writeFileSync(full, pngBuf);
          console.log('Optimized PNG:', f, (pngBuf.length / 1024).toFixed(1), 'KB');
        } catch (err) {
          console.error('Error cleaning PNG:', f, err.message);
        }
      }
    }
  }
}

optimizeBudayaAssets().catch(console.error);
