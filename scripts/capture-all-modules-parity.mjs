import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\ahamd\\AppData\\Local\\Temp\\chrome-verify-parity';
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
    '--remote-debugging-port=9227',
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ]);

  try {
    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch('http://127.0.0.1:9227/json');
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

    const pages = [
      { file: 'analisis.html', name: 'analisis', stepId: 'user-testing' },
      { file: 'teknis.html', name: 'teknis', stepId: 'lib-position' },
      { file: 'testing.html', name: 'testing', stepId: 'ui-sketch' }
    ];

    for (const p of pages) {
      console.log(`Processing ${p.file}...`);
      await send('Page.navigate', {
        url: `file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/${p.file}`
      });
      await sleep(1500);

      // 1. Hero Light Mode
      await send('Runtime.evaluate', {
        expression: `document.documentElement.classList.remove('dark'); window.scrollTo(0, 0);`
      });
      await sleep(400);
      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${p.name}_hero_light.png`), Buffer.from(shot.result.data, 'base64'));

      // 2. Hero Dark Mode
      await send('Runtime.evaluate', {
        expression: `document.documentElement.classList.add('dark'); window.scrollTo(0, 0);`
      });
      await sleep(400);
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${p.name}_hero_dark.png`), Buffer.from(shot.result.data, 'base64'));

      // 3. Scroll to Diagram (Dark Mode)
      await send('Runtime.evaluate', {
        expression: `
          const el = document.getElementById('${p.stepId}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        `
      });
      await sleep(500);
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${p.name}_diagram_dark.png`), Buffer.from(shot.result.data, 'base64'));

      // 4. Click Tahap 2
      await send('Runtime.evaluate', {
        expression: `
          const btn = document.querySelector('#${p.stepId} [data-step-btn="2"]');
          if (btn) btn.click();
        `
      });
      await sleep(500);
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${p.name}_diagram_step2_dark.png`), Buffer.from(shot.result.data, 'base64'));

      // 5. Open details drawer
      await send('Runtime.evaluate', {
        expression: `
          const det = document.querySelector('#${p.stepId} details');
          if (det) {
            det.open = true;
            det.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        `
      });
      await sleep(500);
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${p.name}_details_open_dark.png`), Buffer.from(shot.result.data, 'base64'));

      // 6. Terminal Closed Section at bottom
      await send('Runtime.evaluate', {
        expression: `
          const close = document.getElementById('close-section');
          if (close) close.scrollIntoView({ behavior: 'instant', block: 'center' });
        `
      });
      await sleep(500);
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${p.name}_close_section_dark.png`), Buffer.from(shot.result.data, 'base64'));
    }

    ws.close();
    chromeProc.kill();
    console.log('All module screenshots captured successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
    chromeProc.kill();
  }
}

capture();
