import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

const heroPhoto='3fe30ef8-2414-45d3-ad4f-b48aa9729c33.jpg';

assert.match(html,/data-floating-hero/,'floating hero required');
assert.ok(html.includes(heroPhoto),'must use exact uploaded hero photo');
assert.ok(!html.includes('data-build-hero'),'construction hero must be removed');
assert.ok(!html.includes('data-build-piece'),'construction pieces must be removed');
assert.match(html,/floating-hero__wordmark/,'independent floating wordmark required');

assert.match(css,/@keyframes heroHouseFloat/,'house animation required');
assert.match(css,/@keyframes heroWordFloat/,'word animation required');
assert.match(css,/\.floating-hero__media/);
assert.match(css,/\.floating-hero__wordmark/);
assert.match(js,/data-floating-hero/);
assert.match(js,/--hero-scroll/);

for(const id of ['engine','perception','difference','measurement','finale']){
  assert.ok(html.includes(`id="${id}"`),`${id} must remain`);
}
console.log('floating-hero test: PASS');
