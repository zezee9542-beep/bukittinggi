import sharp from 'sharp';
import { readdirSync, statSync, existsSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Set low memory profile for Vips/Sharp
sharp.concurrency(1);
sharp.cache(false);

const dirs = [
  join(ROOT_DIR, 'src/assets'),
  join(ROOT_DIR, 'public/assets'),
  join(ROOT_DIR, 'public'),
];

function getFiles(dirPath, acc = []) {
  if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) return acc;
  for (const f of readdirSync(dirPath)) {
    const full = join(dirPath, f);
    if (statSync(full).isDirectory()) getFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

async function run() {
  let files = [];
  dirs.forEach(d => getFiles(d, files));
  const targets = [...new Set(files)].filter(f => ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase()));

  console.log(`🔍 Found ${targets.length} remaining PNG/JPG/JPEG images to convert to WebP...\n`);

  let convertedCount = 0;
  for (const f of targets) {
    const ext = extname(f);
    const name = basename(f, ext);
    const dir = dirname(f);
    const webpPath = join(dir, `${name}.webp`);

    try {
      console.log(`Processing: ${basename(f)}...`);
      // Resize huge >2.5K images to max 2560px width to prevent out-of-memory errors
      await sharp(f, { limitInputPixels: 0 })
        .resize({ width: 2560, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toFile(webpPath);
      
      console.log(`  ✅ Successfully converted → ${name}.webp`);
      convertedCount++;

      if (existsSync(webpPath) && f !== webpPath) {
        try { unlinkSync(f); } catch (e) {}
      }
    } catch (e) {
      console.error(`  ❌ Error processing ${basename(f)}:`, e.message);
    }
  }

  console.log(`\n🎉 Converted ${convertedCount} / ${targets.length} remaining images to WebP!`);
}

run();
