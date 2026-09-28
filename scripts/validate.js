#!/usr/bin/env node
// VanishCam repository validation: manifest sanity, file presence, JS syntax.
// Runs in CI and locally: node scripts/validate.js
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const errors = [];
const fail = (msg) => errors.push(msg);

// --- manifest ---
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
} catch (e) {
  fail('manifest.json is not valid JSON: ' + e.message);
}

if (manifest) {
  if (manifest.manifest_version !== 3) fail('manifest_version must be 3');
  if (!manifest.name) fail('manifest.name missing');
  if (!manifest.version || !/^\d+(\.\d+)*$/.test(manifest.version)) fail('manifest.version missing or malformed');
  if (!manifest.description || manifest.description.length > 132) fail('manifest.description missing or too long (store limit 132)');
  if (!manifest.icons) fail('manifest.icons missing');
  if (!manifest.background || !manifest.background.service_worker) fail('background.service_worker missing');
  if (!manifest.commands || !manifest.commands['toggle-vanish']) fail('commands.toggle-vanish missing');

  const files = new Set();
  Object.values(manifest.icons || {}).forEach((f) => files.add(f));
  if (manifest.background) files.add(manifest.background.service_worker);
  (manifest.content_scripts || []).forEach((cs) => (cs.js || []).forEach((f) => files.add(f)));
  for (const f of files) {
    if (!fs.existsSync(path.join(root, f))) fail('manifest references missing file: ' + f);
  }

  const main = (manifest.content_scripts || []).find((cs) => cs.world === 'MAIN');
  if (!main) fail('MAIN-world content script missing');
  else if (!main.js.includes('i18n.js')) fail('i18n.js must load first in the MAIN world');
}

// --- required repo files ---
['README.md', 'LICENSE.txt', 'CHANGELOG.md', 'CODE_OF_CONDUCT.md', 'CONTRIBUTING.md', 'SECURITY.md']
  .forEach((f) => { if (!fs.existsSync(path.join(root, f))) fail('missing ' + f); });

// --- JS syntax check on every script ---
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.js')) checkSyntax(p);
  }
}
function checkSyntax(p) {
  try {
    execFileSync(process.execPath, ['--check', p], { stdio: 'pipe' });
  } catch (e) {
    fail('syntax error in ' + path.relative(root, p) + ': ' + (e.stderr || e.message).toString().trim());
  }
}
walk(root);

// --- privacy guard: no network calls in extension scripts ---
const networkHints = [/\bfetch\s*\(/, /XMLHttpRequest/, /navigator\.sendBeacon/, /new\s+WebSocket\s*\(/];
['i18n.js', 'effect.js', 'snapdetect.js', 'inject.js', 'background.js', 'bridge.js'].forEach((f) => {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) return;
  const src = fs.readFileSync(p, 'utf8');
  networkHints.forEach((re) => {
    if (re.test(src)) fail('privacy violation: ' + f + ' contains ' + re);
  });
});

if (errors.length) {
  console.error('✖ validation failed:');
  errors.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
console.log('✓ manifest, files, syntax and privacy checks passed');
