import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

async function scanAndConvert(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  let converted = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      converted = converted.concat(await scanAndConvert(full));
    } else if (/\.(png|jpe?g|bmp|tiff|gif)$/i.test(entry.name)) {
      const parsed = path.parse(full);
      const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);
      console.log(`Converting: ${entry.name} -> ${parsed.name}.webp`);
      const input = await fs.readFile(full);
      const webpBuf = await sharp(input).rotate().webp({ quality: 85, effort: 4 }).toBuffer();
      await fs.writeFile(webpPath, webpBuf);
      converted.push({ orig: full, webp: webpPath });
    }
  }
  return converted;
}

const publicDir = path.resolve('public');
console.log(`Scanning public directory: ${publicDir}`);
const results = await scanAndConvert(publicDir);
console.log(`Scan complete. Converted ${results.length} non-WebP images to WebP.`);
