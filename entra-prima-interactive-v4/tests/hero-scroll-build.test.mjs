import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

const mobileHero='4c8b478c-bb32-45a7-a8f1-7a2d0b3b9a1b.png';

assert.match(html,/data-immersive-hero/);
assert.ok(html.includes(mobileHero),'latest vertical mobile hero must be used');
assert.match(html,/hero-mobile-base/);
assert.match(html,/hero-mobile-word-layer/);
assert.match(html,/hero-mobile-house-layer/);
assert.match(html,/data-hero-menu/);
assert.match(html,/data-hero-logo/);
assert.match(html,/data-hero-scroll/);

assert.match(css,/\.immersive-hero/);
assert.match(css,/@keyframes heroWordDrift/);
assert.match(css,/@keyframes heroHouseDrift/);
assert.match(css,/@media\(max-width:720px\)/);
assert.match(css,/\.hero-mobile-scene/);
assert.match(js,/data-immersive-hero/);
assert.match(js,/data-hero-menu/);
assert.match(js,/hero-active/);
assert.match(js,/--hero-progress/);

for(const id of ['engine','perception','difference','measurement','finale']){
  assert.ok(html.includes(`id="${id}"`),`${id} must remain`);
}
console.log('immersive-mobile-hero test: PASS');
