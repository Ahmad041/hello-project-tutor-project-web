import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\ahamd\\.gemini\\antigravity\\brain\\b26c682d-ad95-4dba-b0f0-09a27746aa27';
const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = 'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/tutorial-github.html';

console.log('Launching Chrome headless...');
const chrome = spawn(chromeExe, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--allow-file-access-from-files',
  '--window-size=1280,900',
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

  const newTabRes = await fetch(`http://127.0.0.1:9222/json/new?${htmlPath}`, { method: 'PUT' });
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
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Waiting 1500ms for fonts & DOM...');
  await new Promise(r => setTimeout(r, 1500));

  // 1. Top Section Screenshot
  const snap1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'tutorial_github_top.png'), Buffer.from(snap1.data, 'base64'));
  console.log('Captured tutorial_github_top.png');

  // 2. Middle Section Screenshot (Scroll down)
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 750);' });
  await new Promise(r => setTimeout(r, 500));
  const snap2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'tutorial_github_mid.png'), Buffer.from(snap2.data, 'base64'));
  console.log('Captured tutorial_github_mid.png');

  // 3. Lower Section Screenshot (Scroll down more)
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 1600);' });
  await new Promise(r => setTimeout(r, 500));
  const snap3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'tutorial_github_bottom.png'), Buffer.from(snap3.data, 'base64'));
  console.log('Captured tutorial_github_bottom.png');

  // 4. Full Page Screenshot
  const snapFull = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync(path.join(artifactDir, 'tutorial_github_full.png'), Buffer.from(snapFull.data, 'base64'));
  console.log('Captured tutorial_github_full.png');

  ws.close();
  chrome.kill();
  console.log('All screenshots captured successfully!');
}

run().catch(err => {
  console.error(err);
  try { chrome.kill(); } catch (_) {}
  process.exit(1);
});
