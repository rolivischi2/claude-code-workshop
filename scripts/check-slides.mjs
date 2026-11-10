#!/usr/bin/env node
// Checks that every prompt, template and check command shown on an exercise slide
// (praesentation/uebungen-daten.js) appears verbatim in the matching exercise sheet.
// Run from the repo root: node scripts/check-slides.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(path.join(root, 'praesentation/uebungen-daten.js'), 'utf8'), sandbox);
const norm = (s) => s.replace(/\s+/g, ' ').trim();

let failures = 0, checked = 0;
for (const u of sandbox.window.UEBUNGEN) {
  const sheet = norm(readFileSync(path.join(root, u.sheet), 'utf8'));
  const blocks = [...(u.prompts || []), ...(u.code || [])].map((b) => [b.label, b.text]);
  if (u.fertig && u.fertig.cmd) blocks.push(['Fertig, wenn', u.fertig.cmd]);
  for (const [label, text] of blocks) {
    for (const line of text.split('\n').map(norm).filter(Boolean)) {
      checked++;
      if (!sheet.includes(line)) {
        failures++;
        console.error(`✗ ${u.id} «${label}»: not in ${u.sheet}:\n    ${line}`);
      }
    }
  }
}
console.log(failures ? `${failures} of ${checked} lines differ from the sheets` : `ok: ${checked} lines on ${sandbox.window.UEBUNGEN.length} slides match the sheets`);
process.exit(failures ? 1 : 0);
