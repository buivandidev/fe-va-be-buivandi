const fs = require('fs');
const path = require('path');

const files = [
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\dang-ky\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\thanh-toan\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\ho-so\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\lich-hen\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\doi-mat-khau\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\tai-lieu\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\dich-vu-cong\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\quan-ly-tai-lieu\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\quan-ly-ho-so\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\thong-bao\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\dich-vu-cong\\[id]\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\dang-nhap\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\dat-lai-mat-khau\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\doi-mat-khau-thanh-cong\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\tra-cuu\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\quen-mat-khau\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\thu-vien\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\tim-kiem\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\to-chuc\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\tin-tuc\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\lien-he\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\mot-cua\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\tin-tuc\\[slug]\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\nop-ho-so\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\thu-vien\\album\\[id]\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\lien-he\\gop-y\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\lien-he\\hoi-dap\\page.tsx',
  'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\thu-vien\\video\\[id]\\page.tsx',
];

const modifiedFiles = [];

files.forEach(file => {
  try {
    if (!fs.existsSync(file)) {
      console.log(`SKIP: ${file} - file not found`);
      return;
    }

    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;

    // Replace className="material-symbols-outlined with className="material-symbols-outlined gov-icon
    // But only if gov-icon doesn't already follow immediately
    content = content.replace(/className="material-symbols-outlined([^"]*)"([^>]*>)/g, (match, attrs, after) => {
      // Check if gov-icon already follows material-symbols-outlined
      if (attrs.includes('gov-icon')) {
        return match;
      }
      // Add gov-icon after material-symbols-outlined
      return `className="material-symbols-outlined gov-icon${attrs}"${after}`;
    });

    // Also handle single quotes
    content = content.replace(/className='material-symbols-outlined([^']*)'([^>]*>)/g, (match, attrs, after) => {
      // Check if gov-icon already follows material-symbols-outlined
      if (attrs.includes('gov-icon')) {
        return match;
      }
      // Add gov-icon after material-symbols-outlined
      return `className='material-symbols-outlined gov-icon${attrs}'${after}`;
    });

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf-8');
      modifiedFiles.push(file);
      console.log(`MODIFIED: ${file}`);
    } else {
      console.log(`NO CHANGE: ${file}`);
    }
  } catch (error) {
    console.log(`ERROR: ${file} - ${error.message}`);
  }
});

console.log(`\nTotal modified files: ${modifiedFiles.length}`);
process.exit(0);
