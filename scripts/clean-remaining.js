const fs = require('fs');
const path = require('path');
const { ICONS } = require('./lucide-dict.js');

const rootDir = path.resolve(__dirname, '..');

function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

// 1. Add step-nav.js to all modules
const modules = ['analisis.html', 'teknis.html', 'testing.html'];
modules.forEach(m => {
  let content = fs.readFileSync(path.join(rootDir, m), 'utf8');
  if (!content.includes('assets/js/step-nav.js')) {
    content = content.replace('</body>', '  <!-- Navigation Integration Script -->\n  <script src="assets/js/step-nav.js"></script>\n</body>');
    fs.writeFileSync(path.join(rootDir, m), content, 'utf8');
    console.log(`✓ Added step-nav.js to ${m}`);
  }
});

// 2. Clean remaining glyphs in project.html
let project = fs.readFileSync(path.join(rootDir, 'project.html'), 'utf8');
project = replaceAll(project, '(Kategori ➔ Produk)', '(Kategori &rarr; Produk)');
fs.writeFileSync(path.join(rootDir, 'project.html'), project, 'utf8');
console.log('✓ Cleaned project.html');

// 3. Clean remaining glyphs in analisis.html
let analisis = fs.readFileSync(path.join(rootDir, 'analisis.html'), 'utf8');
analisis = replaceAll(analisis, '>PASS ✓<', '>PASS [OK]<');
analisis = replaceAll(analisis, '>FAIL ✕<', '>FAIL [DEFECT]<');
analisis = replaceAll(analisis, '📄 <tspan', '[TXT] <tspan');
fs.writeFileSync(path.join(rootDir, 'analisis.html'), analisis, 'utf8');
console.log('✓ Cleaned analisis.html');

// 4. Clean remaining glyphs in teknis.html
let teknis = fs.readFileSync(path.join(rootDir, 'teknis.html'), 'utf8');
teknis = replaceAll(teknis, 'SUMBU X ➔', 'SUMBU X &rarr;');
teknis = replaceAll(teknis, 'SUMBU Y ➔', 'SUMBU Y &rarr;');
teknis = replaceAll(teknis, '⚠️ Jika maxChar >= kapasitas', '[!] Jika maxChar >= kapasitas');
fs.writeFileSync(path.join(rootDir, 'teknis.html'), teknis, 'utf8');
console.log('✓ Cleaned teknis.html');

// 5. Upgrade game/uat.html
let uat = fs.readFileSync(path.join(rootDir, 'game/uat.html'), 'utf8');
uat = replaceAll(uat, '<span>🔐</span> Level 1: Login', `${ICONS.lock} Level 1: Login`);
uat = replaceAll(uat, '<span>📦</span> Level 2: Tambah', `<svg class="w-4 h-4 shrink-0 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> Level 2: Tambah`);
uat = replaceAll(uat, '<span>📋</span> Level 3: Tampil', `<svg class="w-4 h-4 shrink-0 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg> Level 3: Tampil`);
uat = replaceAll(uat, '<span>⚙️</span> Level 4: Edit/Hapus', `<svg class="w-4 h-4 shrink-0 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Level 4: Edit/Hapus`);
uat = replaceAll(uat, '<span>⚡</span> Suntik Skenario MS002', `${ICONS.zap} Suntik Skenario MS002`);
fs.writeFileSync(path.join(rootDir, 'game/uat.html'), uat, 'utf8');
console.log('✓ Modernized game/uat.html');
