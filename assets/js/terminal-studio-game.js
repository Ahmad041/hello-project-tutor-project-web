/**
 * terminal-studio-game.js — DOM Controller untuk Terminal Studio
 */
document.addEventListener('DOMContentLoaded', () => {
  const engine = window.TerminalStudioEngine;
  if (!engine) return;

  const grid = engine.createGrid(80, 25);
  const canvas = document.getElementById('terminalCanvas');
  const coordDisplay = document.getElementById('coordDisplay');
  const codeOutput = document.getElementById('codeOutput');
  const btnCopy = document.getElementById('btnCopyCode');
  const btnReset = document.getElementById('btnResetGrid');

  // Tabs
  const tabBtnMod3 = document.getElementById('tabMod3');
  const tabBtnMod4 = document.getElementById('tabMod4');
  const panelMod3 = document.getElementById('panelMod3');
  const panelMod4 = document.getElementById('panelMod4');
  const backBtn = document.getElementById('tsBackBtn');

  // Modul 3 Inputs
  const inputBorderX = document.getElementById('borderX');
  const inputBorderY = document.getElementById('borderY');
  const inputBorderW = document.getElementById('borderW');
  const inputBorderH = document.getElementById('borderH');
  const selectBorderStyle = document.getElementById('borderStyle');
  const btnApplyBorder = document.getElementById('btnApplyBorder');

  const inputTextX = document.getElementById('textX');
  const inputTextY = document.getElementById('textY');
  const inputTextVal = document.getElementById('textVal');
  const btnApplyText = document.getElementById('btnApplyText');

  // Modul 4 Inputs
  const selectAsciiPreset = document.getElementById('asciiPreset');
  const sliderAsciiX = document.getElementById('asciiX');
  const sliderAsciiY = document.getElementById('asciiY');
  const valAsciiX = document.getElementById('valAsciiX');
  const valAsciiY = document.getElementById('valAsciiY');
  const btnApplyAscii = document.getElementById('btnApplyAscii');

  const commands = [];

  function refreshScreen() {
    grid.clear();
    for (const cmd of commands) {
      if (cmd.type === 'border') {
        grid.drawBorder(cmd.x, cmd.y, cmd.w, cmd.h, cmd.style, cmd.color);
      } else if (cmd.type === 'text') {
        grid.drawString(cmd.x, cmd.y, cmd.text, cmd.color);
      } else if (cmd.type === 'ascii') {
        grid.drawAsciiArt(cmd.x, cmd.y, cmd.content, cmd.color);
      }
    }

    const lines = grid.renderLines();
    canvas.textContent = lines.map(l => l.text).join('\n');
    codeOutput.textContent = grid.generateC(commands);
  }

  // Setup default state
  commands.push({ type: 'border', x: 2, y: 1, w: 76, h: 22, style: 'double', color: 0x07 });
  commands.push({ type: 'text', x: 26, y: 3, text: 'KASIRKITA - TOKO ALAT TULIS', color: 0x0E });
  commands.push({ type: 'text', x: 20, y: 5, text: 'Aplikasi Desktop IntelliJ Console (lib.h)', color: 0x0B });
  refreshScreen();

  // Tab switching
  tabBtnMod3.addEventListener('click', () => {
    tabBtnMod3.classList.add('active');
    tabBtnMod4.classList.remove('active');
    panelMod3.style.display = 'flex';
    panelMod4.style.display = 'none';
    backBtn.href = '../teknis.html#lib-position';
    backBtn.innerHTML = '<span>←</span> Kembali ke Modul 03';
  });

  tabBtnMod4.addEventListener('click', () => {
    tabBtnMod4.classList.add('active');
    tabBtnMod3.classList.remove('active');
    panelMod4.style.display = 'flex';
    panelMod3.style.display = 'none';
    backBtn.href = '../testing.html#ascii-letak';
    backBtn.innerHTML = '<span>←</span> Kembali ke Modul 04';
  });

  // Track coordinates on canvas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const charWidth = rect.width / 80;
    const charHeight = rect.height / 25;
    const x = Math.min(79, Math.max(0, Math.floor((e.clientX - rect.left) / charWidth)));
    const y = Math.min(24, Math.max(0, Math.floor((e.clientY - rect.top) / charHeight)));
    coordDisplay.textContent = `X: ${String(x).padStart(2, '0')}, Y: ${String(y).padStart(2, '0')}`;
  });

  // Click canvas to quickly set coordinates
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const charWidth = rect.width / 80;
    const charHeight = rect.height / 25;
    const x = Math.min(79, Math.max(0, Math.floor((e.clientX - rect.left) / charWidth)));
    const y = Math.min(24, Math.max(0, Math.floor((e.clientY - rect.top) / charHeight)));
    inputTextX.value = x;
    inputTextY.value = y;
  });

  // Apply Border Button
  btnApplyBorder.addEventListener('click', () => {
    const x = parseInt(inputBorderX.value, 10) || 0;
    const y = parseInt(inputBorderY.value, 10) || 0;
    const w = parseInt(inputBorderW.value, 10) || 10;
    const h = parseInt(inputBorderH.value, 10) || 5;
    const style = selectBorderStyle.value;
    commands.push({ type: 'border', x, y, w, h, style, color: 0x07 });
    refreshScreen();
  });

  // Apply Text Button
  btnApplyText.addEventListener('click', () => {
    const x = parseInt(inputTextX.value, 10) || 0;
    const y = parseInt(inputTextY.value, 10) || 0;
    const text = inputTextVal.value;
    if (text) {
      commands.push({ type: 'text', x, y, text, color: 0x0B });
      refreshScreen();
    }
  });

  // Live ASCII Art Staging
  function updateAsciiStaging() {
    const preset = selectAsciiPreset.value;
    const asciiContent = engine.ASCII_PRESETS[preset] || '';
    const x = parseInt(sliderAsciiX.value, 10) || 0;
    const y = parseInt(sliderAsciiY.value, 10) || 0;
    valAsciiX.textContent = x;
    valAsciiY.textContent = y;

    // Replace or set active ascii command
    const existingIdx = commands.findIndex(c => c.type === 'ascii');
    const asciiCmd = {
      type: 'ascii',
      x,
      y,
      content: asciiContent,
      filename: `assets/ascii/${preset}.txt`,
      color: 0x0A
    };

    if (existingIdx !== -1) {
      commands[existingIdx] = asciiCmd;
    } else {
      commands.push(asciiCmd);
    }
    refreshScreen();
  }

  sliderAsciiX.addEventListener('input', updateAsciiStaging);
  sliderAsciiY.addEventListener('input', updateAsciiStaging);
  selectAsciiPreset.addEventListener('change', updateAsciiStaging);
  btnApplyAscii.addEventListener('click', updateAsciiStaging);

  // Copy Code
  btnCopyCode.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(codeOutput.textContent);
      const originalText = btnCopy.textContent;
      btnCopy.textContent = 'Tersalin ke Clipboard ✓';
      setTimeout(() => btnCopy.textContent = originalText, 2000);
    } catch (_) {
      btnCopy.textContent = 'Tekan Ctrl+C untuk menyalin';
    }
  });

  // Reset
  btnReset.addEventListener('click', () => {
    commands.length = 0;
    commands.push({ type: 'border', x: 2, y: 1, w: 76, h: 22, style: 'double', color: 0x07 });
    refreshScreen();
  });
});
