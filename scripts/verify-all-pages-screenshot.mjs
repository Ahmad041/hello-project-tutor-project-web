import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function capturePage(url, filePrefix, targetSectionId) {
  const userDataDir = `C:\\Users\\ahamd\\AppData\\Local\\Temp\\chrome-verify-${filePrefix}`;
  const port = Math.floor(9227 + Math.random() * 50);

  const chromeProc = spawn(chromePath, [
    '--headless',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    url
  ]);

  try {
    let wsUrl = null;
    for (let i = 0; i < 25; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json`);
        const tabs = await res.json();
        const t = tabs.find(x => x.type === 'page');
        if (t && t.webSocketDebuggerUrl) {
          wsUrl = t.webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
      await sleep(300);
    }

    if (!wsUrl) throw new Error(`Chrome did not launch debugger on port ${port}`);

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

    // Dark mode + scroll to section
    await send('Runtime.evaluate', {
      expression: `
        document.documentElement.classList.add('dark');
        const s = document.getElementById('${targetSectionId}');
        if (s) s.scrollIntoView({ block: 'start' });
        const b = document.querySelector('[data-step-btn="2"]');
        if (b) b.click();
      `
    });

    await sleep(800);

    const shotDark = await send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true
    });

    const outDir = 'C:/Users/ahamd/.gemini/antigravity/brain/b26c682d-ad95-4dba-b0f0-09a27746aa27';
    fs.writeFileSync(`${outDir}/verified_${filePrefix}_dark.png`, Buffer.from(shotDark.data, 'base64'));
    console.log(`Saved verified_${filePrefix}_dark.png`);

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

async function main() {
  await capturePage('file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/teknis.html', 'teknis_fig35', 'lib-position');
  await capturePage('file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/testing.html', 'testing_fig41', 'ui-sketch');
}

main().catch(err => {
  console.error('Run error:', err);
  process.exit(1);
});
