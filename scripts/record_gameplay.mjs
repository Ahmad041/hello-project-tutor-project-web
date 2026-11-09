import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\ahamd\\.gemini\\antigravity\\brain\\b26c682d-ad95-4dba-b0f0-09a27746aa27';
const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ffmpegExe = 'C:\\Users\\ahamd\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe';
const gameHtml = 'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/game/git-emergency.html';
const framesDir = path.resolve('temp_game_frames');

if (fs.existsSync(framesDir)) {
  fs.rmSync(framesDir, { recursive: true, force: true });
}
fs.mkdirSync(framesDir, { recursive: true });

console.log('1. Launching Chrome headless on port 9222...');
const chrome = spawn(chromeExe, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--allow-file-access-from-files',
  '--window-size=1280,820',
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
  console.log('2. Opening Game in Chrome tab...');
  const newTabRes = await fetch(`http://127.0.0.1:9222/json/new?${gameHtml}`, { method: 'PUT' });
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
      const { data: base64Data, metadata, sessionId } = data.params;
      frameCount++;
      const frameFile = path.join(framesDir, `frame_${String(frameCount).padStart(5, '0')}.jpg`);
      fs.writeFileSync(frameFile, Buffer.from(base64Data, 'base64'));
      // Acknowledge frame
      send('Page.screencastFrameAck', { sessionId }).catch(() => {});
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  console.log('3. Starting screencast capture...');
  await send('Page.startScreencast', {
    format: 'jpeg',
    quality: 85,
    maxWidth: 1280,
    maxHeight: 820,
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

  async function typeInCli(text, delayMs = 45) {
    for (let i = 1; i <= text.length; i++) {
      const partial = text.substring(0, i);
      await evaluate(`(() => {
        const input = document.getElementById('cliInput');
        if (input) {
          input.value = ${JSON.stringify(partial)};
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()`);
      await sleep(delayMs);
    }
  }

  async function pressEnter() {
    await evaluate(`(() => {
      if (window.submitCliCommand) {
        window.submitCliCommand();
      }
    })()`);
    await sleep(400);
  }

  console.log('4. Recording gameplay actions...');
  await sleep(1000); // Initial view

  // Level 1: Type git status
  console.log(' - Typing: git status');
  await typeInCli('git status');
  await sleep(300);
  await pressEnter();
  await sleep(1000);

  // Level 1: Type git add src/kasir.c
  console.log(' - Typing: git add src/kasir.c');
  await typeInCli('git add src/kasir.c');
  await sleep(200);
  await pressEnter();
  await sleep(800);

  // Level 1: Type git add include/struk.h
  console.log(' - Typing: git add include/struk.h');
  await typeInCli('git add include/struk.h');
  await sleep(200);
  await pressEnter();
  await sleep(800);

  // Level 1: Type git commit
  console.log(' - Typing: git commit -m "[FEAT] Modul diskon KasirKita"');
  await typeInCli('git commit -m "[FEAT] Modul diskon KasirKita"');
  await sleep(300);
  await pressEnter();
  await sleep(1500); // Celebration modal visible

  // Proceed to Level 2
  console.log(' - Proceeding to Level 2');
  await evaluate(`(() => { window.proceedToNextLevel(); })()`);
  await sleep(1200);

  // Level 2: Type git checkout -b feat/diskon
  console.log(' - Typing: git checkout -b feat/diskon');
  await typeInCli('git checkout -b feat/diskon');
  await sleep(300);
  await pressEnter();
  await sleep(1200);

  // Level 2: Commit feature
  console.log(' - Typing: git commit -m "[FEAT] Logika diskon member"');
  await typeInCli('git commit -m "[FEAT] Logika diskon member"');
  await sleep(300);
  await pressEnter();
  await sleep(1500);

  // Proceed to Level 3
  console.log(' - Proceeding to Level 3');
  await evaluate(`(() => { window.proceedToNextLevel(); })()`);
  await sleep(1200);

  // Level 3: Pull remote
  console.log(' - Typing: git pull origin main');
  await typeInCli('git pull origin main');
  await sleep(300);
  await pressEnter();
  await sleep(1000);

  // Level 3: Push remote
  console.log(' - Typing: git push origin feat/diskon');
  await typeInCli('git push origin feat/diskon');
  await sleep(300);
  await pressEnter();
  await sleep(1800); // Laser beam animation & celebration

  // Proceed to Level 4
  console.log(' - Proceeding to Level 4');
  await evaluate(`(() => { window.proceedToNextLevel(); })()`);
  await sleep(1200);

  // Level 4: Merge conflict trigger
  console.log(' - Typing: git merge origin/main');
  await typeInCli('git merge origin/main');
  await sleep(300);
  await pressEnter();
  await sleep(1500);

  // Level 4: Resolve conflict
  console.log(' - Resolving conflict with "both" strategy');
  await evaluate(`(() => { window.resolveConflict('both'); })()`);
  await sleep(2500); // Finale celebration

  console.log('5. Stopping screencast...');
  await send('Page.stopScreencast');
  await sleep(500);

  ws.close();
  chrome.kill();

  console.log(`Captured ${frameCount} frames in ${framesDir}`);

  if (frameCount > 0) {
    const videoOutput = path.join(artifactDir, 'git_emergency_gameplay.mp4');
    const localVideo = path.resolve('git_emergency_gameplay.mp4');
    console.log('6. Encoding MP4 video with ffmpeg...');
    const ffmpegCmd = `"${ffmpegExe}" -y -framerate 15 -i "${path.join(framesDir, 'frame_%05d.jpg')}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${videoOutput}"`;
    execSync(ffmpegCmd, { stdio: 'inherit' });
    
    // Also copy to workspace
    fs.copyFileSync(videoOutput, localVideo);

    console.log('SUCCESS! Video generated at:');
    console.log(videoOutput);
    console.log(localVideo);
  }
}

run().catch(err => {
  console.error('Error running gameplay recorder:', err);
  chrome.kill();
  process.exit(1);
});
