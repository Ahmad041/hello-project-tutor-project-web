import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\ahamd\\AppData\\Local\\Temp\\chrome-verify-details';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function capture() {
  const chromeProc = spawn(chromePath, [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9226',
    `--user-data-dir=${userDataDir}`,
    'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/analisis.html'
  ]);

  try {
    let wsUrl = null;
    for (let i = 0; i < 25; i++) {
      try {
        const res = await fetch('http://127.0.0.1:9226/json');
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
      height: 960,
      deviceScaleFactor: 2,
      mobile: false
    });

    await sleep(1500);

    // Dark mode + open details drawer and scroll to it
    await send('Runtime.evaluate', {
      expression: `
        document.documentElement.classList.add('dark');
        const details = document.querySelector('details.arch-details');
        if (details) {
          details.open = true;
          details.scrollIntoView({ block: 'start' });
        }
      `
    });

    await sleep(800);

    const shotDark = await send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true
    });

    const outDir = 'C:/Users/ahamd/.gemini/antigravity/brain/b26c682d-ad95-4dba-b0f0-09a27746aa27';
    fs.writeFileSync(`${outDir}/verified_details_open_dark.png`, Buffer.from(shotDark.data, 'base64'));
    console.log('Saved verified_details_open_dark.png');

    // Light mode
    await send('Runtime.evaluate', {
      expression: `document.documentElement.classList.remove('dark');`
    });

    await sleep(800);

    const shotLight = await send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true
    });

    fs.writeFileSync(`${outDir}/verified_details_open_light.png`, Buffer.from(shotLight.data, 'base64'));
    console.log('Saved verified_details_open_light.png');

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
