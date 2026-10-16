const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

test('daftarModulToisi transition setup', () => {
  const videoPath = path.join(ROOT, 'assets/video/daftarModulToisi.mp4');
  assert.ok(fs.existsSync(videoPath), 'assets/video/daftarModulToisi.mp4 must exist');
  const stat = fs.statSync(videoPath);
  assert.ok(stat.size > 1000000, 'Video file should have valid non-empty content');

  const modulesJs = fs.readFileSync(path.join(ROOT, 'assets/js/modules.js'), 'utf8');
  assert.match(modulesJs, /assets\/video\/daftarModulToisi\.mp4/, 'modules.js should point to daftarModulToisi.mp4');
  assert.match(modulesJs, /opening-dialog/, 'modules.js should create opening-dialog');
  assert.match(modulesJs, /opening-skip/, 'modules.js should create opening-skip button');
  assert.match(modulesJs, /addEventListener\(['"]click['"]/, 'modules.js should intercept clicks on module callouts');
  assert.match(modulesJs, /window\.location\.assign/, 'modules.js should navigate to module target URL');
  assert.match(modulesJs, /pageshow/, 'modules.js should handle pageshow back navigation');

  const modulesCss = fs.readFileSync(path.join(ROOT, 'assets/css/modules.css'), 'utf8');
  assert.match(modulesCss, /\.opening-dialog/, 'modules.css must include opening-dialog styles');
  assert.match(modulesCss, /\.opening-skip/, 'modules.css must include opening-skip styles');
  assert.match(modulesCss, /body\.opening-playing/, 'modules.css must include body.opening-playing styles');

  const daftarModulHtml = fs.readFileSync(path.join(ROOT, 'daftarModul.html'), 'utf8');
  assert.match(daftarModulHtml, /assets\/css\/modules\.css/, 'daftarModul.html must link modules.css');
  assert.match(daftarModulHtml, /assets\/js\/modules\.js/, 'daftarModul.html must include modules.js');
  assert.match(daftarModulHtml, /class="module-callout module-1"/, 'daftarModul.html must contain module-callout');
});
