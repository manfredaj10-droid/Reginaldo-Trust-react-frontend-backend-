import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('frontend/src/pages/Gallery.jsx', 'utf8');
const matches = content.match(/"src":\s*"([^"]+)"/g) || [];
const pubDir = 'frontend/public';
const missing = [];
for (const m of matches) {
  const p = m.split(':')[1].replace(/["\s]/g, '');
  if (!fs.existsSync(path.join(pubDir, p))) missing.push(p);
}
console.log('Missing in Gallery.jsx:', [...new Set(missing)]);
