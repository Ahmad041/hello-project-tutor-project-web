import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\ahamd\\AppData\\Local\\Temp\\chrome-verify-all';
const artifactDir = 'C:\\Users\\ahamd\\.gemini\\antigravity\\brain\\b26c682d-ad95-4dba-b0f0-09a27746aa27';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getWsUrl(port = 9228) {
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page');
      if (pageTab && pageTab.webSocketDebuggerUrl) {
        return pageTab.webSocketDebuggerUrl;
      }
    } catch (e) {}
    await sleep(300);
  }
  throw new Error(`Chrome did not respond on port ${port}`);
}

async function captureElement(send, selector, outputPath, padding = 16) {
  const rectRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: Math.round(r.left + window.scrollX),
          y: Math.round(r.top + window.scrollY),
          width: Math.round(r.width),
          height: Math.round(r.height)
        };
      })()
    `,
    returnByValue: true
  });

  const box = rectRes.result?.value;
  if (!box) {
    console.error(`Selector ${selector} not found!`);
    return false;
  }

  const screenshot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    fromSurface: true,
    clip: {
      x: Math.max(0, box.x - padding),
      y: Math.max(0, box.y - padding),
      width: box.width + (padding * 2),
      height: box.height + (padding * 2),
      scale: 1
    }
  });

  fs.writeFileSync(outputPath, Buffer.from(screenshot.data, 'base64'));
  console.log(`Saved screenshot: ${path.basename(outputPath)}`);
  return true;
}

async function main() {
  const chromeProc = spawn(chromePath, [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9228',
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ]);

  try {
    const wsUrl = await getWsUrl(9228);
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
      width: 1200,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    const pages = [
      {
        url: 'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/project.html',
        targets: [
          { sel: '#blueprint-svg', name: 'verified_modul01_blueprint' }
        ]
      },
      {
        url: 'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/analisis.html',
        targets: [
          { sel: '#user-testing .story-anatomy', name: 'verified_modul02_fig21' },
          { sel: '#product-documentation .story-anatomy', name: 'verified_modul02_fig23' }
        ]
      },
      {
        url: 'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/teknis.html',
        targets: [
          { sel: '#folder .story-anatomy', name: 'verified_modul03_fig31' },
          { sel: '#lib-position .story-anatomy', name: 'verified_modul03_fig35' },
          { sel: '#lib-input .story-anatomy', name: 'verified_modul03_fig37' }
        ]
      },
      {
        url: 'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/testing.html',
        targets: [
          { sel: '#ui-sketch .story-anatomy', name: 'verified_modul04_fig41' },
          { sel: '#ascii-c .story-anatomy', name: 'verified_modul04_fig43' }
        ]
      }
    ];

    for (const page of pages) {
      console.log(`Navigating to ${page.url}...`);
      await send('Page.navigate', { url: page.url });
      await sleep(1500);

      for (const target of page.targets) {
        // Light mode
        await send('Runtime.evaluate', { expression: `document.documentElement.classList.remove('dark');` });
        await sleep(300);
        await captureElement(send, target.sel, path.join(artifactDir, `${target.name}_light.png`));

        // Dark mode
        await send('Runtime.evaluate', { expression: `document.documentElement.classList.add('dark');` });
        await sleep(300);
        await captureElement(send, target.sel, path.join(artifactDir, `${target.name}_dark.png`));
      }
    }

    console.log('ALL MODULE VERIFICATION CAPTURES COMPLETED!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    try { chromeProc.kill(); } catch (e) {}
  }
}

main();
