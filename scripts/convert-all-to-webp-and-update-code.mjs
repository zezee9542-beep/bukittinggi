import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync, readFileSync, existsSync, unlinkSync } from 'fs';
import { join, extname, basename, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

const DIRS_TO_SCAN = [
  join(ROOT_DIR, 'src/assets'),
  join(ROOT_DIR, 'public/assets'),
  join(ROOT_DIR, 'public'),
];

// File extensions of images to convert
const IMAGE_EXTS = ['.png', '.jpg', '.jpeg'];

function getFilesRecursively(dirPath, arrayOfFiles = []) {
  if (!dirPath || !existsSync(dirPath) || !statSync(dirPath).isDirectory()) return arrayOfFiles;
  const files = readdirSync(dirPath);

  for (const file of files) {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      getFilesRecursively(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

async function convertImages() {
  console.log('🔄 Converting all PNG/JPG/JPEG images to WebP format...\n');

  let allImageFiles = [];
  for (const dir of DIRS_TO_SCAN) {
    const files = getFilesRecursively(dir);
    for (const f of files) {
      const ext = extname(f).toLowerCase();
      if (IMAGE_EXTS.includes(ext)) {
        allImageFiles.push(f);
      }
    }
  }

  // Deduplicate
  allImageFiles = [...new Set(allImageFiles)];

  const convertedMap = new Map(); // oldFilename -> newWebpFilename
  let convertedCount = 0;
  let skippedCount = 0;

  for (const inputPath of allImageFiles) {
    const dir = dirname(inputPath);
    const fileName = basename(inputPath);
    const ext = extname(inputPath);
    const nameWithoutExt = basename(inputPath, ext);
    const outputPath = join(dir, `${nameWithoutExt}.webp`);

    try {
      // Convert to webp with sharp
      await sharp(inputPath)
        .webp({ quality: 82, effort: 6 })
        .toFile(outputPath);

      console.log(`✅ Converted: ${fileName} → ${nameWithoutExt}.webp`);
      convertedMap.set(fileName, `${nameWithoutExt}.webp`);
      convertedCount++;

      // Delete old non-webp image file if distinct from webp
      if (inputPath !== outputPath && existsSync(outputPath)) {
        try {
          unlinkSync(inputPath);
          console.log(`  🗑 Deleted old file: ${fileName}`);
        } catch (err) {
          console.warn(`  ⚠ Could not delete ${fileName}: ${err.message}`);
        }
      }
    } catch (err) {
      console.error(`❌ Failed converting ${fileName}:`, err.message);
      skippedCount++;
    }
  }

  console.log(`\n==========================================`);
  console.log(`🎉 Images converted to WebP: ${convertedCount} (Skipped/Failed: ${skippedCount})`);
  console.log(`==========================================\n`);

  return convertedMap;
}

function updateCodeReferences() {
  console.log('📝 Updating code references to .webp across project...\n');

  const srcFiles = getFilesRecursively(join(ROOT_DIR, 'src'));
  const rootFiles = [
    join(ROOT_DIR, 'index.html'),
  ].filter(f => existsSync(f));

  const allCodeFiles = [...srcFiles, ...rootFiles].filter(f => {
    const ext = extname(f).toLowerCase();
    return ['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.json'].includes(ext);
  });

  let modifiedFilesCount = 0;

  // Regex to replace .png, .jpg, .jpeg inside quotes or strings with .webp
  // Matches e.g. "foo.png", 'bar.jpg', /assets/baz.jpeg
  const imageRegex = /([a-zA-Z0-9_\-\s()%]+)\.(png|jpg|jpeg)\b/gi;

  for (const filePath of allCodeFiles) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      if (!imageRegex.test(content)) continue;

      // Replace file extensions .png / .jpg / .jpeg with .webp
      const updatedContent = content.replace(imageRegex, '$1.webp');

      if (content !== updatedContent) {
        writeFileSync(filePath, updatedContent, 'utf-8');
        const relativePath = relative(ROOT_DIR, filePath);
        console.log(`✏ Updated imports/references in: ${relativePath}`);
        modifiedFilesCount++;
      }
    } catch (err) {
      console.error(`❌ Error updating ${filePath}:`, err.message);
    }
  }

  console.log(`\n==========================================`);
  console.log(`🎉 Updated ${modifiedFilesCount} source code files!`);
  console.log(`==========================================\n`);
}

async function main() {
  await convertImages();
  updateCodeReferences();
}

main();
