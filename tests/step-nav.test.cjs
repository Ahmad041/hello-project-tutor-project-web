const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

test('step-nav HUD script and CSS interaction integrity', () => {
  const jsPath = path.join(ROOT, 'assets/js/step-nav.js');
  const cssPath = path.join(ROOT, 'assets/css/site.css');

  assert.ok(fs.existsSync(jsPath), 'assets/js/step-nav.js must exist');
  assert.ok(fs.existsSync(cssPath), 'assets/css/site.css must exist');

  const jsContent = fs.readFileSync(jsPath, 'utf8');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  // 1. CSS rules for hiding and showing flyout menu
  assert.match(cssContent, /\.step-flyout-menu\[hidden\]/i, 'CSS must enforce hidden on .step-flyout-menu[hidden]');
  assert.match(cssContent, /display:\s*none\s*!important/i, 'CSS must use display: none !important when hidden');
  assert.match(cssContent, /\.floating-step-hud\.is-open\s+\.step-flyout-menu:not\(\[hidden\]\)\s*\{\s*display:\s*flex\s*!important/i, 'CSS must show flex when HUD is open and not hidden');
  assert.match(cssContent, /\.step-flyout-close/i, 'CSS must style .step-flyout-close button');

  // 2. JS interaction methods and event handling
  assert.match(jsContent, /function scrollToStep/, 'JS must define scrollToStep function');
  assert.match(jsContent, /function closeMenu/, 'JS must define closeMenu function');
  assert.match(jsContent, /function openMenu/, 'JS must define openMenu function');
  assert.match(jsContent, /closeBtn\.addEventListener\('click'/, 'JS must bind click handler to closeBtn');
  assert.match(jsContent, /stopPropagation/, 'JS handlers must stop event propagation to avoid re-triggering');
  assert.match(jsContent, /window\.scrollTo/, 'scrollToStep must scroll window smoothly');
  assert.match(jsContent, /step-back-top/, 'JS must handle step-back-top navigation');

  // 3. Module HTML pages must include step-nav.js
  const modulePages = ['project.html', 'analisis.html', 'teknis.html', 'testing.html'];
  for (const page of modulePages) {
    const pageContent = fs.readFileSync(path.join(ROOT, page), 'utf8');
    assert.match(pageContent, /assets\/js\/step-nav\.js/, `${page} must include assets/js/step-nav.js`);
  }
});
