import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

assert.match(html,/data-immersive-hero/);
assert.match(html,/immersive-hero__word/);
assert.match(html,/immersive-hero__house/);
assert.match(html,/immersive-hero__house-float/);
assert.match(html,/immersive-hero__scroll/);
assert.match(html,/class="brand"/);
assert.match(html,/brand-mark/);
assert.match(html,/brand-name/);

assert.match(css,/@keyframes immersiveWordFloatV15/);
assert.match(css,/@keyframes immersiveHouseFloatV15/);
assert.match(css,/\.topbar\.is-over-hero/);
assert.match(css,/@media\(max-width:720px\)/);
assert.match(js,/data-immersive-hero/);
assert.match(js,/--immersive-scroll/);
assert.match(js,/is-over-hero/);
assert.match(js,/requestAnimationFrame/);

for(const id of ['engine','perception','difference','measurement','finale']){
  assert.ok(html.includes(`id="${id}"`),`${id} must remain`);
}
console.log('real-immersive-hero test: PASS');
