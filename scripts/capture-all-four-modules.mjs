import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\ahamd\\AppData\\Local\\Temp\\chrome-verify-all-four';
const outDir = 'C:/Users/ahamd/.gemini/antigravity/brain/b26c682d-ad95-4dba-b0f0-09a27746aa27';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function capture() {
  if (fs.existsSync(userDataDir)) {
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
  }

  const chromeProc = spawn(chromePath, [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9228',
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ]);

  try {
    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch('http://127.0.0.1:9228/json');
        const tabs = await res.json();
        const t = tabs.find(x => x.type === 'page');
        if (t && t.webSocketDebuggerUrl) {
          wsUrl = t.webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
      await sleep(300);
    }

    if (!wsUrl) throw new Error('Chrome did not launch debugger');

    const ws = new WebSocket(wsUrl);
    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        const cb = callbacks.get(data.id);
        callbacks.delete(data.id);
        cb(data);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const curId = id++;
        callbacks.set(curId, resolve);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await new Promise((resolve) => {
      if (ws.readyState === WebSocket.OPEN) resolve();
      else ws.onopen = resolve;
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    const modules = [
      { file: 'project.html', name: 'modul01', diagSelector: '#act-signature-move', stepId: 'data', detailsSelector: '#data .representation-mode-bar' },
      { file: 'analisis.html', name: 'modul02', diagSelector: '#user-testing .story-anatomy', stepId: 'user-testing', detailsSelector: '#user-testing details' },
      { file: 'teknis.html', name: 'modul03', diagSelector: '#lib-position .story-anatomy', stepId: 'lib-position', detailsSelector: '#lib-position details' },
      { file: 'testing.html', name: 'modul04', diagSelector: '#ui-sketch .story-anatomy', stepId: 'ui-sketch', detailsSelector: '#ui-sketch details' }
    ];

    for (const mod of modules) {
      console.log(`Processing ${mod.file}...`);
      const fileUrl = `file:///c:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/${mod.file}`;
      await send('Page.navigate', { url: fileUrl });
      await sleep(1500);

      // 1. Dark Mode Hero
      await send('Runtime.evaluate', { expression: `document.documentElement.classList.add('dark'); window.scrollTo(0, 0);` });
      await sleep(500);
      let ss = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${mod.name}_hero_dark.png`), Buffer.from(ss.result.data, 'base64'));

      // 2. Light Mode Hero
      await send('Runtime.evaluate', { expression: `document.documentElement.classList.remove('dark'); window.scrollTo(0, 0);` });
      await sleep(500);
      ss = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${mod.name}_hero_light.png`), Buffer.from(ss.result.data, 'base64'));

      // Switch back to dark mode
      await send('Runtime.evaluate', { expression: `document.documentElement.classList.add('dark');` });

      // 3. Technical Diagram & Stepper Section
      await send('Runtime.evaluate', {
        expression: `
          const el = document.querySelector('${mod.diagSelector}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        `
      });
      await sleep(600);
      ss = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${mod.name}_diagram_dark.png`), Buffer.from(ss.result.data, 'base64'));

      // 4. Details / Material Section (Open drawer)
      await send('Runtime.evaluate', {
        expression: `
          const d = document.querySelector('${mod.detailsSelector}');
          if (d) {
            if (d.tagName === 'DETAILS') d.open = true;
            d.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        `
      });
      await sleep(600);
      ss = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${mod.name}_details_open_dark.png`), Buffer.from(ss.result.data, 'base64'));

      // 5. Terminal Audit Close Section
      await send('Runtime.evaluate', {
        expression: `
          const audit = document.querySelector('section:last-of-type') || document.querySelector('footer');
          if (audit) audit.scrollIntoView({ behavior: 'instant', block: 'center' });
          else window.scrollTo(0, document.body.scrollHeight);
        `
      });
      await sleep(600);
      ss = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${mod.name}_terminal_dark.png`), Buffer.from(ss.result.data, 'base64'));
    }

    console.log('All 4 modules captured successfully in dark & light!');
    ws.close();
  } finally {
    try { chromeProc.kill(); } catch (e) {}
  }
}

capture().catch(console.error);
