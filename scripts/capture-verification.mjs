import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = 'C:/Users/ahamd/.gemini/antigravity/brain/b26c682d-ad95-4dba-b0f0-09a27746aa27';

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const targets = [
    { file: 'analisis.html', name: 'analisis', stepId: 'user-testing' },
    { file: 'teknis.html', name: 'teknis', stepId: 'lib-position' },
    { file: 'testing.html', name: 'testing', stepId: 'ui-sketch' }
  ];

  for (const t of targets) {
    const fileUrl = `file:///${path.join(rootDir, t.file).replace(/\\/g, '/')}`;
    console.log(`Navigating to ${fileUrl}...`);
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // 1. Hero Light
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.screenshot({ path: path.join(outDir, `${t.name}_hero_light.png`), clip: { x: 0, y: 0, width: 1280, height: 700 } });

    // 2. Hero Dark
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.screenshot({ path: path.join(outDir, `${t.name}_hero_dark.png`), clip: { x: 0, y: 0, width: 1280, height: 700 } });

    // 3. Diagram Section Dark
    const sectionEl = await page.$(`#${t.stepId}`);
    if (sectionEl) {
      // scroll to it
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      }, t.stepId);
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(outDir, `${t.name}_diagram_dark.png`) });

      // Click Tahap 2 button in diagram
      const btnTahap2 = await page.$(`#${t.stepId} [data-step-btn="2"]`);
      if (btnTahap2) {
        await btnTahap2.click();
        await new Promise(r => setTimeout(r, 400));
        await page.screenshot({ path: path.join(outDir, `${t.name}_diagram_step2_dark.png`) });
      }

      // Open details drawer
      const detailsSummary = await page.$(`#${t.stepId} details summary`);
      if (detailsSummary) {
        await detailsSummary.click();
        await new Promise(r => setTimeout(r, 400));
        await page.screenshot({ path: path.join(outDir, `${t.name}_details_open_dark.png`) });
      }
    }

    // 4. Close Section Dark
    await page.evaluate(() => {
      const close = document.getElementById('close-section');
      if (close) close.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(outDir, `${t.name}_close_section_dark.png`) });
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
