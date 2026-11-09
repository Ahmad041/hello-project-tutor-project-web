const fs = require('fs');
const path = require('path');
const { ICONS } = require('./lucide-dict.js');

const rootDir = path.resolve(__dirname, '..');

// Helper to replace all occurrences
function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

// ========================================================
// 1. UPDATE project.html
// ========================================================
console.log('Modernizing project.html...');
let project = fs.readFileSync(path.join(rootDir, 'project.html'), 'utf8');

// Hexagon brand & Daftar modul
project = replaceAll(project,
  '<span>⬡ HELLO PROJECT</span>',
  `${ICONS.hexagon}<span>HELLO PROJECT</span>`
);
project = replaceAll(project,
  '<span>Daftar Modul ↗</span>',
  `<span>Daftar Modul</span>${ICONS.arrowUpRight}`
);

// BAYANGKAN BEGINI
project = replaceAll(project,
  '<span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>',
  `<span class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 tracking-wider">${ICONS.lightbulb}<span>BAYANGKAN BEGINI</span></span>`
);

// Core Concept
project = replaceAll(project,
  '<span class="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">★ Core Concept</span>',
  `<span class="inline-flex items-center gap-1.5 text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">${ICONS.sparkles}<span>Core Concept</span></span>`
);

// Probis link button
project = replaceAll(project,
  'Buka Materi Probis Lengkap ➔',
  `<span>Buka Materi Probis Lengkap</span>${ICONS.arrowRight}`
);

// Terminal Audit lines in Act 05
project = replaceAll(project,
  '<p>✔ [SDLC] Scope &amp; Probis Toko: Terverifikasi</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[SDLC] Scope &amp; Probis Toko: Terverifikasi</span></p>`
);
project = replaceAll(project,
  '<p>✔ [MASTER] Relasi Kategori &amp; Produk P001: Siap</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[MASTER] Relasi Kategori &amp; Produk P001: Siap</span></p>`
);
project = replaceAll(project,
  '<p>✔ [TRANSAKSI] Append-only Nota Belanja: Valid</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[TRANSAKSI] Append-only Nota Belanja: Valid</span></p>`
);

// Step-nav script integration
if (!project.includes('assets/js/step-nav.js')) {
  project = project.replace('</body>', '  <!-- Navigation Integration Script -->\n  <script src="assets/js/step-nav.js"></script>\n</body>');
}

