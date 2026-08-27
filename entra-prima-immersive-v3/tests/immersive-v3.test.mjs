import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

// Brand portfolio only: no client-project gallery and no fake playback.
for (const forbidden of ['Luigi Monza', 'GM Gioielli', 'Domenico Tesoro', '<video', 'globe3d', 'services3d']) {
  assert.ok(!html.includes(forbidden), `forbidden legacy content found: ${forbidden}`);
}
assert.ok(!html.match(/id=["']contact/i), 'client-facing deck must not contain a contact section');

// One continuous narrative in the exact commercial order.
const sceneIds = ['hero', 'websites', 'motion', 'three-d', 'attention', 'world', 'conversion'];
let cursor = -1;
for (const id of sceneIds) {
  const next = html.indexOf(`id="${id}"`);
  assert.ok(next > cursor, `scene ${id} missing or out of order`);
  cursor = next;
}

assert.match(html, /id="hero-webgl"/);
assert.match(html, /id="object-webgl"/);
assert.match(html, /ATTENZIONE/);
assert.match(html, /ESPERIENZA/);
assert.match(html, /DESIDERIO/);
assert.match(html, /AZIONE/);
assert.match(html, /LONDON/);
assert.match(html, /NEW YORK/);
assert.match(html, /DUBAI/);

// Scroll scenes must be locally gated by viewport visibility.
assert.match(js, /function sceneProgress\(/);
assert.match(js, /rect\.bottom\s*<=\s*0\s*\|\|\s*rect\.top\s*>=\s*vh/);
assert.match(js, /requestAnimationFrame\(renderFrame\)/);
assert.match(js, /prefers-reduced-motion/);

// Mobile is a dedicated composition, not desktop squeezed down.
assert.match(css, /@media\s*\(max-width:\s*720px\)/);
assert.match(css, /\.scene-sticky/);
assert.match(css, /touch-action:\s*pan-y/);

console.log('immersive v3 structure: PASS');
