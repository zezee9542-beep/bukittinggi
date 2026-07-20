import sharp from 'sharp';
import { readdirSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ASSETS_DIR = join(__dirname, '../src/assets');

// Target images to convert to WebP (large PNGs that are bottlenecks)
const TARGETS = [
  'bg4.png',
  'a.png', 'b.png', 'c.png', 'd.png', 'e.png', 'f.png', 'g.png',
  'Group 12.png',
  'earth.png',
  'pp.png',
  'menara.png',
  'gunung.png',
  'makan.png',
  'sawah.png',
  'rumah.png',
  'son.png',
  'imgg.png',
  'gedeng.png',
  'cover.png',
  'bgg.png',
];

let converted = 0;
let skipped = 0;

for (const filename of TARGETS) {
  const inputPath = join(ASSETS_DIR, filename);
  const baseName = basename(filename, extname(filename));
  const outputPath = join(ASSETS_DIR, `${baseName}.webp`);

  if (!existsSync(inputPath)) {
    console.log(`⚠ Skipped (not found): ${filename}`);
    skipped++;
    continue;
  }

  if (existsSync(outputPath)) {
    console.log(`✓ Already exists: ${baseName}.webp`);
    skipped++;
    continue;
  }

  try {
    await sharp(inputPath)
      .webp({ quality: 82, effort: 4 })
      .toFile(outputPath);
    console.log(`✅ Converted: ${filename} → ${baseName}.webp`);
    converted++;
  } catch (err) {
    console.error(`✗ Failed: ${filename}`, err.message);
  }
}

console.log(`\nDone! Converted: ${converted}, Skipped/exists: ${skipped}`);
