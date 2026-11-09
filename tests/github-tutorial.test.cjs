const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

test('vesper.html is cleanly removed as requested by user', () => {
  const filePath = path.join(rootDir, 'vesper.html');
  assert.equal(fs.existsSync(filePath), false, 'vesper.html should no longer exist');
});

test('tutorial-github.html exists and implements scrollable split layout (left analogy, right explanation)', () => {
  const filePath = path.join(rootDir, 'tutorial-github.html');
  assert.ok(fs.existsSync(filePath), 'tutorial-github.html must exist');

  const content = fs.readFileSync(filePath, 'utf8');

  // No popup / modal
  assert.equal(content.includes('modal-overlay'), false, 'Should not contain popup modal');
  assert.equal(content.includes('modal-card'), false, 'Should not contain modal card');

  // Scroll layout architecture: Split row with visual-column (left) and explain-column (right)
  assert.match(content, /class="section-row"/);
  assert.match(content, /class="visual-column"/);
  assert.match(content, /class="explain-column"/);

  // Section 1: Mesin Waktu vs WA
  assert.match(content, /Mesin Waktu Tim/);
  assert.match(content, /kasir_final_v2_BENERAN_fix\.c/);

  // Section 2: 4 Wilayah Kerja Git (Pipa)
  assert.match(content, /Pipa Alur Kerja/);
  assert.match(content, /packet-move/);
  assert.match(content, /git add/);
  assert.match(content, /git commit/);
  assert.match(content, /git push/);

  // Section 3: Feature Branching
  assert.match(content, /Pohon & Ranting/);
  assert.match(content, /feat\/modul-3-ui-console/);
  assert.match(content, /git checkout/);

  // Section 4: Siklus Harian Push & Pull
  assert.match(content, /Siklus Harian/);
  assert.match(content, /git pull origin/);

  // Section 5: Merge Conflict Markers
  assert.match(content, /&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD/);
  assert.match(content, /=======/);
  assert.match(content, /&gt;&gt;&gt;&gt;&gt;&gt;&gt;/);

  // Section 6: .gitignore & IntelliJ IDEA shortcuts
  assert.match(content, /\.idea\//);
  assert.match(content, /cmake-build-\*\//);
  assert.match(content, /\*\.exe/);
  assert.match(content, /Ctrl \+ K/);
  assert.match(content, /Ctrl \+ Shift \+ K/);

  // Minimal top bar with back navigation to daftarModul
  assert.match(content, /daftarModul\.html/);
});
