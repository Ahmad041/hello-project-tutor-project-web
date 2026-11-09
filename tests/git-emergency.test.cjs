const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

test('game/git-emergency.html exists and is properly structured', () => {
  const filePath = path.join(rootDir, 'game', 'git-emergency.html');
  assert.ok(fs.existsSync(filePath), 'game/git-emergency.html must exist');

  const content = fs.readFileSync(filePath, 'utf8');

  // Must force black background immediately
  assert.match(content, /background:\s*#000000\s*!important/);

  // Must include DAG SVG Canvas & Commit Nodes
  assert.match(content, /id="dagSvg"/);
  assert.match(content, /id="commitNodesGroup"/);
  assert.match(content, /c0-9f12/);
  assert.match(content, /c1-3d8b/);
  assert.match(content, /c2-4a19/);
  assert.match(content, /id="nodeC3"/);
  assert.match(content, /id="nodeC4"/);
  assert.match(content, /id="nodeC5"/);

  // Must include Floating HEAD Pointer
  assert.match(content, /id="headPointerTag"/);

  // Must include Level 1-4 Switchers with Progressive Locking
  assert.match(content, /onclick="switchLevel\(1\)"/);
  assert.match(content, /onclick="switchLevel\(2\)"/);
  assert.match(content, /onclick="switchLevel\(3\)"/);
  assert.match(content, /onclick="switchLevel\(4\)"/);
  assert.match(content, /id="lockLvl2"/);
  assert.match(content, /id="lockLvl3"/);
  assert.match(content, /id="lockLvl4"/);

  // Must include Interactive Mission Briefing, Narrative Story & Clue Box
  assert.match(content, /id="missionClueBox"/);
  assert.match(content, /id="missionStory"/);
  assert.match(content, /id="missionClueText"/);
  assert.match(content, /id="task1Item"/);
  assert.match(content, /id="task2Item"/);
  assert.match(content, /id="task3Item"/);

  // Must include Working Tree File Dispatcher with Traps
  assert.match(content, /src\/kasir\.c/);
  assert.match(content, /include\/struk\.h/);
  assert.match(content, /build\/kasir\.exe/);
  assert.match(content, /logs\/debug_run\.log/);
  assert.match(content, /triggerBinaryTrap\(\)/);

  // Must include Terminal Window Mockup with macOS dots
  assert.match(content, /class="terminal-mockup"/);
  assert.match(content, /class="mac-dot red"/);
  assert.match(content, /class="mac-dot yellow"/);
  assert.match(content, /class="mac-dot green"/);

  // Must include Interactive Terminal CLI Prompt & Interpreter Engine
  assert.match(content, /id="cliForm"/);
  assert.match(content, /id="cliInput"/);
  assert.match(content, /id="cliPrompt"/);
  assert.match(content, /id="cliSubmitBtn"/);
  assert.match(content, /executeGitCommand/);
  assert.match(content, /submitCliCommand/);
  assert.match(content, /fillCliCommand/);
  assert.match(content, /class="file-cli-chip"/);

  // Must include Tactical Command Deck with Level-Aware Guidance
  assert.match(content, /runCmdStatus\(\)/);
  assert.match(content, /runCmdAddSafe\(\)/);
  assert.match(content, /runCmdBranchFeat\(\)/);
  assert.match(content, /runCmdPullRemote\(\)/);
  assert.match(content, /runCmdPushRemote\(\)/);
  assert.match(content, /triggerConflictSimulation\(\)/);

  // Must include Conflict Defuser Modal with 3-Way Diff
  assert.match(content, /id="conflictModal"/);
  assert.match(content, /&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD/);
  assert.match(content, /=======/);
  assert.match(content, /&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin\/main/);
  assert.match(content, /resolveConflict\('both'\)/);

  // Must include Level-up Celebration and Reset Functions
  assert.match(content, /id="levelUpModal"/);
  assert.match(content, /resetAllProgress\(\)/);

  // Must include Pure Web Audio API Synthesizer
  assert.match(content, /AudioContext/);
  assert.match(content, /createOscillator/);
});

test('tutorial-github.html links directly to game/git-emergency.html', () => {
  const filePath = path.join(rootDir, 'tutorial-github.html');
  const content = fs.readFileSync(filePath, 'utf8');

  assert.match(content, /href="game\/git-emergency\.html"/, 'Must contain link to game simulator');
});
