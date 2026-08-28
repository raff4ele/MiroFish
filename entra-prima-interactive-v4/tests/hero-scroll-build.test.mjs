import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

assert.match(html,/data-immersive-hero/);
assert.match(html,/immersive-hero__word-float/);
assert.match(html,/immersive-hero__house-float/);
assert.match(html,/5a67993d-d0b8-4005-adf7-d43a3d1e2b16\.png/);
assert.ok(!html.includes('data-floating-hero'),'old flat hero must be removed');

assert.match(css,/@keyframes immersiveWordFloatV15/);
assert.match(css,/@keyframes immersiveHouseFloatV15/);
assert.match(css,/\.topbar\.is-over-hero/);
assert.match(css,/@media\(max-width:720px\)/);
assert.match(js,/data-immersive-hero/);
assert.match(js,/is-over-hero/);
assert.match(js,/--immersive-scroll/);
assert.match(js,/requestAnimationFrame/);

for(const id of ['engine','perception','difference','measurement','finale']){
  assert.ok(html.includes(`id="${id}"`),`${id} must remain`);
}
console.log('immersive-mobile-hero test: PASS');
