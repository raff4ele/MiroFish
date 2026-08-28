import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

assert.match(html,/data-immersive-hero/);
assert.match(html,/immersive-hero__word-float/);
assert.match(html,/immersive-hero__house-float/);
assert.match(html,/class="brand"/);

assert.match(css,/V16 — static hero with light effects/);
assert.match(css,/\.immersive-hero__word-float,\s*\.immersive-hero__house-float\s*\{/);
assert.match(css,/animation:none!important/);
assert.match(css,/@keyframes heroFacadeLightV16/);
assert.match(css,/@keyframes heroWordLightV16/);
assert.match(css,/@keyframes heroAmbientLightV16/);

assert.match(js,/data-immersive-hero/);
assert.match(js,/--immersive-scroll/);
assert.match(js,/is-over-hero/);
assert.match(js,/requestAnimationFrame/);

for(const id of ['engine','perception','difference','measurement','finale']){
  assert.ok(html.includes(`id="${id}"`),`${id} must remain`);
}
console.log('static-light-hero test: PASS');
