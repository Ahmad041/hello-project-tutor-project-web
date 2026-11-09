import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\ahamd\\.gemini\\antigravity\\brain\\b26c682d-ad95-4dba-b0f0-09a27746aa27';
const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const uatHtml = 'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/game/uat.html';

console.log('Launching Chrome for User Testing simulator screenshots...');
const chrome = spawn(chromeExe, [
  '--headless=new',
  '--remote-debugging-port=9223',
  '--allow-file-access-from-files',
  '--window-size=1500,1050',
  '--hide-scrollbars',
  '--disable-gpu',
  'about:blank'
], { stdio: 'ignore' });

async function waitForChrome(port = 9223, maxAttempts = 30) {
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
  try {
    await waitForChrome();

    const newTabRes = await fetch(`http://127.0.0.1:9223/json/new?${uatHtml}`, { method: 'PUT' });
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
    await send('DOM.enable');
    await send('Runtime.enable');

    // Automatically dismiss any unexpected dialog
    ws.addEventListener('message', async (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Page.javascriptDialogOpening') {
        await send('Page.handleJavaScriptDialog', { accept: true });
      }
    });

    await new Promise(r => setTimeout(r, 1200));

    // Capture 1: Initial Cockpit with yellow category banners & 9 columns
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'ut_table_initial.png'), Buffer.from(snap1.data, 'base64'));
    console.log('Saved ut_table_initial.png');

    // Action: Click Inject MS002
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('btnInject').click();
      `
    });
    await new Promise(r => setTimeout(r, 400));

    // Action: Click Submit Login to trigger negative validation pass
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('btnLoginSubmit').click();
      `
    });

    // Wait for flying packet animation & impact stamp
    await new Promise(r => setTimeout(r, 1200));

    // Capture 2: Stamped MS002 row with ✓ LULUS, date, and actual tester result
    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'ut_table_stamped.png'), Buffer.from(snap2.data, 'base64'));
    console.log('Saved ut_table_stamped.png');

    ws.close();
  } catch (err) {
    console.error('Error in runner:', err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

run();
