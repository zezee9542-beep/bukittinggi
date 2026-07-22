import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync, readFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIRS_TO_SCAN = [
  join(__dirname, '../src/assets'),
  join(__dirname, '../public/assets'),
  join(__dirname, '../public'),
];

function getAllImageFiles(dirPath, arrayOfFiles = []) {
  if (!dirPath || !statSync(dirPath).isDirectory()) return arrayOfFiles;
  const files = readdirSync(dirPath);

  for (const file of files) {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      getAllImageFiles(fullPath, arrayOfFiles);
    } else {
      const ext = extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  }
  return arrayOfFiles;
}

async function compressAll() {
  console.log('🚀 Starting image compression across the project...\n');

  let allFiles = [];
  for (const dir of DIRS_TO_SCAN) {
    try {
      getAllImageFiles(dir, allFiles);
    } catch (e) {
      // dir might not exist
    }
  }

  // Deduplicate
  allFiles = [...new Set(allFiles)];

  let totalOriginal = 0;
  let totalCompressed = 0;
  let successCount = 0;
  let failCount = 0;

  for (const filePath of allFiles) {
    const ext = extname(filePath).toLowerCase();
    const origSize = statSync(filePath).size;
    
    // Skip tiny files (< 2KB) as compression won't yield significant gain
    if (origSize < 2048) {
      continue;
    }

    try {
      let pipeline = sharp(filePath);
      let buffer;

      if (ext === '.png') {
        buffer = await pipeline
          .png({ quality: 82, compressionLevel: 9, palette: true, effort: 7 })
          .toBuffer();
      } else if (ext === '.jpg' || ext === '.jpeg') {
        buffer = await pipeline
          .jpeg({ quality: 82, mozjpeg: true })
          .toBuffer();
      } else if (ext === '.webp') {
        buffer = await pipeline
          .webp({ quality: 82, effort: 6 })
          .toBuffer();
      }

      if (buffer && buffer.length < origSize) {
        writeFileSync(filePath, buffer);
        const newSize = buffer.length;
        const savedPercent = (((origSize - newSize) / origSize) * 100).toFixed(1);
        console.log(`✅ [${ext.toUpperCase()}] ${(origSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB (-${savedPercent}%) : ${filePath.split('\\').pop()}`);
        totalOriginal += origSize;
        totalCompressed += newSize;
        successCount++;
      } else {
        totalOriginal += origSize;
        totalCompressed += origSize;
        console.log(`ℹ Skipped (already optimized): ${filePath.split('\\').pop()}`);
      }
    } catch (err) {
      console.error(`❌ Failed to compress: ${filePath.split('\\').pop()}`, err.message);
      failCount++;
    }
  }

  const totalSavedMB = ((totalOriginal - totalCompressed) / 1024 / 1024).toFixed(2);
  const totalSavedPercent = (((totalOriginal - totalCompressed) / totalOriginal) * 100).toFixed(1);

  console.log('\n==========================================');
  console.log(`🎉 COMPRESSION COMPLETE!`);
  console.log(`Files Processed: ${successCount}`);
  console.log(`Original Total:  ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`New Total:       ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total Saved:     ${totalSavedMB} MB (-${totalSavedPercent}%)`);
  console.log('==========================================\n');
}

compressAll();
