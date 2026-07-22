import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync, readFileSync, existsSync, unlinkSync } from 'fs';
import { join, extname, basename, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Scan all of src and public recursively
const DIRS_TO_SCAN = [
  join(ROOT_DIR, 'src'),
  join(ROOT_DIR, 'public'),
];

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

// Find all code files to update references in
function getCodeFiles() {
  const allFiles = getFilesRecursively(ROOT_DIR);
  return allFiles.filter(f => {
    const rel = relative(ROOT_DIR, f);
    // Ignore node_modules, .git, dist, .agents, .pnpm-store, etc.
    if (rel.includes('node_modules') || rel.startsWith('.git') || rel.startsWith('dist') || rel.startsWith('.agents') || rel.startsWith('.pnpm-store')) {
      return false;
    }
    const ext = extname(f).toLowerCase();
    return ['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.json'].includes(ext);
  });
}

async function main() {
  console.log('🔍 Scanning for all PNG files in src and public...');
  let pngFiles = [];
  for (const dir of DIRS_TO_SCAN) {
    const files = getFilesRecursively(dir);
    for (const f of files) {
      if (extname(f).toLowerCase() === '.png') {
        pngFiles.push(f);
      }
    }
  }

  // Deduplicate
  pngFiles = [...new Set(pngFiles)];
  console.log(`Found ${pngFiles.length} PNG files to convert.\n`);

  const convertedFilesMap = new Map(); // original base name -> webp base name
  let convertedCount = 0;
  let failedCount = 0;

  for (const f of pngFiles) {
    const dir = dirname(f);
    const originalName = basename(f);
    const nameWithoutExt = basename(f, extname(f));
    const outputPath = join(dir, `${nameWithoutExt}.webp`);

    console.log(`Converting: ${relative(ROOT_DIR, f)}`);
    try {
      // Convert to webp
      await sharp(f, { limitInputPixels: 0 })
        .webp({ quality: 80, effort: 4 })
        .toFile(outputPath);

      console.log(`  ✅ Created: ${nameWithoutExt}.webp`);
      convertedFilesMap.set(originalName, `${nameWithoutExt}.webp`);
      convertedCount++;

      // Delete the original PNG file
      if (existsSync(outputPath) && f !== outputPath) {
        try {
          unlinkSync(f);
          console.log(`  🗑 Deleted: ${originalName}`);
        } catch (e) {
          console.error(`  ❌ Failed to delete ${originalName}: ${e.message}`);
        }
      }
    } catch (e) {
      console.error(`  ❌ Failed to convert ${originalName}: ${e.message}`);
      failedCount++;
    }
  }

  console.log(`\nConversion summary: ${convertedCount} succeeded, ${failedCount} failed.\n`);

  if (convertedFilesMap.size === 0) {
    console.log('No images converted. Checking code references for any existing PNG names just in case...');
  }

  console.log('📝 Updating code references...');
  const codeFiles = getCodeFiles();
  let modifiedFilesCount = 0;

  for (const codeFile of codeFiles) {
    try {
      const content = readFileSync(codeFile, 'utf-8');
      let updatedContent = content;
      let hasChanges = false;

      // Replace references to all converted PNG files
      for (const [pngName, webpName] of convertedFilesMap.entries()) {
        // Escape special regex characters in pngName
        const escapedName = pngName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Match occurrences of this file name
        const regex = new RegExp(escapedName, 'gi');
        if (regex.test(updatedContent)) {
          updatedContent = updatedContent.replace(regex, webpName);
          hasChanges = true;
        }
      }

      // Also do a general replacement for generic references to other .png files,
      // but ensure we don't touch openstreetmap urls or other external links.
      // We search for standard patterns like "/something.png" or "something.png"
      // where the filename is not openstreetmap.
      // Let's match: e.g. "path/to/image.png" but not matching tile.openstreetmap.org
      // Let's use a regex that matches any filename ending in .png and replace with .webp,
      // as long as it's not preceded by osm/openstreetmap.
      const generalPngRegex = /(?<!openstreetmap\.org\/\{z\}\/\{x\}\/\{y\})\b([a-zA-Z0-9_\-\s()%]+)\.png\b/gi;
      if (generalPngRegex.test(updatedContent)) {
        updatedContent = updatedContent.replace(generalPngRegex, '$1.webp');
        hasChanges = true;
      }

      if (hasChanges && content !== updatedContent) {
        writeFileSync(codeFile, updatedContent, 'utf-8');
        console.log(`✏️ Updated references in: ${relative(ROOT_DIR, codeFile)}`);
        modifiedFilesCount++;
      }
    } catch (e) {
      console.error(`❌ Failed to update references in ${codeFile}: ${e.message}`);
    }
  }

  console.log(`\n🎉 Code references update complete. Updated ${modifiedFilesCount} files.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
});
