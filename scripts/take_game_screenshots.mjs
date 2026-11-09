import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\ahamd\\.gemini\\antigravity\\brain\\b26c682d-ad95-4dba-b0f0-09a27746aa27';
const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const gameHtml = 'file:///C:/Users/ahamd/Downloads/Documents/02_Projects/Web%20Hello%20Project/game/git-emergency.html';

console.log('Launching Chrome headless for Game screenshots...');
const chrome = spawn(chromeExe, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--allow-file-access-from-files',
  '--window-size=1400,1050',
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

  console.log('Waiting for game page render...');
  await new Promise(r => setTimeout(r, 1200));

  // 1. Initial State (Level 1 Active, Levels 2-4 Locked, Narrative Story & Clues Visible)
  console.log('Capturing Level 1 with locks, narrative, checklist, and clues...');
  const snap1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'game_git_level1_locked.png'), Buffer.from(snap1.data, 'base64'));

  // 2. Perform Level 1 actions: stage safe files and commit
  console.log('Completing Level 1 (staging and commit) to trigger Level-Up modal...');
  await send('Runtime.evaluate', {
    expression: `
      window.runCmdAddSafe();
      window.executeCommit();
    `
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Capturing Level-Up celebration modal...');
  const snapLvlUp = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'game_git_celebration_unlock.png'), Buffer.from(snapLvlUp.data, 'base64'));

  // 3. Proceed to Level 2
  console.log('Proceeding to Level 2: Branch Divergence...');
  await send('Runtime.evaluate', {
    expression: `
      window.proceedToNextLevel();
      window.runCmdBranchFeat();
    `
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Capturing Level 2 active branch divergence...');
  const snap2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'game_git_level2_active.png'), Buffer.from(snap2.data, 'base64'));

  console.log('Screenshots successfully saved to artifact directory!');
  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  try { chrome.kill(); } catch (_) {}
  process.exit(1);
});
