import fs from 'fs';
import { db } from './server/src/config/db.js';

// Read GALLERY_ITEMS from Gallery.jsx
const content = fs.readFileSync('frontend/src/pages/Gallery.jsx', 'utf8');
const start = content.indexOf('const GALLERY_ITEMS = [');
const end = content.indexOf('];\n\nconst FILTER_TABS', start);
const jsonStr = content.slice(start + 'const GALLERY_ITEMS = '.length, end + 1);
const galleryItems = JSON.parse(jsonStr);

console.log(`Parsed ${galleryItems.length} gallery items from Gallery.jsx`);
console.log('Sample item:', galleryItems[0]);

// Clear old gallery table and reseed with exact items from Gallery.jsx
db.exec('DELETE FROM gallery');
const insert = db.prepare(`
  INSERT INTO gallery (category, tag, caption, src, alt)
  VALUES (?, ?, ?, ?, ?)
`);

for (const item of galleryItems) {
  insert.run(item.category, item.tag, item.caption, item.src, item.alt);
}

const count = db.prepare('SELECT count(*) as count FROM gallery').get().count;
console.log(`Reseeded SQLite gallery table with ${count} items!`);
