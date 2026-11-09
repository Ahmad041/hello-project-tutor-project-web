import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\ahamd\\AppData\\Local\\Temp\\chrome-blueprint-verify';

const chromeProc = spawn(chromePath, [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9224',
  `--user-data-dir=${userDataDir}`,
  'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/project.html'
]);

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9224/json');
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('project.html')) || tabs.find(t => t.type === 'page');
      if (pageTab && pageTab.webSocketDebuggerUrl) {
        return pageTab.webSocketDebuggerUrl;
      }
    } catch(e) {}
    await sleep(300);
  }
  throw new Error('Chrome did not respond on port 9224');
}

async function run() {
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
      }
    };

    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise(r => ws.onopen = r);

    await send('Page.enable');
    await send('DOM.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    // Wait 2 seconds for complete load
    await sleep(2000);

    // Evaluate in page: set dark mode and scroll blueprint into view
    await send('Runtime.evaluate', {
      expression: `
        document.documentElement.classList.add('dark');
        const el = document.getElementById('blueprint-svg');
        if (el) el.scrollIntoView({ block: 'center' });
      `
    });

    await sleep(800);

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('blueprint-svg');
          if (!el) return JSON.stringify({ error: 'element not found' });
          const r = el.getBoundingClientRect();
          return JSON.stringify({
            x: Math.round(r.left + window.scrollX),
            y: Math.round(r.top + window.scrollY),
            width: Math.round(r.width),
            height: Math.round(r.height)
          });
        })()
      `,
      returnByValue: true
    });

    console.log('evalRes:', evalRes);
    const box = JSON.parse(evalRes.result.value);
    console.log('Bounding box (page coords):', box);

    // Capture screenshot of the box
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      fromSurface: true,
      clip: {
        x: Math.max(0, box.x - 20),
        y: Math.max(0, box.y - 20),
        width: box.width + 40,
        height: box.height + 40,
        scale: 1
      }
    });

    const outPath = 'C:/Users/ahamd/.gemini/antigravity/brain/b26c682d-ad95-4dba-b0f0-09a27746aa27/blueprint_arrow_fixed_dark.png';
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log('Screenshot saved to:', outPath);

    // Light Mode
    await send('Runtime.evaluate', {
      expression: `document.documentElement.classList.remove('dark');`
    });
    await sleep(400);

    const shotLight = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      fromSurface: true,
      clip: {
        x: Math.max(0, box.x - 20),
        y: Math.max(0, box.y - 20),
        width: box.width + 40,
        height: box.height + 40,
        scale: 1
      }
    });

    const outPathLight = 'C:/Users/ahamd/.gemini/antigravity/brain/b26c682d-ad95-4dba-b0f0-09a27746aa27/blueprint_arrow_fixed_light.png';
    fs.writeFileSync(outPathLight, Buffer.from(shotLight.data, 'base64'));
    console.log('Light mode screenshot saved to:', outPathLight);

    ws.close();
  } catch(err) {
    console.error('Error:', err);
  } finally {
    chromeProc.kill();
  }
}

run();
