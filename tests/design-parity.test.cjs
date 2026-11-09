const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

test('assets/js/anatomy-scroll.js exists and is valid JavaScript', () => {
  const scriptPath = path.join(rootDir, 'assets', 'js', 'anatomy-scroll.js');
  assert.ok(fs.existsSync(scriptPath), 'assets/js/anatomy-scroll.js must exist');
  
  const content = fs.readFileSync(scriptPath, 'utf8');
  assert.doesNotThrow(() => {
    new Function(content);
  }, 'anatomy-scroll.js must parse cleanly without syntax errors');
});

const modules = [
  { file: 'analisis.html', name: 'Modul 02', figures: ['Fig 2.1', 'Fig 2.3'] },
  { file: 'teknis.html', name: 'Modul 03', figures: ['Fig 3.5', 'Fig 3.7'] },
  { file: 'testing.html', name: 'Modul 04', figures: ['Fig 4.1', 'Fig 4.3'] }
];

modules.forEach(({ file, name, figures }) => {
  test(`${name} (${file}) satisfies 100% UI parity with Modul 01 and scrollytelling specs`, () => {
    const filePath = path.join(rootDir, file);
    assert.ok(fs.existsSync(filePath), `${file} must exist`);
    const html = fs.readFileSync(filePath, 'utf8');

    // 1. Typography: Google Fonts Inter & Space Grotesk
    assert.match(html, /fonts\.googleapis\.com.*family=Inter/i, `${file} must include Google Fonts Inter`);
    assert.match(html, /fonts\.googleapis\.com.*family=Space\+Grotesk/i, `${file} must include Google Fonts Space Grotesk`);

    // 2. Engine: Tailwind CSS CDN with zinc-925/950 colors
    assert.match(html, /cdn\.tailwindcss\.com/i, `${file} must include Tailwind CSS CDN`);
    assert.match(html, /925:\s*['"]#111114['"]/i, `${file} must configure zinc-925`);
    assert.match(html, /950:\s*['"]#09090b['"]/i, `${file} must configure zinc-950`);

    // 3. Dual-Theme: Zero-FOUC script
    assert.match(html, /localStorage\.getItem\(['"]kasirkita-theme['"]\)/, `${file} must include Zero-FOUC theme script`);
    assert.match(html, /prefers-color-scheme:\s*dark/, `${file} must check prefers-color-scheme`);

    // 4. Chrome: Floating Theme Toggle Capsule & Reading Progress (NO NAVBAR!)
    assert.match(html, /id=["']theme-btn-light["']/, `${file} must include theme-btn-light`);
    assert.match(html, /id=["']theme-btn-dark["']/, `${file} must include theme-btn-dark`);
    assert.match(html, /data-sc-progress/, `${file} must include top reading progress bar`);
    assert.ok(!html.includes('<nav'), `${file} must NOT contain any <nav> switcher navbar (1:1 parity with project.html)`);

    // 5. Architectural Cards & Drawers
    assert.match(html, /class=["'][^"']*arch-card[^"']*["']/, `${file} must use arch-card components`);
    assert.match(html, /class=["'][^"']*arch-details[^"']*["']/, `${file} must use arch-details drawers`);

    // 6. Surgical Technical Scrollytelling & Stepper
    assert.match(html, /data-anatomy-scroll/, `${file} must include data-anatomy-scroll on diagrams`);
    assert.match(html, /data-step-btn|data-step-prev|data-step-next/, `${file} must include manual stepper controls on diagrams`);
    assert.match(html, /assets\/js\/anatomy-scroll\.js/, `${file} must load assets/js/anatomy-scroll.js`);

    // 7. Preserved Key Figures
    figures.forEach(fig => {
      assert.ok(html.includes(fig), `${file} must preserve ${fig}`);
    });
  });
});
