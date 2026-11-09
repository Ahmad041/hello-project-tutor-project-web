import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const artifactDir = 'C:\\Users\\ahamd\\.gemini\\antigravity\\brain\\59926c6c-d442-4bad-991d-c2c60be1723e';
const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const server = http.createServer((req, res) => {
  const filePath = path.join(process.cwd(), req.url === '/' ? 'storyboard.html' : req.url);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': ext === '.html' ? 'text/html' : 'text/plain',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(8765, async () => {
  console.log('HTTP Server listening on http://127.0.0.1:8765');

  const chrome = spawn(chromeExe, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1440,1200',
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

  try {
    await waitForChrome();
    const newTabRes = await fetch('http://127.0.0.1:9222/json/new?http://127.0.0.1:8765/storyboard.html', { method: 'PUT' });
    const tab = await newTabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

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

    await send('Runtime.enable');
    await send('Page.enable');

    console.log('Waiting 3.5s for Google Fonts to load and canvases to render...');
    await new Promise(r => setTimeout(r, 3500));

    // Re-trigger drawPanel1 to 7 just in case fonts loaded after DOMContentLoaded
    await send('Runtime.evaluate', {
      expression: `(() => {
        drawPanel1(document.getElementById('canvas-1').getContext('2d'));
        drawPanel2(document.getElementById('canvas-2').getContext('2d'));
        drawPanel3(document.getElementById('canvas-3').getContext('2d'));
        drawPanel4(document.getElementById('canvas-4').getContext('2d'));
        drawPanel5(document.getElementById('canvas-5').getContext('2d'));
        drawPanel6(document.getElementById('canvas-6').getContext('2d'));
        drawPanel7(document.getElementById('canvas-7').getContext('2d'));
      })()`
    });

    await new Promise(r => setTimeout(r, 500));

    for (let i = 1; i <= 7; i++) {
      const res = await send('Runtime.evaluate', {
        expression: `document.getElementById('canvas-${i}').toDataURL('image/png')`
      });
      const base64Data = res.result.value.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(path.join(artifactDir, `beat_${i}.png`), Buffer.from(base64Data, 'base64'));
      console.log(`Exported beat_${i}.png`);
    }

    const snap = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    fs.writeFileSync(path.join(artifactDir, 'storyboard_overview.png'), Buffer.from(snap.data, 'base64'));
    console.log('Exported storyboard_overview.png');

    ws.close();
    chrome.kill();
    server.close();
    console.log('Finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    try { chrome.kill(); } catch (_) {}
    server.close();
    process.exit(1);
  }
});