// 2D / 3D Representation Switcher in #data
if (!project.includes('representation-mode-bar')) {
  const modeBarHtml = `
            <!-- 2D / 3D Representation Switcher -->
            <div class="representation-mode-bar mt-6 p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-4" role="region" aria-label="Pilihan Representasi Master & Transaksi 2D / 3D">
              <div>
                <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">SIMULATOR DATA KASIRKITA</span>
                <h4 class="font-bold text-zinc-900 dark:text-white text-sm mt-0.5">Representasi Interaktif Master &amp; Transaksi</h4>
                <p class="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Eksplorasi pemisahan katalog statis vs keranjang transaksi dalam ruang vektor 2D atau kanvas 3D WebGL.</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <a href="game/boxes-2d.html" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-sm">
                  <span>Buka mode 2D</span>
                  ${ICONS.arrowUpRight}
                </a>
                <a href="game/boxes-analogy.html" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors shadow-sm">
                  <span>Buka mode 3D</span>
                  ${ICONS.arrowUpRight}
                </a>
              </div>
            </div>`;
  
  // Insert inside #data right before </article>
  project = project.replace(/(<article class="arch-card[^>]*id="data"[\s\S]*?)(<\/article>)/, `$1${modeBarHtml}\n          $2`);
}

fs.writeFileSync(path.join(rootDir, 'project.html'), project, 'utf8');
console.log('✓ project.html updated');

// ========================================================
// 2. UPDATE analisis.html
// ========================================================
console.log('Modernizing analisis.html...');
let analisis = fs.readFileSync(path.join(rootDir, 'analisis.html'), 'utf8');

// Hexagon brand & Daftar modul
analisis = replaceAll(analisis,
  '<span>⬡ HELLO PROJECT</span>',
  `${ICONS.hexagon}<span>HELLO PROJECT</span>`
);
analisis = replaceAll(analisis,
  '<span>Daftar Modul ↗</span>',
  `<span>Daftar Modul</span>${ICONS.arrowUpRight}`
);

// Hero badges
analisis = replaceAll(analisis,
  '⏱ ± 90 Menit',
  `<span class="inline-flex items-center gap-1.5">${ICONS.clock}<span>± 90 Menit</span></span>`
);
analisis = replaceAll(analisis,
  'Daftar Isi Modul 02 ↗',
  `<span>Daftar Isi Modul 02</span>${ICONS.arrowUpRight}`
);

// Bedah Anatomi badge
analisis = replaceAll(analisis,
  '<span class="anatomy-badge">🔬 BEDAH ANATOMI</span>',
  `<span class="anatomy-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-sky-400/10 border border-blue-500/20 dark:border-sky-400/20 text-blue-600 dark:text-sky-400 font-mono text-xs font-semibold">${ICONS.microscope}<span>BEDAH ANATOMI</span></span>`
);

// BAYANGKAN BEGINI
analisis = replaceAll(analisis,
  '<span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>',
  `<span class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 tracking-wider">${ICONS.lightbulb}<span>BAYANGKAN BEGINI</span></span>`
);

// Stepper buttons
analisis = replaceAll(analisis,
  '<button data-step-prev class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Sebelumnya">⏮ Prev</button>',
  `<button data-step-prev class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Sebelumnya">${ICONS.arrowLeft}<span>Prev</span></button>`
);
analisis = replaceAll(analisis,
  '<button data-step-next class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Selanjutnya">Next ⏭</button>',
  `<button data-step-next class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Selanjutnya"><span>Next</span>${ICONS.arrowRight}</button>`
);

// Download and simulator buttons
analisis = replaceAll(analisis,
  '<span>Unduh Contoh User Testing</span>\n                    <span>↓</span>',
  `<span>Unduh Contoh User Testing</span>\n                    ${ICONS.download}`
);
analisis = replaceAll(analisis,
  '<span>Unduh Contoh User Testing</span>\r\n                    <span>↓</span>',
  `<span>Unduh Contoh User Testing</span>\n                    ${ICONS.download}`
);
analisis = replaceAll(analisis,
  '<span>🎮 Buka Simulator Pengujian</span>\n                    <span>↗</span>',
  `${ICONS.gamepad}<span>Buka Simulator Pengujian</span>\n                    ${ICONS.arrowUpRight}`
);
analisis = replaceAll(analisis,
  '<span>🎮 Buka Simulator Pengujian</span>\r\n                    <span>↗</span>',
  `${ICONS.gamepad}<span>Buka Simulator Pengujian</span>\n                    ${ICONS.arrowUpRight}`
);
analisis = replaceAll(analisis,
  '<span>Unduh Proposal Lengkap</span>\n                    <span>↓</span>',
  `<span>Unduh Proposal Lengkap</span>\n                    ${ICONS.download}`
);
analisis = replaceAll(analisis,
  '<span>Unduh Proposal Lengkap</span>\r\n                    <span>↓</span>',
  `<span>Unduh Proposal Lengkap</span>\n                    ${ICONS.download}`
);
analisis = replaceAll(analisis,
  '<span>Unduh User Guide PDF</span>\n                    <span>↓</span>',
  `<span>Unduh User Guide PDF</span>\n                    ${ICONS.download}`
);
analisis = replaceAll(analisis,
  '<span>Unduh User Guide PDF</span>\r\n                    <span>↓</span>',
  `<span>Unduh User Guide PDF</span>\n                    ${ICONS.download}`
);

// Diagram Fig 2.3 emojis
analisis = replaceAll(analisis,
  '<text x="428" y="92" fill="#e2e8f0" font-size="10" font-family="monospace">📄 <tspan fill="#38bdf8" font-weight="700">Penjualan.txt</tspan>',
  '<text x="428" y="92" fill="#e2e8f0" font-size="10" font-family="monospace">[TXT] <tspan fill="#38bdf8" font-weight="700">Penjualan.txt</tspan>'
);
analisis = replaceAll(analisis,
  '<text x="428" y="110" fill="#e2e8f0" font-size="10" font-family="monospace">📄 <tspan fill="#fbbf24" font-weight="700">Member.txt</tspan>',
  '<text x="428" y="110" fill="#e2e8f0" font-size="10" font-family="monospace">[TXT] <tspan fill="#fbbf24" font-weight="700">Member.txt</tspan>'
);

// Terminal Audit lines in Act 05
analisis = replaceAll(analisis,
  '<p>✔ [UT] Matriks Skenario Uji: Terverifikasi</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[UT] Matriks Skenario Uji: Terverifikasi</span></p>`
);
analisis = replaceAll(analisis,
  '<p>✔ [DEFECT] Pelacakan Kasus Negatif: Valid</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[DEFECT] Pelacakan Kasus Negatif: Valid</span></p>`
);
analisis = replaceAll(analisis,
  '<p>✔ [DOCS] Product Documentation &amp; User Guide: Lengkap</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[DOCS] Product Documentation &amp; User Guide: Lengkap</span></p>`
);

// Footer link
analisis = replaceAll(analisis,
  'Lanjut ke Modul 03 (lib.h) ➔',
  `<span>Lanjut ke Modul 03 (lib.h)</span>${ICONS.arrowRight}`
);

fs.writeFileSync(path.join(rootDir, 'analisis.html'), analisis, 'utf8');
console.log('✓ analisis.html updated');

// ========================================================
// 3. UPDATE teknis.html
// ========================================================
console.log('Modernizing teknis.html...');
let teknis = fs.readFileSync(path.join(rootDir, 'teknis.html'), 'utf8');

// Hexagon brand & Daftar modul
teknis = replaceAll(teknis,
  '<span>⬡ HELLO PROJECT</span>',
  `${ICONS.hexagon}<span>HELLO PROJECT</span>`
);
teknis = replaceAll(teknis,
  '<span>Daftar Modul ↗</span>',
  `<span>Daftar Modul</span>${ICONS.arrowUpRight}`
);

// Hero badges
teknis = replaceAll(teknis,
  '⏱ ± 120 Menit',
  `<span class="inline-flex items-center gap-1.5">${ICONS.clock}<span>± 120 Menit</span></span>`
);
teknis = replaceAll(teknis,
  'Daftar Isi Modul 03 ↗',
  `<span>Daftar Isi Modul 03</span>${ICONS.arrowUpRight}`
);

// Bedah Anatomi badge
teknis = replaceAll(teknis,
  '<span class="anatomy-badge">🔬 BEDAH ANATOMI</span>',
  `<span class="anatomy-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-sky-400/10 border border-blue-500/20 dark:border-sky-400/20 text-blue-600 dark:text-sky-400 font-mono text-xs font-semibold">${ICONS.microscope}<span>BEDAH ANATOMI</span></span>`
);

// BAYANGKAN BEGINI
teknis = replaceAll(teknis,
  '<span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>',
  `<span class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 tracking-wider">${ICONS.lightbulb}<span>BAYANGKAN BEGINI</span></span>`
);

// Stepper buttons
teknis = replaceAll(teknis,
  '<button data-step-prev class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Sebelumnya">⏮ Prev</button>',
  `<button data-step-prev class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Sebelumnya">${ICONS.arrowLeft}<span>Prev</span></button>`
);
teknis = replaceAll(teknis,
  '<button data-step-next class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Selanjutnya">Next ⏭</button>',
  `<button data-step-next class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Selanjutnya"><span>Next</span>${ICONS.arrowRight}</button>`
);

// Download button
teknis = replaceAll(teknis,
  '<span>Unduh Template lib.h Lengkap</span>\n                    <span>↓</span>',
  `<span>Unduh Template lib.h Lengkap</span>\n                    ${ICONS.download}`
);
teknis = replaceAll(teknis,
  '<span>Unduh Template lib.h Lengkap</span>\r\n                    <span>↓</span>',
  `<span>Unduh Template lib.h Lengkap</span>\n                    ${ICONS.download}`
);

// Fig 3.1 Directory SVG emojis: replace 📁 with [DIR]
teknis = replaceAll(teknis, '📁 src/', '[DIR] src/');
teknis = replaceAll(teknis, '📁 include/', '[DIR] include/');
teknis = replaceAll(teknis, '📁 assets/', '[DIR] assets/');
teknis = replaceAll(teknis, '📁 build/', '[DIR] build/');

// Fig 3.7 warning in SVG: replace ⚠️ with [!]
teknis = replaceAll(teknis, '⚠️ Jika maxChar >= kapasitas', '[!] Jika maxChar >= kapasitas');

// Terminal Audit lines in Act 05
teknis = replaceAll(teknis,
  '<p>✔ [INCLUDE] Header lib.h Terpasang: Valid</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[INCLUDE] Header lib.h Terpasang: Valid</span></p>`
);
teknis = replaceAll(teknis,
  '<p>✔ [GOTOXY] Koordinat Terminal 80x25: Presisi</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[GOTOXY] Koordinat Terminal 80x25: Presisi</span></p>`
);
teknis = replaceAll(teknis,
  '<p>✔ [BUFFER] NUL Terminator &amp; Backspace: Aman</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[BUFFER] NUL Terminator &amp; Backspace: Aman</span></p>`
);

// Footer link
teknis = replaceAll(teknis,
  'Lanjut ke Modul 04 (ASCII Art) ➔',
  `<span>Lanjut ke Modul 04 (ASCII Art)</span>${ICONS.arrowRight}`
);

fs.writeFileSync(path.join(rootDir, 'teknis.html'), teknis, 'utf8');
console.log('✓ teknis.html updated');

// ========================================================
// 4. UPDATE testing.html
// ========================================================
console.log('Modernizing testing.html...');
let testing = fs.readFileSync(path.join(rootDir, 'testing.html'), 'utf8');

// Hexagon brand & Daftar modul
testing = replaceAll(testing,
  '<span>⬡ HELLO PROJECT</span>',
  `${ICONS.hexagon}<span>HELLO PROJECT</span>`
);
testing = replaceAll(testing,
  '<span>Daftar Modul ↗</span>',
  `<span>Daftar Modul</span>${ICONS.arrowUpRight}`
);

// Hero badges
testing = replaceAll(testing,
  '⏱ ± 90 Menit',
  `<span class="inline-flex items-center gap-1.5">${ICONS.clock}<span>± 90 Menit</span></span>`
);
testing = replaceAll(testing,
  'Daftar Isi Modul 04 ↗',
  `<span>Daftar Isi Modul 04</span>${ICONS.arrowUpRight}`
);

// Bedah Anatomi badge
testing = replaceAll(testing,
  '<span class="anatomy-badge">🔬 BEDAH ANATOMI</span>',
  `<span class="anatomy-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-sky-400/10 border border-blue-500/20 dark:border-sky-400/20 text-blue-600 dark:text-sky-400 font-mono text-xs font-semibold">${ICONS.microscope}<span>BEDAH ANATOMI</span></span>`
);

// BAYANGKAN BEGINI
testing = replaceAll(testing,
  '<span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>',
  `<span class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 tracking-wider">${ICONS.lightbulb}<span>BAYANGKAN BEGINI</span></span>`
);

// Stepper buttons
testing = replaceAll(testing,
  '<button data-step-prev class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Sebelumnya">⏮ Prev</button>',
  `<button data-step-prev class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Sebelumnya">${ICONS.arrowLeft}<span>Prev</span></button>`
);
testing = replaceAll(testing,
  '<button data-step-next class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Selanjutnya">Next ⏭</button>',
  `<button data-step-next class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Selanjutnya"><span>Next</span>${ICONS.arrowRight}</button>`
);

// Simulator button in details & footer
testing = replaceAll(testing,
  '🎮 Buka Simulator Pengujian ↗',
  `<span class="inline-flex items-center gap-2">${ICONS.gamepad}<span>Buka Simulator Pengujian</span>${ICONS.arrowUpRight}</span>`
);
testing = replaceAll(testing,
  '<span>Unduh Panduan ASCII Art</span>\n                    <span>↓</span>',
  `<span>Unduh Panduan ASCII Art</span>\n                    ${ICONS.download}`
);
testing = replaceAll(testing,
  '<span>Unduh Panduan ASCII Art</span>\r\n                    <span>↓</span>',
  `<span>Unduh Panduan ASCII Art</span>\n                    ${ICONS.download}`
);

// Terminal Audit lines in Act 05
testing = replaceAll(testing,
  '<p>✔ [ASCII] Banner Header 80x25: Terkalibrasi</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[ASCII] Banner Header 80x25: Terkalibrasi</span></p>`
);
testing = replaceAll(testing,
  '<p>✔ [PRINTTXT] File Reading &amp; Buffer Guard: Lulus</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[PRINTTXT] File Reading &amp; Buffer Guard: Lulus</span></p>`
);
testing = replaceAll(testing,
  '<p>✔ [UI] Layout Kasir &amp; Pesan Status: Bersih</p>',
  `<p class="flex items-center gap-2">${ICONS.checkCircle}<span>[UI] Layout Kasir &amp; Pesan Status: Bersih</span></p>`
);

fs.writeFileSync(path.join(rootDir, 'testing.html'), testing, 'utf8');
console.log('✓ testing.html updated');

// ========================================================
// 5. UPDATE daftarModul.html
// ========================================================
console.log('Modernizing daftarModul.html...');
let daftarModul = fs.readFileSync(path.join(rootDir, 'daftarModul.html'), 'utf8');
daftarModul = replaceAll(daftarModul,
  '(Panduan Git Tim ↗)',
  `(Panduan Git Tim <svg class="inline-block w-3.5 h-3.5 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" x2="17" y1="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>)`
);
daftarModul = replaceAll(daftarModul,
  '<span class="module-arrow" aria-hidden="true">↗</span>',
  `<span class="module-arrow" aria-hidden="true"><svg style="width:1em;height:1em;display:inline-block;vertical-align:middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" x2="17" y1="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>`
);
fs.writeFileSync(path.join(rootDir, 'daftarModul.html'), daftarModul, 'utf8');
console.log('✓ daftarModul.html updated');
