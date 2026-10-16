const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

test('callouts schematic circuit boot implementation', () => {
  const calloutsJs = fs.readFileSync(path.join(ROOT, 'assets/js/callouts.js'), 'utf8');
  assert.match(calloutsJs, /runCircuitBoot/, 'callouts.js should define runCircuitBoot');
  assert.match(calloutsJs, /strokeDasharray/, 'callouts.js should configure strokeDasharray');
  assert.match(calloutsJs, /strokeDashoffset/, 'callouts.js should configure strokeDashoffset');
  assert.match(calloutsJs, /prefers-reduced-motion/, 'callouts.js should respect prefers-reduced-motion');
  // Check outward coordinate drawing M x y L elbow fromY H fromX
  assert.match(calloutsJs, /`M \$\{x\} \$\{y\} L \$\{elbow\} \$\{fromY\} H \$\{fromX\}`/, 'paths should draw outward from center dot to cards');

  const automationCss = fs.readFileSync(path.join(ROOT, 'assets/css/automation.css'), 'utf8');
  assert.match(automationCss, /@keyframes targetDotPulse/, 'automation.css should define targetDotPulse');
  assert.match(automationCss, /\.target-dot\.pulse/, 'automation.css should style pulsing target-dot');
  assert.match(automationCss, /opacity \.35s ease, transform \.35s/, 'automation.css should provide smooth entrance transition on map-callout');
});
