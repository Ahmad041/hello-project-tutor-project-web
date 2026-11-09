import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\ahamd\\.gemini\\antigravity\\brain\\59926c6c-d442-4bad-991d-c2c60be1723e';
const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetHtml = 'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/storyboard.html';

console.log('Launching Chrome for Storyboard verification...');
const chrome = spawn(chromeExe, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--allow-file-access-from-files',
  '--window-size=1440,2400',
  '--hide-scrollbars',
  '--disable-gpu',
  'about:blank'
], { stdio: 'ignore' });

async function waitForChrome(port = 9222, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return await res.json();
    } catch (_) {}
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error('Chrome did not start in time');
}

async function run() {
  await waitForChrome();

  const newTabRes = await fetch(`http://127.0.0.1:9222/json/new?${targetHtml}`, { method: 'PUT' });
  const tab = await newTabRes.json();
  const wsUrl = tab.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER CONSOLE]', data.params.type, data.params.args.map(a => a.value || a.description).join(' '));
    }
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('DOM.enable');

  console.log('Waiting for storyboard render...');
  await new Promise(r => setTimeout(r, 2500));

  // Check if all 7 canvases are rendered
  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const canvases = document.querySelectorAll('canvas');
      const results = [];
      canvases.forEach(c => {
        const ctx = c.getContext('2d');
        const imgData = ctx.getImageData(0, 0, 10, 10).data;
        // check if not all transparent
        const hasColor = Array.from(imgData).some(v => v > 0);
        results.push({ id: c.id, width: c.width, height: c.height, hasColor });
      });
      return JSON.stringify(results);
    })()`
  });

  console.log('Canvas check result:', evalRes.result.value);

  // Capture screenshot of the full storyboard
  const snap = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync(path.join(artifactDir, 'storyboard_overview.png'), Buffer.from(snap.data, 'base64'));
  console.log('Full storyboard screenshot saved to artifact directory!');

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  try { chrome.kill(); } catch (_) {}
  process.exit(1);
});
