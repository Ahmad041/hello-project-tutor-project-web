import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\ahamd\\.gemini\\antigravity\\brain\\b26c682d-ad95-4dba-b0f0-09a27746aa27';
const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ffmpegExe = 'C:\\Users\\ahamd\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe';
const uatHtml = 'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/game/uat.html';
const framesDir = path.resolve('temp_ut_frames');

if (fs.existsSync(framesDir)) {
  fs.rmSync(framesDir, { recursive: true, force: true });
}
fs.mkdirSync(framesDir, { recursive: true });

console.log('1. Launching Chrome for User Testing Gameplay Recording...');
const chrome = spawn(chromeExe, [
  '--headless=new',
  '--remote-debugging-port=9224',
  '--allow-file-access-from-files',
  '--window-size=1440,900',
  '--hide-scrollbars',
  '--disable-gpu',
  'about:blank'
], { stdio: 'ignore' });

async function waitForChrome(port = 9224, maxAttempts = 30) {
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
    console.log('2. Opening User Testing simulator in Chrome...');
    const newTabRes = await fetch(`http://127.0.0.1:9224/json/new?${uatHtml}`, { method: 'PUT' });
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

    let frameCount = 0;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      } else if (data.method === 'Page.screencastFrame') {
        const { data: base64Data, sessionId } = data.params;
        frameCount++;
        const frameFile = path.join(framesDir, `frame_${String(frameCount).padStart(5, '0')}.jpg`);
        fs.writeFileSync(frameFile, Buffer.from(base64Data, 'base64'));
        send('Page.screencastFrameAck', { sessionId }).catch(() => {});
      } else if (data.method === 'Page.javascriptDialogOpening') {
        send('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
      }
    };

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    console.log('3. Starting screencast capture...');
    await send('Page.startScreencast', {
      format: 'jpeg',
      quality: 85,
      maxWidth: 1440,
      maxHeight: 900,
      everyNthFrame: 1
    });

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true
      });
      return res.result?.value;
    }

    async function sleep(ms) {
      await new Promise(r => setTimeout(r, ms));
    }

    console.log('4. Performing User Testing gameplay scenarios...');
    await sleep(1500); // Initial showcase

    // Step 1: Inject Scenario MS002 (Negative Login Test)
    console.log('-> Injecting MS002 (Password Salah)...');
    await evaluate(`document.getElementById('btnInject').click();`);
    await sleep(800);

    // Step 2: Submit Login Form -> triggers flying packet animation to table
    console.log('-> Submitting MS002...');
    await evaluate(`document.getElementById('btnLoginSubmit').click();`);
    await sleep(1800); // Wait for packet flight and impact stamp

    // Step 3: Inject Scenario MS003 (Negative Login: Akun Tidak Ada)
    console.log('-> Injecting MS003 (Akun Tidak Ada)...');
    await evaluate(`document.getElementById('btnInject').click();`);
    await sleep(800);

    // Step 4: Submit Login Form -> triggers flying packet to MS003
    console.log('-> Submitting MS003...');
    await evaluate(`document.getElementById('btnLoginSubmit').click();`);
    await sleep(1800); // Wait for packet flight and impact stamp

    // Step 5: Now positive test MS001 (Happy Path) is unlocked!
    console.log('-> Injecting MS001 (Happy Path Login)...');
    await evaluate(`document.getElementById('btnInject').click();`);
    await sleep(800);

    // Step 6: Submit MS001 -> triggers flying packet to MS001
    console.log('-> Submitting MS001...');
    await evaluate(`document.getElementById('btnLoginSubmit').click();`);
    await sleep(2200); // Wait for packet flight, impact stamp, and unlock transition

    console.log('5. Stopping screencast...');
    await send('Page.stopScreencast');
    ws.close();

    console.log(`6. Captured ${frameCount} frames. Encoding MP4 video with ffmpeg...`);
    const outputVideo = path.join(artifactDir, 'user_testing_gameplay.mp4');
    const localVideo = path.resolve('user_testing_gameplay.mp4');

    const cmd = `"${ffmpegExe}" -y -framerate 12 -i "${path.join(framesDir, 'frame_%05d.jpg')}" -c:v libx264 -pix_fmt yuv420p -vf "scale=1440:900" "${localVideo}"`;
    execSync(cmd, { stdio: 'inherit' });

    fs.copyFileSync(localVideo, outputVideo);
    console.log(`7. Video saved successfully at:\n${outputVideo}\nLocal: ${localVideo}`);

  } catch (err) {
    console.error('Error during recording:', err);
  } finally {
    chrome.kill();
    // Cleanup temporary frame images
    if (fs.existsSync(framesDir)) {
      fs.rmSync(framesDir, { recursive: true, force: true });
    }
    process.exit(0);
  }
}

run();
