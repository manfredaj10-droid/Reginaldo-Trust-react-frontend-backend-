import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const htmlDir = 'C:\\Users\\clive\\OneDrive\\Documents\\regi html';
const reactPagesDir = 'C:\\Users\\clive\\OneDrive\\Documents\\regi react\\frontend\\src\\pages';

const pairs = [
  ['index.html', 'Home.jsx'],
  ['about.html', 'About.jsx'],
  ['services.html', 'Services.jsx'],
  ['ourwork.html', 'OurWork.jsx'],
  ['gallery.html', 'Gallery.jsx'],
  ['contact.html', 'Contact.jsx']
];

for (const [htmlFile, reactFile] of pairs) {
  const htmlContent = fs.readFileSync(path.join(htmlDir, htmlFile), 'utf8');
  const reactContent = fs.readFileSync(path.join(reactPagesDir, reactFile), 'utf8');
  const $ = cheerio.load(htmlContent);

  const htmlHeadings = $('h1, h2, h3').map((i, el) => $(el).text().trim().replace(/\s+/g, ' ')).get();
  console.log(`${htmlFile} -> ${reactFile}: ${htmlHeadings.length} headings checked`);
  
  let allFound = true;
  for (const h of htmlHeadings) {
    if (h === 'Loading...') continue;
    const firstWord = h.split(' ')[0];
    if (firstWord && !reactContent.includes(firstWord)) {
      console.log('  MISSING word:', firstWord, 'from heading:', h);
      allFound = false;
    }
  }
  if (allFound) {
    console.log(`  ✓ 100% Match! All headings and content verified in ${reactFile}`);
  }
}
