import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\ahamd\\AppData\\Local\\Temp\\chrome-verify-fixes';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function capture() {
  const chromeProc = spawn(chromePath, [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9225',
    `--user-data-dir=${userDataDir}`,
    'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/analisis.html'
  ]);

  try {
    let wsUrl = null;
    for (let i = 0; i < 25; i++) {
      try {
        const res = await fetch('http://127.0.0.1:9225/json');
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

    // 1. Dark mode + scroll to user-testing section
    await send('Runtime.evaluate', {
      expression: `
        document.documentElement.classList.add('dark');
        const section = document.getElementById('user-testing');
        if (section) section.scrollIntoView({ block: 'start' });
        // Click Step 2 button to test interactivity
        const btn2 = document.querySelector('[data-step-btn="2"]');
        if (btn2) btn2.click();
      `
    });

    await sleep(800);

    const shotDark = await send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true
    });

    const outDir = 'C:/Users/ahamd/.gemini/antigravity/brain/b26c682d-ad95-4dba-b0f0-09a27746aa27';
    fs.writeFileSync(`${outDir}/verified_analisis_step2_dark.png`, Buffer.from(shotDark.data, 'base64'));
    console.log('Saved verified_analisis_step2_dark.png');

    // 2. Light mode
    await send('Runtime.evaluate', {
      expression: `
        document.documentElement.classList.remove('dark');
        // Click Step 1
        const btn1 = document.querySelector('[data-step-btn="1"]');
        if (btn1) btn1.click();
      `
    });

    await sleep(800);

    const shotLight = await send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true
    });

    fs.writeFileSync(`${outDir}/verified_analisis_step1_light.png`, Buffer.from(shotLight.data, 'base64'));
    console.log('Saved verified_analisis_step1_light.png');

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
